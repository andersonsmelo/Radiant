import ExpoModulesCore
import StoreKit
import UIKit

/**
 Assinatura "Radiant Ilimitado" pelo StoreKit 2, sem terceiro no caminho da
 compra (ADR 2026-09-23).

 O módulo COPIA, não julga. Ele devolve o que o StoreKit entregou, inclusive a
 transação não verificada, marcada com `verified: false`. Quem decide o que dá
 direito — só verificada, só produto da ADR, qual transação vence — é o
 `StoreKit2Adapter` em TypeScript, onde a regra é testável. Foi julgar no
 nativo que escondeu dois defeitos no módulo do CloudKit (PR #14).

 Nada sai do aparelho além da conversa com a Apple: nenhum identificador de
 transação atravessa a fronteira, nada é gravado e nada é escrito em log.

 O QUE FOI VERIFICADO, E ONDE:
 - 2026-09-24: compilado contra o ExpoModulesCore real no EAS (build
   `development` `ac4b49df`). No sandbox, num iPhone com iOS 27.2, passaram
   preços, compra, renovação acelerada, expiração e reinstalação.
 - 2026-09-26: `showManageSubscriptions` e `Storefront.updates` compilaram
   localmente com o Xcode 27, para o simulador, sem aviso neste arquivo. O app
   abriu com eles num simulador iOS 26.5. A folha e a troca de loja ainda não
   rodaram em aparelho.
 Ask to Buy, restauração e cancelamento ainda não foram vistos.
 */

/// Erro com `code` estável, que é o campo que o adaptador TypeScript lê.
internal final class StoreKitException: Exception {
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

private let kUpdatesEvent = "onTransactionsUpdated"
private let kStorefrontEvent = "onStorefrontChanged"

public final class RadiantStoreKitModule: Module {
  private var updatesTask: Task<Void, Never>?
  private var storefrontTask: Task<Void, Never>?

  public func definition() -> ModuleDefinition {
    Name("RadiantStoreKit")

    Events(kUpdatesEvent, kStorefrontEvent)

    // `Transaction.updates` desde a abertura (ADR, regra 4): renovação,
    // reembolso, Ask to Buy aprovado e compra em outro aparelho chegam por
    // aqui, e transações não finalizadas são reentregues uma vez na partida.
    // O `ModuleHolder` dispara `OnCreate` quando o módulo é registrado, na
    // criação do contexto do app, e não quando o JavaScript o pede.
    OnCreate {
      self.escutarAtualizacoes()
      self.escutarLoja()
    }

    OnDestroy {
      self.updatesTask?.cancel()
      self.storefrontTask?.cancel()
    }

    AsyncFunction("loadProducts") { (ids: [String]) -> [[String: Any]] in
      do {
        let produtos = try await Product.products(for: ids)
        return produtos.map { produto in
          ["id": produto.id, "displayName": produto.displayName, "displayPrice": produto.displayPrice]
        }
      } catch {
        throw Self.traduzir(error)
      }
    }

    AsyncFunction("currentEntitlements") { () -> [[String: Any]] in
      var envelopes: [[String: Any]] = []
      for await resultado in Transaction.currentEntitlements {
        envelopes.append(await Self.envelope(resultado))
      }
      return envelopes
    }

    AsyncFunction("purchase") { (productId: String) -> [String: Any] in
      let produto: Product
      do {
        guard let encontrado = try await Product.products(for: [productId]).first else {
          throw StoreKitException(code: "product-not-found", reason: "Produto não encontrado na loja.")
        }
        produto = encontrado
      } catch let erro as StoreKitException {
        throw erro
      } catch {
        throw Self.traduzir(error)
      }

      let resultado: Product.PurchaseResult
      do {
        resultado = try await produto.purchase()
      } catch {
        throw Self.traduzir(error)
      }

      switch resultado {
      case .success(let verificacao):
        let envelope = await Self.envelope(verificacao)
        // Só a verificada é finalizada (ADR, regra 3). A não verificada não dá
        // direito e fica sem `finish()`, como no exemplo da Apple em que
        // `checkVerified` lança antes da finalização.
        if case .verified(let transacao) = verificacao {
          await transacao.finish()
        }
        return ["kind": "success", "transaction": envelope]
      case .pending:
        return ["kind": "pending"]
      case .userCancelled:
        return ["kind": "userCancelled"]
      @unknown default:
        throw StoreKitException(code: "unrecoverable", reason: "Resultado de compra desconhecido.")
      }
    }

    AsyncFunction("sync") { () in
      do {
        try await AppStore.sync()
      } catch {
        throw Self.traduzir(error)
      }
    }

    // Troca de plano e cancelamento acontecem nesta folha, e não no app (ADR de
    // 2026-09-25, "Gerenciar", opção A). Resolve quando a folha fecha; quem
    // relê a assinatura é o TypeScript, porque cancelar não gera transação.
    AsyncFunction("showManageSubscriptions") { () in
      try await Self.mostrarGerenciamento()
    }
  }

  /// A folha precisa de uma `UIWindowScene`. O app não adota o ciclo de vida
  /// por cenas, mas o UIKit cria a cena implícita desde o iOS 13 (inferido da
  /// documentação, não medido neste app).
  @MainActor
  private static func mostrarGerenciamento() async throws {
    let cenas = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    guard let cena = cenas.first(where: { $0.activationState == .foregroundActive }) ?? cenas.first else {
      throw StoreKitException(code: "unrecoverable", reason: "Nenhuma cena para mostrar a folha de assinaturas.")
    }
    do {
      try await AppStore.showManageSubscriptions(in: cena)
    } catch {
      throw traduzir(error)
    }
  }

  /// `Storefront.updates` avisa quando a loja da conta muda — e com ela a moeda
  /// dos preços (ADR de 2026-09-25, item 4). Evento sem corpo: o TypeScript
  /// pede os produtos de novo.
  private func escutarLoja() {
    storefrontTask = Task.detached { [weak self] in
      for await _ in Storefront.updates {
        self?.sendEvent(kStorefrontEvent, [:])
      }
    }
  }

  private func escutarAtualizacoes() {
    updatesTask = Task.detached { [weak self] in
      for await resultado in Transaction.updates {
        if case .verified(let transacao) = resultado {
          await transacao.finish()
        }
        // Evento sem corpo: o TypeScript relê o direito pela porta.
        self?.sendEvent(kUpdatesEvent, [:])
      }
    }
  }

  /// ISO 8601 com frações de segundo. Um formatador por chamada: o
  /// `ISO8601DateFormatter` não é `Sendable`, e compartilhá-lo entre tarefas é
  /// erro no modo Swift 6.
  private static func iso(_ data: Date) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.string(from: data)
  }

  /// Copia os campos que a porta usa. Campo ausente simplesmente não entra no
  /// dicionário, e o TypeScript o trata como ausente — nunca como "tem direito".
  private static func envelope(_ resultado: VerificationResult<Transaction>) async -> [String: Any] {
    let transacao: Transaction
    let verificada: Bool
    switch resultado {
    case .verified(let t):
      transacao = t
      verificada = true
    case .unverified(let t, _):
      transacao = t
      verificada = false
    }

    var envelope: [String: Any] = ["productId": transacao.productID, "verified": verificada]
    if let expira = transacao.expirationDate { envelope["expirationDate"] = iso(expira) }
    if let revogada = transacao.revocationDate { envelope["revocationDate"] = iso(revogada) }
    if verificada, let renova = await willAutoRenew(transacao) { envelope["willAutoRenew"] = renova }
    return envelope
  }

  /// `nil` quando o status não veio ou a renovação não verificou. Não está
  /// medido se `subscriptionStatus` responde sem rede; o TypeScript lê `nil`
  /// como "não renova" (plano da fatia 2, §1.1).
  private static func willAutoRenew(_ transacao: Transaction) async -> Bool? {
    guard let status = await transacao.subscriptionStatus else { return nil }
    guard case .verified(let renovacao) = status.renewalInfo else { return nil }
    return renovacao.willAutoRenew
  }

  /// Traduz para os códigos que o adaptador TypeScript conhece. A fronteira
  /// existe para que o domínio nunca precise conhecer `StoreKitError`.
  private static func traduzir(_ error: Error) -> StoreKitException {
    if let erro = error as? StoreKitError {
      switch erro {
      case .userCancelled:
        return StoreKitException(code: "user-cancelled", reason: erro.localizedDescription)
      case .networkError:
        return StoreKitException(code: "network-unavailable", reason: erro.localizedDescription)
      default:
        return StoreKitException(code: "unrecoverable", reason: erro.localizedDescription)
      }
    }
    if let erro = error as? Product.PurchaseError {
      switch erro {
      case .purchaseNotAllowed:
        return StoreKitException(code: "payments-not-allowed", reason: erro.localizedDescription)
      case .productUnavailable:
        return StoreKitException(code: "product-not-found", reason: erro.localizedDescription)
      default:
        return StoreKitException(code: "unrecoverable", reason: erro.localizedDescription)
      }
    }
    return StoreKitException(code: "unrecoverable", reason: error.localizedDescription)
  }
}
