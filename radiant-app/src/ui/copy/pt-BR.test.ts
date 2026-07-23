import { productCopy } from './pt-BR';

describe('productCopy', () => {
  it('keeps the critical product actions and empty states in Portuguese', () => {
    expect(productCopy).toMatchObject({
      review: 'Revisar',
      continue: 'Continuar',
      completed: 'Concluído',
      retry: 'Tentar novamente',
      offline: 'Sem conexão',
    });
    expect(productCopy.noLearningEvidence).toBeTruthy();
    expect(productCopy.noEvaluatedAttempts).toBeTruthy();
  });
});
