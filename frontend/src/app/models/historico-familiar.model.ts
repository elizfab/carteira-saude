export type RespostaFamiliar = '' | 'sim' | 'nao' | 'nsei';

export interface FamiliarItem {
  r: RespostaFamiliar;
  t: string;
}

export interface HistoricoFamiliar {
  diabetes: FamiliarItem;
  hipertensao: FamiliarItem;
  cardiacas: FamiliarItem;
  cancer: FamiliarItem;
  outras: FamiliarItem;
}
