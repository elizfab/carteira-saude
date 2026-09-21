export type TipoSanguineo = '' | 'A' | 'B' | 'AB' | 'O';
export type FatorRh = '' | '+' | '-';

export interface DadosPessoais {
  nome: string;
  nascimento: string;
  cpf: string;
  abo: TipoSanguineo;
  rh: FatorRh;
  telefone: string;
  email: string;
  endereco: string;
  emerg_nome: string;
  emerg_parentesco: string;
  emerg_telefone: string;
  convenio: string;
  carteirinha: string;
  obs: string;
  foto: string;
}
