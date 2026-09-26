# 01 — Perfis e armazenamento

## Objetivo

Permitir múltiplos perfis (ex.: cada filho) na mesma instalação do app, cada um com seus próprios
dados, e persistir tudo localmente sem servidor.

## Modelo de dados

```ts
interface DbState { ativoId: string; perfis: Dictionary<Perfil>; } // @ngrx/entity
interface Perfil {
  id: string;
  dados: DadosPessoais;
  condicoes: Condicao[];
  equipe: EquipeSaude[];
  vacinas: Vacina[];
  medicamentos: Medicamento[];
  exames: Exame[];
  consultas: Consulta[];
  cirurgias: Cirurgia[];
  controle: ControleMedicao[];
  alergias: Alergias;
  familiar: HistoricoFamiliar;
  notas: string;
  opcoes: OpcoesImpressao;
}
```

- Chave de storage: `carteira-saude:v1`.
- Payload salvo: `{ ativo: string, perfis: Record<string, Perfil> }` (mesmo shape do protótipo).

## Comportamento

- Ao iniciar o app (`PerfilEffects`, on init): lê o `localStorage`; se vazio/corrompido, cria um
  perfil vazio (`nome: ''`) e o marca como ativo.
- Qualquer perfil carregado passa por normalização (equivalente a `normalizar()`/`merge()` do
  protótipo): campos ausentes no JSON recebem o valor padrão de `perfilVazio()`, sem perder campos
  desconhecidos extras.
- Toda mutação (via `PerfilFacadeService`) despacha uma action e agenda `salvar()` com debounce de
  250ms (evita gravar a cada tecla digitada).
- Se `localStorage.setItem` falhar (modo privado/cota), a UI mostra aviso persistente orientando a
  usar "Exportar dados" — não deve travar a edição.
- **Novo perfil**: abre `NzModalService` pedindo nome; cria perfil vazio, marca como ativo, navega
  para "Dados pessoais".
- **Excluir perfil**: confirmação (`NzModalService.confirm`) citando que a ação não pode ser desfeita;
  se era o único perfil, cria um novo vazio automaticamente (nunca fica sem nenhum perfil).
- **Trocar perfil ativo** (seletor no topbar): apenas troca `ativoId`; não deve dataleak de campos
  entre perfis (cada seção re-renderiza com os dados do novo perfil).

## Critérios de aceite

- Recarregar a página preserva o perfil ativo e todos os dados digitados.
- Criar um segundo perfil não altera nem mistura os dados do primeiro.
- Excluir o último perfil deixa o app num estado válido (um perfil vazio, nunca uma tela quebrada).
- Simular falha de `localStorage.setItem` (mock lançando exceção) não impede a edição continuar nem
  quebra a aplicação; a UI exibe aviso.
- O reducer é puro: mesma entrada + mesma action sempre produz o mesmo novo estado (teste de
  reducer clássico, sem mocks).

## Não-regressão

- Debounce de 250ms antes de gravar no `localStorage` (mesmo valor do protótipo).
- Formato de payload compatível com o protótipo (permite importar backups antigos — spec 16).
