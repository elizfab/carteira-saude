import { SecaoKey, SecaoPaginavelKey } from './opcoes-impressao.model';

export const CHAVE_STORAGE = 'carteira-saude:v1';

export const ORDEM_SECOES: SecaoKey[] = [
  'condicoes',
  'equipe',
  'acompanhamento',
  'vacinas',
  'medicamentos',
  'exames',
  'consultas',
  'alergias',
  'cirurgias',
  'familiar',
  'controle',
  'notas',
];

export const NOMES_SECAO: Record<SecaoKey, string> = {
  condicoes: 'Condições e Diagnósticos',
  equipe: 'Equipe de Saúde',
  acompanhamento: 'Acompanhamento por Especialidade',
  vacinas: 'Histórico de Vacinação',
  medicamentos: 'Histórico de Medicamentos',
  exames: 'Histórico de Exames',
  consultas: 'Histórico de Consultas',
  alergias: 'Alergias e Restrições',
  cirurgias: 'Histórico de Cirurgias e Internações',
  familiar: 'Histórico Familiar',
  controle: 'Controle de Pressão, Peso e Glicemia',
  notas: 'Anotações Gerais',
};

export const ICONE_DADOS = 'idcard';

export const ICONE_SECAO: Record<SecaoKey, string> = {
  condicoes: 'heart',
  equipe: 'team',
  acompanhamento: 'calendar',
  vacinas: 'experiment',
  medicamentos: 'medicine-box',
  exames: 'file-text',
  consultas: 'user',
  alergias: 'warning',
  cirurgias: 'bank',
  familiar: 'usergroup-add',
  controle: 'line-chart',
  notas: 'edit',
};

export const ICONE_OPCOES = 'printer';

export interface ItemNavegacao {
  path: string;
  rotulo: string;
  icone: string;
}

export const ITENS_NAVEGACAO: ItemNavegacao[] = [
  { path: 'dados', rotulo: 'Dados pessoais', icone: ICONE_DADOS },
  { path: 'condicoes', rotulo: 'Condições e diagnósticos', icone: ICONE_SECAO.condicoes },
  { path: 'equipe', rotulo: 'Equipe e acompanhamento', icone: ICONE_SECAO.equipe },
  { path: 'vacinas', rotulo: 'Vacinação', icone: ICONE_SECAO.vacinas },
  { path: 'medicamentos', rotulo: 'Medicamentos', icone: ICONE_SECAO.medicamentos },
  { path: 'exames', rotulo: 'Exames', icone: ICONE_SECAO.exames },
  { path: 'consultas', rotulo: 'Consultas', icone: ICONE_SECAO.consultas },
  { path: 'alergias', rotulo: 'Alergias e restrições', icone: ICONE_SECAO.alergias },
  { path: 'cirurgias', rotulo: 'Cirurgias e internações', icone: ICONE_SECAO.cirurgias },
  { path: 'familiar', rotulo: 'Histórico familiar', icone: ICONE_SECAO.familiar },
  { path: 'controle', rotulo: 'Pressão, peso e glicemia', icone: ICONE_SECAO.controle },
  { path: 'notas', rotulo: 'Anotações gerais', icone: ICONE_SECAO.notas },
  { path: 'opcoes', rotulo: 'Opções de impressão', icone: ICONE_OPCOES },
];

export const MIN_PAGINAS_SECOES: SecaoPaginavelKey[] = [
  'vacinas',
  'medicamentos',
  'exames',
  'consultas',
  'cirurgias',
  'controle',
  'notas',
];

export const LINHAS_POR_PAGINA: Record<SecaoPaginavelKey, number> = {
  vacinas: 26,
  medicamentos: 20,
  exames: 20,
  consultas: 20,
  cirurgias: 14,
  controle: 26,
  notas: 1,
};

export const ESPECIALIDADES: readonly string[] = [
  'Cardiologia',
  'Clínica geral',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Ginecologia',
  'Neurologia',
  'Nutrição',
  'Odontologia',
  'Oftalmologia',
  'Ortopedia',
  'Otorrinolaringologia',
  'Pediatria',
  'Psicologia',
  'Psiconeuro',
  'Psiquiatria',
  'Reumatologia',
  'Urologia',
];

export interface CategoriaTexto {
  chave: string;
  titulo: string;
  hint: string;
}

export const CATEGORIAS_FAMILIAR: readonly CategoriaTexto[] = [
  { chave: 'diabetes', titulo: 'Diabetes', hint: '(parentesco e idade do diagnóstico)' },
  { chave: 'hipertensao', titulo: 'Hipertensão', hint: '(parentesco e idade do diagnóstico)' },
  { chave: 'cardiacas', titulo: 'Doenças cardíacas', hint: '(parentesco e idade do diagnóstico)' },
  { chave: 'cancer', titulo: 'Câncer', hint: '(tipo, parentesco e idade do diagnóstico)' },
  { chave: 'outras', titulo: 'Outras condições hereditárias', hint: '(condição e parentesco)' },
];

export const CATEGORIAS_ALERGIA: readonly CategoriaTexto[] = [
  { chave: 'medicamentos', titulo: 'Medicamentos', hint: '(nome do medicamento e reação)' },
  { chave: 'alimentos', titulo: 'Alimentos', hint: '(alergias, intolerâncias e restrições alimentares)' },
  { chave: 'materiais', titulo: 'Materiais', hint: '(látex, esparadrapo, contraste, metais etc.)' },
  { chave: 'outras', titulo: 'Outras alergias', hint: '(poeira, pólen, picadas, animais etc.)' },
];

export const DEBOUNCE_SALVAR_MS = 250;
