import { Injectable } from '@angular/core';
import { CHAVE_STORAGE, EstadoPersistido } from '../../models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  carregar(): EstadoPersistido | null {
    try {
      const bruto = localStorage.getItem(CHAVE_STORAGE);
      return bruto ? (JSON.parse(bruto) as EstadoPersistido) : null;
    } catch {
      return null;
    }
  }

  salvar(estado: EstadoPersistido): boolean {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
      return true;
    } catch {
      return false;
    }
  }
}
