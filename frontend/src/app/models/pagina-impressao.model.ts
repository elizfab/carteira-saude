import { ColunaTabela } from './coluna-tabela.model';
import { EquipeSaude } from './equipe.model';

export type TipoPaginaImpressao = 'dados' | 'tabela' | 'equipe-contatos' | 'acompanhamento' | 'texto' | 'notas';

export interface PaginaImpressao {
  tipo: TipoPaginaImpressao;
  chave: string;
  numero: number;
  icone: string;
  titulo: string;
  subtitulo?: string;
  continuacao: boolean;
  colunas?: ColunaTabela<Record<string, string>>[];
  linhas?: Record<string, string>[];
  itensEquipe?: EquipeSaude[];
  textos?: { titulo: string; hint?: string; texto: string; check?: '' | 'sim' | 'nao' | 'nsei' }[];
}
