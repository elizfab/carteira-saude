import { slugificar } from './slug.util';

describe('slugificar', () => {
  it('remove acentos e coloca em minúsculas', () => {
    expect(slugificar('José Ávila')).toBe('jose-avila');
  });

  it('troca espaços e símbolos por hífen, sem hífens duplicados nas pontas', () => {
    expect(slugificar('  Maria  Clara! ')).toBe('maria-clara');
  });

  it('retorna "perfil" para string vazia ou só símbolos', () => {
    expect(slugificar('')).toBe('perfil');
    expect(slugificar('!!!')).toBe('perfil');
  });
});
