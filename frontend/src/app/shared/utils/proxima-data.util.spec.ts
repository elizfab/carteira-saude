import { criarEquipeVazia } from '../../models';
import { proximaData } from './proxima-data.util';

describe('proximaData', () => {
  it('retorna a menor data futura entre consultas.retorno e exames.proximo', () => {
    const equipe = {
      ...criarEquipeVazia('e1'),
      consultas: [
        { id: 'c1', data: '', retorno: '2026-05-01', obs: '' },
        { id: 'c2', data: '', retorno: '2026-03-01', obs: '' },
      ],
      exames: [{ id: 'x1', tipo: '', data: '', resultado: '', proximo: '2026-04-01' }],
    };
    expect(proximaData(equipe, '2026-01-01')).toBe('2026-03-01');
  });

  it('ignora datas passadas', () => {
    const equipe = {
      ...criarEquipeVazia('e1'),
      consultas: [{ id: 'c1', data: '', retorno: '2020-01-01', obs: '' }],
    };
    expect(proximaData(equipe, '2026-01-01')).toBe('');
  });

  it('retorna vazio quando não há nenhuma consulta/exame com data', () => {
    expect(proximaData(criarEquipeVazia('e1'), '2026-01-01')).toBe('');
  });

  it('considera a data de hoje como válida (>=)', () => {
    const equipe = { ...criarEquipeVazia('e1'), consultas: [{ id: 'c1', data: '', retorno: '2026-01-01', obs: '' }] };
    expect(proximaData(equipe, '2026-01-01')).toBe('2026-01-01');
  });
});
