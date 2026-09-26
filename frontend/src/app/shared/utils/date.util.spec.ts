import { formatarDataBr, hojeISO } from './date.util';

describe('hojeISO', () => {
  it('formata uma data como yyyy-mm-dd com zero à esquerda', () => {
    expect(hojeISO(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(hojeISO(new Date(2026, 11, 25))).toBe('2026-12-25');
  });
});

describe('formatarDataBr', () => {
  it('converte yyyy-mm-dd para dd/mm/yyyy', () => {
    expect(formatarDataBr('2026-01-05')).toBe('05/01/2026');
  });

  it('retorna a entrada sem alteração quando não bate com o formato ISO', () => {
    expect(formatarDataBr('')).toBe('');
    expect(formatarDataBr('Em uso')).toBe('Em uso');
  });
});
