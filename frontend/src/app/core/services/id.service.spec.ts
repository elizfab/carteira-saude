import { IdService } from './id.service';

describe('IdService', () => {
  let service: IdService;

  beforeEach(() => {
    service = new IdService();
  });

  it('usa crypto.randomUUID quando disponível', () => {
    const spy = jest.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-1111-1111-111111111111');
    expect(service.gerar()).toBe('11111111-1111-1111-1111-111111111111');
    spy.mockRestore();
  });

  it('gera ids diferentes a cada chamada', () => {
    const a = service.gerar();
    const b = service.gerar();
    expect(a).not.toBe(b);
  });

  it('recorre a um fallback baseado em Date/Math.random quando randomUUID não existe', () => {
    const original = crypto.randomUUID;
    // @ts-expect-error simula ambiente sem crypto.randomUUID
    delete crypto.randomUUID;

    const id = service.gerar();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);

    crypto.randomUUID = original;
  });
});
