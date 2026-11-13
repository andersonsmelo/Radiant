import ExpoModulesCore
import GameKit
import UIKit

/**
 Liga semanal do Radiant pelo Game Center (ADR 2026-11-13).

 O módulo COPIA, não julga, como o do StoreKit: devolve o que o GameKit
 entregou e deixa as regras (qual semana vale, o que reenviar, o que mostrar)
 para o `LeagueService` em TypeScript, onde são testáveis.

 Privacidade: do outro jogador só atravessa a fronteira o apelido (`alias`), a
 posição e a pontuação. Nenhum identificador de jogador sai daqui: quem é o
 jogador local é decidido neste arquivo e atravessa como `isLocalPlayer`.

 Autenticação sem forçar: `authenticate` instala o `authenticateHandler` e
 responde com o primeiro retorno. Se o GameKit oferecer a tela de entrada, ela
 fica guardada e só aparece quando o aluno pede (`presentSignIn`).
 */

internal final class GameCenterException: Exception {
  private let codeValue: String
  private let reasonValue: String

  init(code: String, reason: String) {
    self.codeValue = code
    self.reasonValue = reason
    super.init()
  }

  override var code: String { codeValue }
  override var reason: String { reasonValue }
}

private let kAuthEvent = "onAuthenticationChanged"

public final class RadiantGameCenterModule: Module {
  private var handlerInstalled = false
  private var pendingSignIn: UIViewController?
  private var lastError: Error?
  private var waiters: [(([String: Any]) -> Void)] = []

  public func definition() -> ModuleDefinition {
    Name("RadiantGameCenter")

    Events(kAuthEvent)

    AsyncFunction("authenticate") { () async -> [String: Any] in
      await self.autenticar()
    }

    AsyncFunction("presentSignIn") { () async -> Bool in
      await self.mostrarEntrada()
    }

    AsyncFunction("submitScore") { (leaderboardId: String, score: Int) async throws in
      guard GKLocalPlayer.local.isAuthenticated else {
        throw GameCenterException(code: "not-authenticated", reason: "Jogador do Game Center não autenticado.")
      }
      do {
        try await GKLeaderboard.submitScore(
          score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [leaderboardId])
      } catch {
        throw Self.traduzir(error)
      }
    }

    AsyncFunction("loadEntries") {
      (leaderboardId: String, scope: String, occurrence: String, start: Int, length: Int) async throws -> [String: Any]? in
      guard GKLocalPlayer.local.isAuthenticated else {
        throw GameCenterException(code: "not-authenticated", reason: "Jogador do Game Center não autenticado.")
      }
      do {
        let encontrados = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardId])
        guard var placar = encontrados.first else {
          throw GameCenterException(code: "leaderboard-not-found", reason: "Placar não configurado no App Store Connect.")
        }
        if occurrence == "previous" {
          // Sem ocorrência anterior (primeira semana do placar), não há resumo.
          guard let anterior = try? await placar.loadPreviousOccurrence() else { return nil }
          placar = anterior
        }
        let escopo: GKLeaderboard.PlayerScope = scope == "friends" ? .friendsOnly : .global
        let faixa = NSRange(location: max(1, start), length: max(1, min(length, 100)))
        let (local, entradas, total) = try await placar.loadEntries(for: escopo, timeScope: .allTime, range: faixa)
        let meuId = GKLocalPlayer.local.gamePlayerID
        return [
          "local": local.map { Self.entrada($0, meuId: meuId) } as Any,
          "entries": entradas.map { Self.entrada($0, meuId: meuId) },
          "totalPlayerCount": total,
          "startDate": Self.iso(placar.startDate) as Any,
          "nextStartDate": Self.iso(placar.nextStartDate) as Any,
          "durationSeconds": placar.duration,
        ]
      } catch let erro as GameCenterException {
        throw erro
      } catch {
        throw Self.traduzir(error)
      }
    }
  }

  // MARK: - Autenticação

  @MainActor
  private func autenticar() async -> [String: Any] {
    if handlerInstalled { return estadoAtual() }
    handlerInstalled = true
    return await withCheckedContinuation { continuacao in
      waiters.append { continuacao.resume(returning: $0) }
      GKLocalPlayer.local.authenticateHandler = { [weak self] controlador, erro in
        Task { @MainActor in
          guard let self else { return }
          self.pendingSignIn = controlador
          self.lastError = erro
          self.responderQuemEspera()
          self.sendEvent(kAuthEvent, ["status": self.estadoAtual()["status"] ?? "unavailable"])
        }
      }
      // Medido em 2026-11-13 num simulador iOS 26.5 sem conta: o GameKit falhou
      // por dentro (erro 3, sem o serviço de sobreposição) e nunca chamou o
      // handler. Sem prazo, quem espera fica pendente para sempre.
      Task { @MainActor [weak self] in
        try? await Task.sleep(nanoseconds: 10_000_000_000)
        self?.responderQuemEspera()
      }
    }
  }

  /// Responde uma vez a cada espera pendente; chamar de novo não repete resposta.
  @MainActor
  private func responderQuemEspera() {
    let estado = estadoAtual()
    let esperando = waiters
    waiters.removeAll()
    esperando.forEach { $0(estado) }
  }

  @MainActor
  private func estadoAtual() -> [String: Any] {
    let jogador = GKLocalPlayer.local
    if jogador.isAuthenticated {
      return ["status": "authenticated", "alias": jogador.alias]
    }
    if pendingSignIn != nil { return ["status": "needsSignIn"] }
    let codigo = lastError.map { Self.traduzir($0).code } ?? "not-authenticated"
    return ["status": "unavailable", "reason": codigo]
  }

  /// Mostra a tela de entrada que o GameKit ofereceu. `false` quando não há
  /// tela guardada: o aluno recusou nesta abertura ou o Game Center está
  /// desligado nos Ajustes, e o app diz isso em vez de insistir.
  @MainActor
  private func mostrarEntrada() async -> Bool {
    guard let controlador = pendingSignIn, let topo = Self.controladorDoTopo() else { return false }
    pendingSignIn = nil
    topo.present(controlador, animated: true)
    return true
  }

  @MainActor
  private static func controladorDoTopo() -> UIViewController? {
    let cenas = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let cena = cenas.first(where: { $0.activationState == .foregroundActive }) ?? cenas.first
    var topo = cena?.windows.first(where: { $0.isKeyWindow })?.rootViewController
      ?? cena?.windows.first?.rootViewController
    while let apresentado = topo?.presentedViewController { topo = apresentado }
    return topo
  }

  // MARK: - Tradução

  private static func entrada(_ entrada: GKLeaderboard.Entry, meuId: String) -> [String: Any] {
    [
      "rank": entrada.rank,
      "score": entrada.score,
      "alias": entrada.player.alias,
      "isLocalPlayer": entrada.player.gamePlayerID == meuId,
    ]
  }

  private static func iso(_ data: Date?) -> String? {
    data.map { ISO8601DateFormatter().string(from: $0) }
  }

  /// Códigos estáveis que o adaptador TypeScript lê.
  private static func traduzir(_ erro: Error) -> GameCenterException {
    let ns = erro as NSError
    if ns.domain == NSURLErrorDomain {
      return GameCenterException(code: "network-unavailable", reason: ns.localizedDescription)
    }
    if ns.domain == GKErrorDomain, let codigo = GKError.Code(rawValue: ns.code) {
      switch codigo {
      case .communicationsFailure:
        return GameCenterException(code: "network-unavailable", reason: ns.localizedDescription)
      case .notAuthenticated, .cancelled, .userDenied:
        return GameCenterException(code: "not-authenticated", reason: ns.localizedDescription)
      case .gameUnrecognized, .notSupported, .apiNotAvailable:
        return GameCenterException(code: "leaderboard-not-found", reason: ns.localizedDescription)
      default:
        break
      }
    }
    return GameCenterException(code: "unrecoverable", reason: ns.localizedDescription)
  }
}
