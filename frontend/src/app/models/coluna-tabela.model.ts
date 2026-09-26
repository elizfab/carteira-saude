export type TipoCelula = 'texto' | 'data' | 'area' | 'pressao';

export interface ColunaTabela<T = Record<string, string>> {
  chave: Extract<keyof T, string>;
  rotulo: string;
  tipo?: TipoCelula;
  larguraMin?: number;
  larguraImpressao?: number;
  placeholder?: string;
  centralizado?: boolean;
}
