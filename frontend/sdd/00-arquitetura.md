# 00 — Arquitetura

## Objetivo

Definir como o domínio "carteira de saúde" é organizado no código Angular, para que toda seção nova
siga o mesmo padrão e nenhuma decisão de arquitetura precise ser retomada seção a seção.

## Decisões

- **Gerência de estado híbrida.** `@ngrx/entity` (já instalado, sem uso até esta implementação)
  guarda só a coleção de perfis (`Dictionary<Perfil>`) e o id do perfil ativo — é o estado
  compartilhado entre topbar (seletor de perfil) e todas as páginas. As edições profundamente
  aninhadas de UM perfil (tabelas, cards de equipe, campos de texto) passam por
  `PerfilFacadeService`, que expõe o perfil ativo como `Signal<Perfil>` e métodos de mutação tipados
  por seção (`updateDados`, `addLinha('vacinas', linha)`, `addEspecialista(...)`, etc.). Toda mutação
  do facade despacha a action `perfilAtualizado` no Store (mantém a entidade sincronizada, ex.: nome
  exibido no seletor de perfil) e agenda a persistência (debounce 250ms, igual ao protótipo).
- **Persistência.** `StorageService` encapsula `localStorage`, com a mesma chave do protótipo
  (`carteira-saude:v1`) e o mesmo formato de payload (`{ ativo, perfis }`). Erros de storage
  (modo privado, cota excedida) não lançam exceção — retornam `false`/`Result`, e a UI mostra aviso
  (ver 01-perfis-e-armazenamento.md).
- **Formulários.** Reactive Forms (`FormGroup`/`FormArray`) + ng-zorro (`nz-form`, `nz-input`,
  `nz-date-picker`, `nz-radio-group`, `nz-checkbox`, `nz-select`) em vez do sistema dinâmico de
  `data-path` do protótipo. Cada página sincroniza `valueChanges` (debounced) com o
  `PerfilFacadeService`.
- **Tabelas dinâmicas.** Todas as seções de "várias linhas" (condições, vacinas, medicamentos,
  exames, consultas, cirurgias, controle, e as duas sub-tabelas de equipe) usam o mesmo componente
  `shared/components/editable-table`, configurado por um array de `ColunaTabela<T>` (chave, rótulo,
  tipo de input, largura mínima) — o mesmo papel do objeto `COLS` do protótipo, porém tipado.
- **Ícones.** `NzIconModule` + `provideNzIcons([...])` no lugar dos SVGs customizados do protótipo.
  Mapeamento por seção fica documentado em cada spec (campo "Ícone").
- **Diálogos e feedback.** `NzModalService` para confirmações/criação de perfil (substitui
  `<dialog>`/`confirm()` nativos) e `NzMessageService` para toasts (substitui a `div.toast` custom).
- **Compatibilidade de dados.** Nenhuma migração é necessária: os nomes de campos dos models Angular
  espelham 1:1 os do protótipo (`dados.nome`, `dados.abo`, `familiar.diabetes.r`/`.t`, etc.), então um
  JSON exportado do HTML antigo é importável sem transformação (ver 16-import-export.md).

## Estrutura de pastas

Ver árvore completa no plano de implementação (`.claude/plans`) — resumo:
`models/` (tipos), `core/services` (infra sem estado de UI), `core/state/perfil` (NgRx),
`core/facades` (facade de edição), `shared/components|directives|pipes|utils` (reuso entre seções),
`pages/carteira/<secao>` (uma pasta por seção, sempre `ts+html+scss+spec`), `pages/preview`.

## Critérios de aceite

- Nenhuma seção implementa sua própria cópia de lógica de tabela dinâmica, máscara de CPF/telefone,
  ou leitura/escrita de `localStorage` — tudo passa pelos serviços/comp partilhados acima.
- Toda mutação de dados de um perfil, em qualquer seção, resulta em uma chamada ao
  `PerfilFacadeService` (nunca acesso direto ao Store ou ao `localStorage` a partir de um componente
  de página).

## Não-regressão

- O app continua 100% client-side: nenhuma chamada de rede é introduzida para os dados de saúde.
- A chave de armazenamento (`carteira-saude:v1`) e o formato de export
  (`{ formato: 'carteira-saude', versao: 1, perfis: [...] }`) permanecem idênticos aos do protótipo.
