export interface ConsultaEquipe {
  id: string;
  data: string;
  retorno: string;
  obs: string;
}

export interface ExameEquipe {
  id: string;
  tipo: string;
  data: string;
  resultado: string;
  proximo: string;
}

export interface EquipeSaude {
  id: string;
  especialidade: string;
  profissional: string;
  telefone: string;
  local: string;
  email: string;
  consultas: ConsultaEquipe[];
  exames: ExameEquipe[];
}
