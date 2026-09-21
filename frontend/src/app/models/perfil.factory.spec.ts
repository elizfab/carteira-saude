import {
  criarAlergiasVazias,
  criarCirurgiaVazia,
  criarCondicaoVazia,
  criarConsultaEquipeVazia,
  criarConsultaVazia,
  criarControleVazio,
  criarEquipeVazia,
  criarExameEquipeVazio,
  criarExameVazio,
  criarHistoricoFamiliarVazio,
  criarMedicamentoVazio,
  criarOpcoesImpressaoPadrao,
  criarPerfilVazio,
  criarVacinaVazia,
  mesclarProfundo,
  normalizarPerfil,
} from './perfil.factory';

describe('perfil.factory', () => {
  describe('criarPerfilVazio', () => {
    it('cria um perfil com o id e nome informados e todas as listas vazias', () => {
      const perfil = criarPerfilVazio('id-1', 'Maria');

      expect(perfil.id).toBe('id-1');
      expect(perfil.dados.nome).toBe('Maria');
      expect(perfil.vacinas).toEqual([]);
      expect(perfil.equipe).toEqual([]);
      expect(perfil.alergias).toEqual(criarAlergiasVazias());
      expect(perfil.familiar).toEqual(criarHistoricoFamiliarVazio());
      expect(perfil.opcoes).toEqual(criarOpcoesImpressaoPadrao());
    });
  });

  describe('criarEquipeVazia', () => {
    it('cria um especialista vazio com consultas e exames como arrays vazios', () => {
      const equipe = criarEquipeVazia('eq-1', 'Cardiologia');
      expect(equipe).toEqual({
        id: 'eq-1',
        especialidade: 'Cardiologia',
        profissional: '',
        telefone: '',
        local: '',
        email: '',
        consultas: [],
        exames: [],
      });
    });
  });

  describe('mesclarProfundo', () => {
    it('preenche campos ausentes do modelo com o default e preserva os valores enviados', () => {
      const modelo = { a: 1, b: { c: 2, d: 3 } };
      const resultado = mesclarProfundo(modelo, { b: { c: 99 } });
      expect(resultado).toEqual({ a: 1, b: { c: 99, d: 3 } });
    });

    it('preserva chaves extras que existem só na origem', () => {
      const resultado = mesclarProfundo({ a: 1 }, { a: 2, extra: 'x' });
      expect(resultado).toEqual({ a: 2, extra: 'x' });
    });

    it('usa o array da origem quando presente, senão o array do modelo', () => {
      expect(mesclarProfundo([1, 2, 3], [9])).toEqual([9]);
      expect(mesclarProfundo([1, 2, 3], undefined)).toEqual([1, 2, 3]);
      expect(mesclarProfundo([1, 2, 3], 'nao-array')).toEqual([1, 2, 3]);
    });

    it('mantém o valor do modelo quando a origem é null/undefined', () => {
      expect(mesclarProfundo('padrao', undefined)).toBe('padrao');
      expect(mesclarProfundo('padrao', null)).toBe('padrao');
      expect(mesclarProfundo('padrao', '')).toBe('');
    });
  });

  describe('normalizarPerfil', () => {
    it('preenche um perfil parcial (ex.: vindo de um JSON antigo) com os defaults', () => {
      const gerarId = () => 'novo-id';
      const perfil = normalizarPerfil({ id: 'existente', dados: { nome: 'João' } }, gerarId);

      expect(perfil.id).toBe('existente');
      expect(perfil.dados.nome).toBe('João');
      expect(perfil.dados.cpf).toBe('');
      expect(perfil.vacinas).toEqual([]);
      expect(perfil.opcoes).toEqual(criarOpcoesImpressaoPadrao());
    });

    it('gera um id novo quando o perfil bruto não tem id', () => {
      const perfil = normalizarPerfil({}, () => 'gerado-1');
      expect(perfil.id).toBe('gerado-1');
    });

    it('normaliza cada item de equipe preenchendo consultas/exames ausentes', () => {
      const perfil = normalizarPerfil(
        { equipe: [{ especialidade: 'Pediatria' }] },
        () => 'id-equipe'
      );
      expect(perfil.equipe).toEqual([
        {
          id: 'id-equipe',
          especialidade: 'Pediatria',
          profissional: '',
          telefone: '',
          local: '',
          email: '',
          consultas: [],
          exames: [],
        },
      ]);
    });

    it('não gera id novo para item de equipe que já tem id', () => {
      const gerarId = jest.fn(() => 'nao-deveria-usar');
      const perfil = normalizarPerfil(
        { id: 'p1', equipe: [{ id: 'eq-existente', especialidade: 'Dermato' }] },
        gerarId
      );
      expect(perfil.equipe[0].id).toBe('eq-existente');
    });
  });

  describe('factories de linha vazia', () => {
    it('cada factory cria uma linha só com o id preenchido e o resto em branco', () => {
      expect(criarCondicaoVazia('1')).toEqual({ id: '1', condicao: '', descoberta: '', acomp: '', obs: '' });
      expect(criarVacinaVazia('1')).toEqual({
        id: '1',
        nome: '',
        dose: '',
        data: '',
        lote: '',
        local: '',
        reforco: '',
        obs: '',
      });
      expect(criarMedicamentoVazio('1')).toEqual({
        id: '1',
        nome: '',
        dosagem: '',
        inicio: '',
        termino: '',
        medico: '',
        obs: '',
      });
      expect(criarExameVazio('1')).toEqual({ id: '1', data: '', tipo: '', resultado: '', medico: '', proximo: '' });
      expect(criarConsultaVazia('1')).toEqual({
        id: '1',
        data: '',
        especialidade: '',
        medico: '',
        diagnostico: '',
        recomendacoes: '',
        retorno: '',
      });
      expect(criarCirurgiaVazia('1')).toEqual({
        id: '1',
        data: '',
        procedimento: '',
        hospital: '',
        medico: '',
        obs: '',
      });
      expect(criarControleVazio('1')).toEqual({ id: '1', data: '', peso: '', pressao: '', glicemia: '', obs: '' });
      expect(criarConsultaEquipeVazia('1')).toEqual({ id: '1', data: '', retorno: '', obs: '' });
      expect(criarExameEquipeVazio('1')).toEqual({ id: '1', tipo: '', data: '', resultado: '', proximo: '' });
    });
  });
});
