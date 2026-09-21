import { Alergias } from './alergias.model';
import { Cirurgia } from './cirurgia.model';
import { Condicao } from './condicao.model';
import { ControleMedicao } from './controle.model';
import { Consulta } from './consulta.model';
import { DadosPessoais } from './dados-pessoais.model';
import { EquipeSaude } from './equipe.model';
import { Exame } from './exame.model';
import { HistoricoFamiliar } from './historico-familiar.model';
import { Medicamento } from './medicamento.model';
import { OpcoesImpressao } from './opcoes-impressao.model';
import { Vacina } from './vacina.model';

export interface Perfil {
  id: string;
  dados: DadosPessoais;
  condicoes: Condicao[];
  equipe: EquipeSaude[];
  vacinas: Vacina[];
  medicamentos: Medicamento[];
  exames: Exame[];
  consultas: Consulta[];
  cirurgias: Cirurgia[];
  controle: ControleMedicao[];
  alergias: Alergias;
  familiar: HistoricoFamiliar;
  notas: string;
  opcoes: OpcoesImpressao;
}
