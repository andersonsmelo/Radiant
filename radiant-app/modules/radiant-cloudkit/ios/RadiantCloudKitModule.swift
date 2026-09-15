import CloudKit
import ExpoModulesCore

/**
 Backup do progresso no banco **privado** do iCloud do próprio usuário.

 Superfície deliberadamente mínima — três funções — porque toda regra de
 produto (mescla, versionamento do payload, política de erro) mora no
 TypeScript. O módulo não conhece o formato do progresso: ele transporta uma
 string opaca. Assim, acrescentar campo ao backup é mudança de JS e não exige
 build novo.

 Nada aqui identifica a pessoa. O container privado do usuário é a fronteira
 de identidade; não há nome, e-mail nem identificador de conta do Radiant.

 ATENÇÃO: este arquivo não foi compilado nem executado. Ele só pode ser
 considerado validado depois de um build assinado rodar em aparelho real e
 comprovar backup e restauração.
 */

private let kContainerIdentifier = "iCloud.com.ascendcreative.radiant"
private let kRecordType = "ProgressBackup"
/// `recordName` fixo: é o que torna a escrita idempotente — salvar de novo
/// atualiza o mesmo registro em vez de acumular histórico.
private let kRecordName = "progress-backup-v1"

/// Erro com `code` estável, que é o campo que o adaptador TypeScript lê para
/// decidir entre "indisponível" (estado esperado) e "falha" (defeito).
internal final class CloudKitException: Exception {
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

internal struct BackupRecordInput: Record {
  @Field var payloadVersion: Int = 1
  @Field var payload: String = ""
  @Field var savedAt: String = ""
}

public final class RadiantCloudKitModule: Module {
  private var container: CKContainer { CKContainer(identifier: kContainerIdentifier) }
  private var database: CKDatabase { container.privateCloudDatabase }
  private var recordID: CKRecord.ID { CKRecord.ID(recordName: kRecordName) }

  public func definition() -> ModuleDefinition {
    Name("RadiantCloudKit")

    AsyncFunction("accountStatus") { () -> String in
      do {
        switch try await self.container.accountStatus() {
        case .available: return "available"
        case .noAccount: return "no-account"
        case .restricted: return "restricted"
        case .temporarilyUnavailable: return "temporarily-unavailable"
        case .couldNotDetermine: return "could-not-determine"
        @unknown default: return "could-not-determine"
        }
      } catch {
        // Não saber o estado da conta é um estado de conta, não um defeito:
        // o TypeScript o trata como indisponibilidade e segue local.
        return "could-not-determine"
      }
    }

    AsyncFunction("fetchBackup") { () -> [String: Any]? in
      do {
        let record = try await self.database.record(for: self.recordID)
        guard
          let payload = record["payload"] as? String,
          let savedAt = record["savedAt"] as? String
        else {
          // Registro existe mas veio sem os campos esperados: ausência, para o
          // TypeScript decidir. Nunca aplicar pela metade.
          return nil
        }
        let version = (record["payloadVersion"] as? Int) ?? -1
        return ["payloadVersion": version, "payload": payload, "savedAt": savedAt]
      } catch let error as CKError where error.code == .unknownItem {
        // Primeiro uso: ainda não há registro. Ausência, não falha.
        return nil
      } catch {
        throw Self.traduzir(error)
      }
    }

    AsyncFunction("saveBackup") { (entrada: BackupRecordInput) -> [String: String] in
      let alvo: CKRecord
      do {
        alvo = try await self.database.record(for: self.recordID)
      } catch let error as CKError where error.code == .unknownItem {
        alvo = CKRecord(recordType: kRecordType, recordID: self.recordID)
      } catch {
        throw Self.traduzir(error)
      }

      Self.preencher(alvo, com: entrada)

      do {
        let salvo = try await self.database.save(alvo)
        return ["savedAt": (salvo["savedAt"] as? String) ?? entrada.savedAt]
      } catch {
        // NAO resolver conflito aqui. A versao anterior pegava
        // error.serverRecord, escrevia a entrada local por cima e salvava de
        // novo - last-write-wins cego sobre um JSON opaco. Como este modulo
        // nao abre o payload, ele nao tem como saber que o registro do servidor
        // era mais novo, e um backup concorrente de outro aparelho era
        // silenciosamente substituido por um snapshot mais antigo.
        //
        // O conflito atravessa a fronteira como codigo estavel e quem refaz o
        // ciclo pull -> merge -> push e o TypeScript, que e onde a mescla mora.
        throw Self.traduzir(error)
      }
    }
  }

  private static func preencher(_ record: CKRecord, com entrada: BackupRecordInput) {
    record["payloadVersion"] = entrada.payloadVersion as CKRecordValue
    record["payload"] = entrada.payload as CKRecordValue
    record["savedAt"] = entrada.savedAt as CKRecordValue
  }

  /// Traduz para os quatro códigos que o adaptador TypeScript conhece. A
  /// fronteira existe para que o domínio nunca precise conhecer `CKError`.
  private static func traduzir(_ error: Error) -> CloudKitException {
    guard let ck = error as? CKError else {
      return CloudKitException(code: "unrecoverable", reason: error.localizedDescription)
    }

    switch ck.code {
    case .notAuthenticated:
      return CloudKitException(code: "not-authenticated", reason: ck.localizedDescription)
    case .networkUnavailable, .networkFailure:
      return CloudKitException(code: "network-unavailable", reason: ck.localizedDescription)
    case .requestRateLimited, .serviceUnavailable, .zoneBusy:
      return CloudKitException(code: "transient", reason: ck.localizedDescription)
    case .serverRecordChanged:
      // O registro mudou entre a nossa leitura e a nossa escrita. Nao e falha
      // nem indisponibilidade: e conflito, e a resposta correta mora no
      // TypeScript.
      return CloudKitException(code: "conflict", reason: ck.localizedDescription)
    default:
      return CloudKitException(code: "unrecoverable", reason: ck.localizedDescription)
    }
  }
}
