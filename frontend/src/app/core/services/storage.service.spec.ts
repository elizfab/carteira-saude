import { CHAVE_STORAGE, EstadoPersistido } from '../../models';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  it('retorna null quando não há nada salvo', () => {
    expect(service.carregar()).toBeNull();
  });

  it('salva e recupera o estado persistido sob a chave correta', () => {
    const estado: EstadoPersistido = { ativo: 'p1', perfis: {} };
    expect(service.salvar(estado)).toBe(true);
    expect(JSON.parse(localStorage.getItem(CHAVE_STORAGE)!)).toEqual(estado);
    expect(service.carregar()).toEqual(estado);
  });

  it('retorna null quando o conteúdo salvo não é um JSON válido', () => {
    localStorage.setItem(CHAVE_STORAGE, '{ invalido');
    expect(service.carregar()).toBeNull();
  });

  it('retorna false ao salvar se localStorage.setItem lançar (ex.: modo privado/cota excedida)', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    expect(service.salvar({ ativo: 'p1', perfis: {} })).toBe(false);

    jest.restoreAllMocks();
  });
});
