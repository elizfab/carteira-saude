export type SecaoKey =
  | 'condicoes'
  | 'equipe'
  | 'acompanhamento'
  | 'vacinas'
  | 'medicamentos'
  | 'exames'
  | 'consultas'
  | 'alergias'
  | 'cirurgias'
  | 'familiar'
  | 'controle'
  | 'notas';

export type SecaoPaginavelKey =
  | 'vacinas'
  | 'medicamentos'
  | 'exames'
  | 'consultas'
  | 'cirurgias'
  | 'controle'
  | 'notas';

export interface OpcoesImpressao {
  incluir: Partial<Record<SecaoKey, boolean>>;
  min: Record<SecaoPaginavelKey, number>;
}
