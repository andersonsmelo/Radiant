# ADR — CloudKit privado para backup opcional do progresso (2026-09-15)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto)  
**Escopo:** Radiant 1.4 · iOS · backup opcional de progresso

## Contexto

A arquitetura aprovada da 1.4 é local-first: estudar, avançar, revisar e usar a economia de vidas não pode depender de conta, rede, assinatura ou backend. O backup em iCloud é um recurso opcional de continuidade do progresso, não a fonte primária de verdade do estudo.

O código da 1.4 já possui `ProgressSyncService`, `LocalProgressAdapter`, contrato de merge e UI de backup, mas o adaptador de nuvem real ainda não está conectado. A integração nativa pertence à Task 8.

Em 2026-09-15 o dono concluiu no Apple Developer a configuração externa necessária para CloudKit.

## Decisão

Usar **CloudKit privado** no iOS para o backup opcional do progresso do Radiant.

### Identificadores canônicos

- App ID / Bundle ID: `com.ascendcreative.radiant`
- iCloud Container: `iCloud.com.ascendcreative.radiant`
- Descrição no Apple Developer: `Radiant CloudKit`

Esses identificadores são permanentes para a integração da 1.4 e não devem ser substituídos por aliases ou novos containers sem decisão explícita.

### Configuração concluída no Apple Developer

Medido pelo dono em 2026-09-15:

- capability **iCloud** habilitada no App ID `com.ascendcreative.radiant`;
- compatibilidade **Include CloudKit support** selecionada;
- container `iCloud.com.ascendcreative.radiant` criado;
- exatamente 1 iCloud Container associado ao App ID;
- alteração salva e confirmada;
- perfis de provisionamento existentes podem precisar ser regenerados, porque a alteração de capability os invalida.

### Provisioning / EAS concluído para o primeiro teste nativo

Medido pelo dono em 2026-09-15 no perfil EAS `preview`:

- certificado de distribuição existente reutilizado, sem revogação ou criação de certificado novo;
- iPhone físico de teste registrado para distribuição interna;
- novo **Provisioning Profile AD_HOC** gerado após a ativação do CloudKit;
- provisioning profile em estado **active**;
- perfil contém o iPhone registrado e está pronto para um build interno `preview`;
- nenhum build foi iniciado durante esta configuração.

O provisioning antigo não deve ser reutilizado como evidência de compatibilidade com CloudKit. O primeiro build nativo deve usar o perfil AD_HOC regenerado depois da capability iCloud/CloudKit.

### Entitlements esperados no projeto

A implementação deve declarar no target iOS, via configuração Expo/EAS ou equivalente nativo:

```json
{
  "com.apple.developer.icloud-container-identifiers": [
    "iCloud.com.ascendcreative.radiant"
  ],
  "com.apple.developer.icloud-services": [
    "CloudKit"
  ]
}
```

O desenho é **CloudKit somente**. Não habilitar iCloud Documents ou ubiquity containers sem nova decisão.

## Contrato funcional

1. O armazenamento local continua sendo a fonte primária durante o uso normal.
2. O backup remoto é opcional e usa a base privada do iCloud do próprio usuário.
3. O app continua funcionando integralmente sem iCloud disponível, sem Apple ID/iCloud ativo ou sem rede.
4. Falha de CloudKit nunca deve bloquear bootstrap, trilha, lições, revisão, vidas ou Perfil.
5. O merge existente deve continuar respeitado:
   - união de nós concluídos por trilha;
   - agenda de revisão mais nova por nó;
   - maior XP;
   - maior streak;
   - `lastRefillAt` mais recente;
   - nuvem vazia nunca substitui estado local válido.
6. Antes de chamar a integração concluída, validar a ordem de restore/hydration no startup para impedir que restore remoto seja sobrescrito por hidratação local posterior.
7. `backupNow()` deve ganhar um caminho de produção explícito, sem transformar cada interação pedagógica em dependência de rede.

## Implementação da Task 8

A próxima IA executora deve:

1. configurar os entitlements do projeto para o container canônico;
2. garantir que EAS/credenciais regenerem o provisioning profile compatível com a nova capability;
3. implementar o adaptador nativo de CloudKit privado atrás do contrato existente, sem alterar o comportamento local-first;
4. definir o schema mínimo necessário no container privado;
5. validar restore, backup, merge, ausência de iCloud e falhas de rede;
6. testar em aparelho físico antes de considerar o gate fechado.

## Não decidido por esta ADR

- frequência exata de backups automáticos;
- política de retenção/versionamento além do necessário para a 1.4;
- suporte Android equivalente;
- compartilhamento público ou entre usuários;
- iCloud Documents.

Esses itens exigem decisão separada se entrarem no produto.
