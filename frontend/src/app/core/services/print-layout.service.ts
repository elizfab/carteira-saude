import { Injectable } from '@angular/core';
import {
  CATEGORIAS_ALERGIA,
  CATEGORIAS_FAMILIAR,
  ColunaTabela,
  EquipeSaude,
  ICONE_DADOS,
  ICONE_SECAO,
  LINHAS_POR_PAGINA,
  NOMES_SECAO,
  ORDEM_SECOES,
  PaginaImpressao,
  Perfil,
  SecaoKey,
} from '../../models';
import { COLUNAS as COLUNAS_CONDICOES } from '../../pages/carteira/condicoes/condicoes.component';
import { COLUNAS as COLUNAS_VACINAS } from '../../pages/carteira/vacinas/vacinas.component';
import { COLUNAS as COLUNAS_MEDICAMENTOS } from '../../pages/carteira/medicamentos/medicamentos.component';
import { COLUNAS as COLUNAS_EXAMES } from '../../pages/carteira/exames/exames.component';
import { COLUNAS as COLUNAS_CONSULTAS } from '../../pages/carteira/consultas/consultas.component';
import { COLUNAS as COLUNAS_CIRURGIAS } from '../../pages/carteira/cirurgias/cirurgias.component';
import { COLUNAS as COLUNAS_CONTROLE } from '../../pages/carteira/controle/controle.component';

type ColunasGenericas = ColunaTabela<Record<string, string>>[];

const COLUNAS_POR_SECAO: Partial<Record<SecaoKey, ColunasGenericas>> = {
  condicoes: COLUNAS_CONDICOES as unknown as ColunasGenericas,
  vacinas: COLUNAS_VACINAS as unknown as ColunasGenericas,
  medicamentos: COLUNAS_MEDICAMENTOS as unknown as ColunasGenericas,
  exames: COLUNAS_EXAMES as unknown as ColunasGenericas,
  consultas: COLUNAS_CONSULTAS as unknown as ColunasGenericas,
  cirurgias: COLUNAS_CIRURGIAS as unknown as ColunasGenericas,
  controle: COLUNAS_CONTROLE as unknown as ColunasGenericas,
};

export const COLUNAS_EQUIPE_CONTATO: ColunaTabela<Record<string, string>>[] = [
  { chave: 'especialidade', rotulo: 'Especialidade', larguraMin: 150 },
  { chave: 'profissional', rotulo: 'Profissional', larguraMin: 160 },
  { chave: 'telefone', rotulo: 'Telefone', larguraMin: 130 },
  { chave: 'local', rotulo: 'Local / clínica', larguraMin: 160 },
  { chave: 'email', rotulo: 'E-mail ou site', larguraMin: 170 },
];

const CARDS_POR_PAGINA_ACOMPANHAMENTO = 2;

@Injectable({ providedIn: 'root' })
export class PrintLayoutService {
  /** Fórmula de paginação: sempre no mínimo `minimo` páginas, mais se o conteúdo não couber. */
  contarPaginas(totalLinhas: number, porPagina: number, minimo: number): number {
    const min = Math.max(1, minimo || 1);
    return Math.max(min, Math.ceil(totalLinhas / porPagina));
  }

  linhasPreenchidas<T extends { id: string }>(linhas: T[]): T[] {
    return linhas.filter((linha) =>
      Object.entries(linha).some(([chave, valor]) => chave !== 'id' && String(valor ?? '').trim() !== '')
    );
  }

  equipeComConteudo(equipe: EquipeSaude[]): EquipeSaude[] {
    return equipe.filter(
      (e) =>
        e.especialidade ||
        e.profissional ||
        e.telefone ||
        e.local ||
        e.email ||
        this.linhasPreenchidas(e.consultas).length ||
        this.linhasPreenchidas(e.exames).length
    );
  }

  construirPaginas(perfil: Perfil): PaginaImpressao[] {
    const paginas: PaginaImpressao[] = [
      {
        tipo: 'dados',
        chave: 'dados',
        numero: 1,
        icone: ICONE_DADOS,
        titulo: 'Dados Pessoais',
        continuacao: false,
      },
    ];

    let numero = 1;
    const incluida = (k: SecaoKey) => perfil.opcoes.incluir[k] !== false;

    for (const secao of ORDEM_SECOES) {
      if (!incluida(secao)) continue;
      numero++;

      if (secao === 'equipe') {
        paginas.push(...this.paginasEquipeContatos(perfil.equipe, numero));
        continue;
      }
      if (secao === 'acompanhamento') {
        paginas.push(...this.paginasAcompanhamento(perfil.equipe, numero));
        continue;
      }
      if (secao === 'alergias') {
        paginas.push(this.paginaAlergias(perfil, numero));
        continue;
      }
      if (secao === 'familiar') {
        paginas.push(this.paginaFamiliar(perfil, numero));
        continue;
      }
      if (secao === 'notas') {
        paginas.push(...this.paginasNotas(perfil, numero));
        continue;
      }

      paginas.push(...this.paginasTabela(perfil, secao, numero));
    }

    return paginas;
  }

  private paginasTabela(perfil: Perfil, secao: SecaoKey, numero: number): PaginaImpressao[] {
    const colunas = COLUNAS_POR_SECAO[secao] ?? [];
    const todasLinhas = (perfil[secao as keyof Perfil] as unknown as Record<string, string>[]) ?? [];
    const linhas = this.linhasPreenchidas(todasLinhas as Array<{ id: string }>) as Record<string, string>[];
    const porPagina = LINHAS_POR_PAGINA[secao as keyof typeof LINHAS_POR_PAGINA] ?? 20;
    const minimo = perfil.opcoes.min[secao as keyof typeof perfil.opcoes.min] ?? 1;
    const totalPaginas = this.contarPaginas(linhas.length, porPagina, minimo);

    return Array.from({ length: totalPaginas }, (_, i) => ({
      tipo: 'tabela' as const,
      chave: secao,
      numero,
      icone: ICONE_SECAO[secao],
      titulo: NOMES_SECAO[secao],
      continuacao: i > 0,
      colunas,
      linhas: linhas.slice(i * porPagina, (i + 1) * porPagina),
    }));
  }

  private paginasEquipeContatos(equipe: EquipeSaude[], numero: number): PaginaImpressao[] {
    const itens = this.equipeComConteudo(equipe);
    return [
      {
        tipo: 'equipe-contatos',
        chave: 'equipe',
        numero,
        icone: ICONE_SECAO.equipe,
        titulo: NOMES_SECAO.equipe,
        continuacao: false,
        colunas: COLUNAS_EQUIPE_CONTATO,
        linhas: itens as unknown as Record<string, string>[],
      },
    ];
  }

  private paginasAcompanhamento(equipe: EquipeSaude[], numero: number): PaginaImpressao[] {
    let itens = this.equipeComConteudo(equipe);
    if (!itens.length) return [];

    const totalPaginas = Math.max(1, Math.ceil(itens.length / CARDS_POR_PAGINA_ACOMPANHAMENTO));
    return Array.from({ length: totalPaginas }, (_, i) => ({
      tipo: 'acompanhamento' as const,
      chave: 'acompanhamento',
      numero,
      icone: ICONE_SECAO.acompanhamento,
      titulo: NOMES_SECAO.acompanhamento,
      continuacao: i > 0,
      itensEquipe: itens.slice(
        i * CARDS_POR_PAGINA_ACOMPANHAMENTO,
        (i + 1) * CARDS_POR_PAGINA_ACOMPANHAMENTO
      ),
    }));
  }

  private paginaAlergias(perfil: Perfil, numero: number): PaginaImpressao {
    return {
      tipo: 'texto',
      chave: 'alergias',
      numero,
      icone: ICONE_SECAO.alergias,
      titulo: NOMES_SECAO.alergias,
      continuacao: false,
      textos: CATEGORIAS_ALERGIA.map((c) => ({
        titulo: c.titulo,
        hint: c.hint,
        texto: perfil.alergias[c.chave as keyof Perfil['alergias']],
      })),
    };
  }

  private paginaFamiliar(perfil: Perfil, numero: number): PaginaImpressao {
    return {
      tipo: 'texto',
      chave: 'familiar',
      numero,
      icone: ICONE_SECAO.familiar,
      titulo: NOMES_SECAO.familiar,
      continuacao: false,
      textos: CATEGORIAS_FAMILIAR.map((c) => {
        const item = perfil.familiar[c.chave as keyof Perfil['familiar']];
        return { titulo: c.titulo, hint: c.hint, texto: item.t, check: item.r };
      }),
    };
  }

  private paginasNotas(perfil: Perfil, numero: number): PaginaImpressao[] {
    const total = Math.max(1, perfil.opcoes.min.notas || 1);
    return Array.from({ length: total }, (_, i) => ({
      tipo: 'notas' as const,
      chave: 'notas',
      numero,
      icone: ICONE_SECAO.notas,
      titulo: NOMES_SECAO.notas,
      continuacao: i > 0,
      textos: i === 0 ? [{ titulo: '', texto: perfil.notas }] : [],
    }));
  }
}
