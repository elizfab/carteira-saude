import { criarEquipeVazia, criarPerfilVazio, criarVacinaVazia } from '../../models';
import { PrintLayoutService } from './print-layout.service';

describe('PrintLayoutService', () => {
  let service: PrintLayoutService;

  beforeEach(() => {
    service = new PrintLayoutService();
  });

  describe('contarPaginas', () => {
    it('30 linhas com 26 por página e mínimo 1 gera 2 páginas', () => {
      expect(service.contarPaginas(30, 26, 1)).toBe(2);
    });

    it('0 linhas com mínimo 1 gera 1 página (em branco)', () => {
      expect(service.contarPaginas(0, 26, 1)).toBe(1);
    });

    it('respeita um mínimo maior que o necessário pelo conteúdo', () => {
      expect(service.contarPaginas(5, 26, 3)).toBe(3);
    });
  });

  describe('linhasPreenchidas', () => {
    it('filtra linhas onde todos os campos (exceto id) estão vazios', () => {
      const linhas = [
        { id: '1', nome: '', obs: '' },
        { id: '2', nome: 'BCG', obs: '' },
      ];
      expect(service.linhasPreenchidas(linhas)).toEqual([{ id: '2', nome: 'BCG', obs: '' }]);
    });
  });

  describe('construirPaginas', () => {
    it('a primeira página é sempre a de dados pessoais', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      const paginas = service.construirPaginas(perfil);
      expect(paginas[0]).toMatchObject({ tipo: 'dados', numero: 1 });
    });

    it('gera 2 páginas de vacinas quando há 30 vacinas preenchidas e min=1', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      perfil.vacinas = Array.from({ length: 30 }, (_, i) => ({
        ...criarVacinaVazia(`v${i}`),
        nome: `Vacina ${i}`,
      }));

      const paginasVacinas = service.construirPaginas(perfil).filter((p) => p.chave === 'vacinas');
      expect(paginasVacinas.length).toBe(2);
      expect(paginasVacinas[0].continuacao).toBe(false);
      expect(paginasVacinas[1].continuacao).toBe(true);
      expect(paginasVacinas[0].linhas?.length).toBe(26);
      expect(paginasVacinas[1].linhas?.length).toBe(4);
    });

    it('gera 1 página em branco de vacinas quando não há nenhuma', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      const paginasVacinas = service.construirPaginas(perfil).filter((p) => p.chave === 'vacinas');
      expect(paginasVacinas.length).toBe(1);
      expect(paginasVacinas[0].linhas).toEqual([]);
    });

    it('desmarcar uma seção em opcoes.incluir remove a página sem alterar os dados do perfil', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      perfil.vacinas = [{ ...criarVacinaVazia('v1'), nome: 'BCG' }];
      perfil.opcoes.incluir.vacinas = false;

      const paginas = service.construirPaginas(perfil);
      expect(paginas.some((p) => p.chave === 'vacinas')).toBe(false);
      expect(perfil.vacinas).toEqual([{ ...criarVacinaVazia('v1'), nome: 'BCG' }]);
    });

    it('não gera página de acompanhamento quando nenhum especialista tem conteúdo', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      perfil.equipe = [criarEquipeVazia('e1')];
      const paginas = service.construirPaginas(perfil);
      expect(paginas.some((p) => p.tipo === 'acompanhamento')).toBe(false);
    });

    it('gera página de acompanhamento quando um especialista tem conteúdo', () => {
      const perfil = criarPerfilVazio('p1', 'Ana');
      perfil.equipe = [{ ...criarEquipeVazia('e1'), especialidade: 'Pediatria' }];
      const paginas = service.construirPaginas(perfil);
      const acompanhamento = paginas.find((p) => p.tipo === 'acompanhamento');
      expect(acompanhamento?.itensEquipe?.length).toBe(1);
    });
  });
});
