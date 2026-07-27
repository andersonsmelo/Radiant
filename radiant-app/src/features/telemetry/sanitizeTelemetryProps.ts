// Contrato de telemetria/privacidade — scrub de propriedades.
//
// As propriedades de um evento de telemetria devem ser apenas enums/literais,
// contagens, booleanos, durações e identificadores gerados pelo app. Elas NUNCA
// devem carregar PII (e-mail, nome, telefone, CPF), credenciais (senha, token)
// nem conteúdo clínico (resposta de quiz, texto de lição, dado de paciente).
//
// Este módulo é a última linha de defesa antes de qualquer sink remoto (relatório
// de falhas): mesmo que uma propriedade proibida seja passada por engano, ela é
// removida aqui. A prevenção primária é o teste de contrato, que falha o build se
// uma chave proibida aparecer numa chamada de TelemetryService.track.

// Substrings de nome de chave que nunca podem chegar a um sink remoto.
// Lista de alto sinal (PII, credenciais e conteúdo clínico) para não descartar
// chaves legítimas como `provider`, `source`, `screen`, `durationMs`.
export const PROHIBITED_KEY_PATTERNS: readonly string[] = [
  'email',
  'senha',
  'password',
  'passwd',
  'token',
  'secret',
  'apikey',
  'api_key',
  'cpf',
  'phone',
  'telefone',
  'fullname',
  'firstname',
  'lastname',
  'answer',
  'resposta',
  'question',
  'pergunta',
  'patient',
  'paciente',
];

// Chaves auditadas que casam com um padrão proibido por substring, mas foram
// revisadas e carregam apenas um sinal seguro (nunca o valor sensível em si).
// Cada entrada exige justificativa — é o mecanismo de exceção do contrato.
export const REVIEWED_SAFE_KEYS: Readonly<Record<string, string>> = {
  // Booleano que indica se um token de reset existe na resposta; nunca o token.
  tokenPreviewAvailable: 'boolean — só indica existência do token, não o valor',
};

export function isProhibitedKey(key: string): boolean {
  if (Object.prototype.hasOwnProperty.call(REVIEWED_SAFE_KEYS, key)) {
    return false;
  }
  const normalized = key.toLowerCase();
  return PROHIBITED_KEY_PATTERNS.some((pattern) => normalized.includes(pattern));
}

/**
 * Remove chaves proibidas e mantém apenas valores escalares. Objetos e arrays
 * aninhados são descartados porque podem carregar texto livre não auditável.
 */
export function sanitizeTelemetryProps(
  props?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!props) {
    return props;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (isProhibitedKey(key)) {
      continue;
    }

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
