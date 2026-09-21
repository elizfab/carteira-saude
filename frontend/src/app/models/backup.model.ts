import { Perfil } from './perfil.model';

export const FORMATO_BACKUP = 'carteira-saude' as const;
export const VERSAO_BACKUP = 1 as const;

export interface Backup {
  formato: typeof FORMATO_BACKUP;
  versao: typeof VERSAO_BACKUP;
  perfis: Perfil[];
}
