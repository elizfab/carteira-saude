# 14 — Opções de impressão

## Objetivo

Deixar o usuário escolher quais seções entram na carteirinha impressa e quantas páginas mínimas
cada seção tabular deve ter (sobras ficam em branco para preencher à mão depois de impresso).

## Modelo de dados

```ts
interface OpcoesImpressao {
  incluir: Partial<Record<SecaoKey, boolean>>; // default true quando ausente
  min: Record<'vacinas'|'medicamentos'|'exames'|'consultas'|'cirurgias'|'controle'|'notas', number>;
}
```

## Comportamento

- Lista de checkboxes, uma por seção da `ORDEM` (condicoes, equipe, acompanhamento, vacinas,
  medicamentos, exames, consultas, alergias, cirurgias, familiar, controle, notas) — marcada por
  padrão (ausência da chave em `incluir` == incluída, igual ao protótipo: `incluir[k] !== false`).
- Inputs numéricos (1 a 8) para páginas mínimas das 7 seções tabulares/de texto livre que paginam
  (`MIN_PAGINAS`: vacinas, medicamentos, exames, consultas, cirurgias, controle, notas).
- Botão "Baixar backup de todos os perfis" (spec 16) e "Pré-visualizar e imprimir" (spec 15).

## Ícone

`print` → `printer`.

## Critérios de aceite

- Desmarcar uma seção em `incluir` faz ela desaparecer da pré-visualização/impressão (spec 15), mas
  não apaga os dados dela do perfil.
- Valor de "páginas mínimas" é sempre clampeado entre 1 e 8, mesmo se o usuário digitar fora do
  intervalo (mesma regra do protótipo: `Math.max(1, Math.min(8, parseInt(v,10) || 1))`).

## Não-regressão

- `incluir` ausente numa chave = seção incluída (não pode virar "excluída por padrão").
