import { Perfil } from './perfil.model';

export interface EstadoPersistido {
  ativo: string;
  perfis: Record<string, Perfil>;
}
