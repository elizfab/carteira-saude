import { mascararCpf, mascararTelefone } from './mask.util';

describe('mascararCpf', () => {
  it('formata 11 dígitos como 000.000.000-00', () => {
    expect(mascararCpf('12345678901')).toBe('123.456.789-01');
  });

  it('ignora caracteres não numéricos e limita a 11 dígitos', () => {
    expect(mascararCpf('123.456.789-01999')).toBe('123.456.789-01');
  });

  it('formata parcialmente enquanto o usuário ainda está digitando', () => {
    expect(mascararCpf('123')).toBe('123');
    expect(mascararCpf('1234')).toBe('123.4');
    expect(mascararCpf('1234567')).toBe('123.456.7');
  });
});

describe('mascararTelefone', () => {
  it('formata 11 dígitos como (00) 00000-0000', () => {
    expect(mascararTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formata 10 dígitos como (00) 0000-0000', () => {
    expect(mascararTelefone('1123456789')).toBe('(11) 2345-6789');
  });

  it('retorna vazio para string vazia ou só símbolos', () => {
    expect(mascararTelefone('')).toBe('');
    expect(mascararTelefone('--')).toBe('');
  });

  it('formata parcialmente enquanto o usuário ainda está digitando', () => {
    expect(mascararTelefone('1')).toBe('(1');
    expect(mascararTelefone('119')).toBe('(11) 9');
  });
});
