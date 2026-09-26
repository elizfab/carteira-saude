import { TestBed } from '@angular/core/testing';
import { criarPerfilVazio, FORMATO_BACKUP, VERSAO_BACKUP } from '../../models';
import { IdService } from './id.service';
import { ImportExportService } from './import-export.service';

describe('ImportExportService', () => {
  let service: ImportExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportExportService, { provide: IdService, useValue: { gerar: () => 'id-novo' } }],
    });
    service = TestBed.inject(ImportExportService);
  });

  describe('construirBackup', () => {
    it('monta o backup com formato e versão do protótipo', () => {
      const p1 = criarPerfilVazio('p1');
      expect(service.construirBackup([p1])).toEqual({
        formato: FORMATO_BACKUP,
        versao: VERSAO_BACKUP,
        perfis: [p1],
      });
    });
  });

  describe('nomeArquivoExportacao / nomeArquivoBackup', () => {
    it('gera nomes de arquivo com slug do nome do perfil e data do backup', () => {
      expect(service.nomeArquivoExportacao('Ana Paula')).toBe('carteira-saude-ana-paula.json');
      expect(service.nomeArquivoBackup('2026-09-20')).toBe('carteira-saude-backup-2026-09-20.json');
    });
  });

  describe('extrairPerfis', () => {
    it('lê o formato atual { perfis: [...] }', () => {
      const p1 = criarPerfilVazio('p1', 'Ana');
      const resultado = service.extrairPerfis({ formato: FORMATO_BACKUP, versao: 1, perfis: [p1] });
      expect(resultado).toEqual([p1]);
    });

    it('lê o formato legado { perfil: {...} } de um único perfil', () => {
      const p1 = criarPerfilVazio('p1', 'Ana');
      const resultado = service.extrairPerfis({ perfil: p1 });
      expect(resultado).toEqual([p1]);
    });

    it('lê o formato legado onde o próprio objeto raiz é o perfil (detectado pela chave "dados")', () => {
      const p1 = criarPerfilVazio('p1', 'Ana');
      const resultado = service.extrairPerfis(p1);
      expect(resultado).toEqual([p1]);
    });

    it('normaliza perfis parciais, preenchendo campos ausentes', () => {
      const resultado = service.extrairPerfis({ perfis: [{ id: 'p1', dados: { nome: 'João' } }] });
      expect(resultado?.[0].dados.nome).toBe('João');
      expect(resultado?.[0].vacinas).toEqual([]);
    });

    it('retorna null para um JSON sem formato reconhecível', () => {
      expect(service.extrairPerfis({ qualquerCoisa: 1 })).toBeNull();
      expect(service.extrairPerfis(null)).toBeNull();
      expect(service.extrairPerfis({ perfis: [] })).toBeNull();
    });
  });

  describe('baixarJSON', () => {
    it('cria um link de download com o blob e o nome de arquivo informados', () => {
      const createObjectURL = jest.fn(() => 'blob:mock-url');
      const revokeObjectURL = jest.fn();
      (URL as unknown as { createObjectURL: typeof createObjectURL }).createObjectURL = createObjectURL;
      (URL as unknown as { revokeObjectURL: typeof revokeObjectURL }).revokeObjectURL = revokeObjectURL;

      const clickSpy = jest.fn();
      const anchor = document.createElement('a');
      jest.spyOn(anchor, 'click').mockImplementation(clickSpy);
      jest.spyOn(document, 'createElement').mockReturnValue(anchor);

      service.baixarJSON('arquivo.json', { a: 1 });

      expect(createObjectURL).toHaveBeenCalled();
      expect(anchor.download).toBe('arquivo.json');
      expect(clickSpy).toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });
});
