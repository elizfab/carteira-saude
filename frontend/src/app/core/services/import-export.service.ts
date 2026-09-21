import { Injectable, inject } from '@angular/core';
import {
  Backup,
  FORMATO_BACKUP,
  Perfil,
  VERSAO_BACKUP,
  normalizarPerfil,
} from '../../models';
import { slugificar } from '../../shared/utils/slug.util';
import { IdService } from './id.service';

interface ArquivoImportavel {
  perfis?: unknown[];
  perfil?: unknown;
  dados?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ImportExportService {
  private readonly idService = inject(IdService);

  construirBackup(perfis: Perfil[]): Backup {
    return { formato: FORMATO_BACKUP, versao: VERSAO_BACKUP, perfis };
  }

  nomeArquivoExportacao(nomePerfil: string): string {
    return `carteira-saude-${slugificar(nomePerfil)}.json`;
  }

  nomeArquivoBackup(dataISO: string): string {
    return `carteira-saude-backup-${dataISO}.json`;
  }

  /**
   * Extrai e normaliza os perfis de um JSON arbitrário, aceitando o formato atual
   * (`{ perfis: [...] }`) e os formatos legados de perfil único do protótipo
   * (`{ perfil: {...} }` ou o próprio objeto de perfil, detectado pela chave `dados`).
   * Retorna `null` quando o arquivo não tem um formato reconhecível.
   */
  extrairPerfis(json: unknown): Perfil[] | null {
    const bruto = (json ?? {}) as ArquivoImportavel;
    const lista = Array.isArray(bruto.perfis)
      ? bruto.perfis
      : bruto.perfil
        ? [bruto.perfil]
        : bruto.dados
          ? [bruto]
          : null;

    if (!lista || !lista.length) return null;
    return lista.map((item) => normalizarPerfil(item, () => this.idService.gerar()));
  }

  baixarJSON(nomeArquivo: string, conteudo: unknown): void {
    const blob = new Blob([JSON.stringify(conteudo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
