<h1 align="left">
  <a href="https://elizabetesousafabri.com.br" target="_blank">
    <img src="https://raw.githubusercontent.com/elizfab/carteira-saude/refs/heads/main/frontend/public/logo.png" width="40" />
  </a>
  <span>Carteira de Saúde e Vacinação</span>
</h1>

> Roadmap do projeto `carteira-saude`.
> Serve como manual de consulta e fonte de dados para o portfólio.
>
> - Data de início: `01/01/2026`
> - Última atualização: `26/09/2026`
> - Status: `[x] Em andamento | [ ] Finalizado | [ ] Arquivado`

---

## 1. Identidade do projeto

| Campo             | Valor                                     |
| ----------------- | ----------------------------------------- |
| `slug`            | `carteira-saude`                          |
| Título            | `Carteira de Saúde e Vacinação`           |
| Categoria         | `Frontend`                                |
| Tipo              | `Pessoal`                                 |
| Escopo            | `Frontend`                                |
| Domínio principal | `https://carterinha-vacinacao.vercel.app` |

- **Descrição curta:** Aplicação web para gestão pessoal de carteira de vacinação e histórico de saúde, com múltiplos perfis e impressão A4.
- **Propósito / por quê foi criado:** Centralizar em um só lugar dados pessoais de saúde (vacinas, medicamentos, exames, consultas, alergias, cirurgias, histórico familiar e sinais vitais) e permitir exportar/imprimir o histórico.
- **O que resolve:** Evita perda de informações de saúde dispersas em papéis, substitui carteiras de vacinação físicas e facilita a apresentação do histórico médico para profissionais de saúde.

---

## 2. Introdução

A Carteira de Saúde e Vacinação é um app Angular 21, 100% client-side, que armazena dados localmente no navegador (`localStorage`) e oferece uma experiência de preenchimento em múltiplas seções. Cada seção cobre um aspecto do histórico de saúde e pode ser impressa individualmente ou em conjunto, gerando um relatório A4. O projeto foi construído a partir de um protótipo HTML e hoje segue o fluxo de Spec-Driven Development (`frontend/sdd/`).

---

## 3. Índice

1. [Identidade do projeto](#1-identidade-do-projeto)
2. [Introdução](#2-introdução)
3. [Habilidades e pré-requisitos](#4-habilidades-e-pré-requisitos)
4. [Stack técnica e tópicos de estudo](#5-stack-técnica-e-tópicos-de-estudo)
5. [Como executar](#6-como-executar)
6. [Estrutura de repositório](#7-estrutura-de-repositório)
7. [Deploy e configurações](#8-deploy-e-configurações)
8. [Screenshots e ativos visuais](#9-screenshots-e-ativos-visuais)
9. [Dados do portfólio](#10-dados-do-portfólio)
10. [Backend (se existir)](#11-backend-se-existir)
11. [Checklist de finalização](#12-checklist-de-finalização)
12. [Links e referências](#13-links-e-referências)
13. [Notas de evolução](#14-notas-de-evolução)

---

## 4. Habilidades e pré-requisitos

### Conhecimentos esperados

- Angular 21 standalone, signals e change detection `OnPush`.
- Reactive Forms e `FormArray`.
- NgRx (store, entity, effects) para gerência de estado híbrida.
- ng-zorro-antd para componentes de UI.
- SCSS/Less, design tokens e paleta de cores.
- Jest para testes unitários.
- Persistência no browser (`localStorage`) e import/export JSON.

### Ferramentas / versões

- Node.js 22
- Angular CLI 21.2.9
- npm 10.9.7
- Puppeteer (para screenshots)
- Chrome/Chromium instalado

---

## 5. Stack técnica e tópicos de estudo

### Tecnologias

| Tecnologia            | Uso / papel no projeto                                      |
| --------------------- | ----------------------------------------------------------- |
| `Angular 21`          | Framework principal, standalone components                  |
| `TypeScript 5.9`      | Linguagem principal                                         |
| `SCSS / Less`         | Estilização e tema do ng-zorro-antd                         |
| `ng-zorro-antd`       | Componentes de UI (formulários, tabelas, modais, mensagens) |
| `NgRx`                | Gerenciamento de estado: store, entity, effects, devtools   |
| `Jest`                | Testes unitários com `jest-preset-angular`                  |
| `@fontsource/carlito` | Self-host da fonte Carlito para impressão consistente       |
| `localStorage`        | Persistência 100% client-side dos perfis e dados            |

### Tópicos de estudo / aprofundamento

- `localStorage` e backup JSON sem backend.
- Geração de layout de impressão A4 com CSS (`@media print`).
- Multi-perfil com NgRx entity e facade pattern.
- Tabelas dinâmicas editáveis via `EditableTableComponent` compartilhado.
- Persistência de tema claro/escuro via `ThemeService` + NgRx.

---

## 6. Como executar

### Desenvolvimento local

```bash
cd frontend
npm install
npm run start:dev   # http://localhost:6010
```

### Acesso após subir

| Serviço | URL local               |
| ------- | ----------------------- |
| Web     | `http://localhost:6010` |

### Variáveis de ambiente relevantes

- Não há `.env` no frontend; configuração é estática.
- Chave de `localStorage`: `carteira-saude:v1`.
- Formato de export: `{ formato: 'carteira-saude', versao: 1, perfis: [...] }`.

---

## 7. Estrutura de repositório

```txt
carteira-saude/
├── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── facades/perfil-facade.service.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── storage.service.ts
│   │   │   │   │   ├── import-export.service.ts
│   │   │   │   │   ├── print-layout.service.ts
│   │   │   │   │   └── theme.service.ts
│   │   │   │   └── state/perfil/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   │   ├── carteira/
│   │   │   │   │   ├── dados-pessoais/
│   │   │   │   │   ├── condicoes/
│   │   │   │   │   ├── equipe/
│   │   │   │   │   ├── vacinas/
│   │   │   │   │   ├── medicamentos/
│   │   │   │   │   ├── exames/
│   │   │   │   │   ├── consultas/
│   │   │   │   │   ├── alergias/
│   │   │   │   │   ├── cirurgias/
│   │   │   │   │   ├── familiar/
│   │   │   │   │   ├── controle/
│   │   │   │   │   ├── notas/
│   │   │   │   │   ├── opcoes/
│   │   │   │   │   └── carteira-shell/
│   │   │   │   └── preview/
│   │   │   └── shared/
│   │   │       └── components/
│   │   │           └── editable-table/
│   │   ├── public/
│   │   │   └── logo.png
│   │   ├── styles.scss
│   │   └── theme.less
│   ├── docs/
│   │   ├── PENDENCIAS.md
│   │   └── screenshots/
│   │       ├── 01-dados-pessoais.png
│   │       ├── 02-condicoes.png
│   │       ├── 03-equipe.png
│   │       ├── 04-vacinas.png
│   │       ├── 05-medicamentos.png
│   │       ├── 06-exames.png
│   │       ├── 07-consultas.png
│   │       ├── 08-alergias.png
│   │       ├── 09-cirurgias.png
│   │       ├── 10-familiar.png
│   │       ├── 11-controle.png
│   │       ├── 12-notas.png
│   │       ├── 13-opcoes.png
│   │       └── 14-preview.png
│   ├── sdd/
│   │   ├── 00-arquitetura.md
│   │   ├── 01-perfis-e-armazenamento.md
│   │   ├── 02-dados-pessoais.md
│   │   ├── ...
│   │   └── README.md
│   ├── scripts/
│   │   └── screenshots.mjs
│   ├── angular.json
│   └── package.json
└── (não há backend no momento — 100% client-side)
```

---

## 8. Deploy e configurações

### Provedor / plataforma

- **Frontend:** Vercel
- **Backend:** `N/A` (app client-side)
- **Banco:** `N/A` (dados do usuário ficam no `localStorage` do navegador)

### Domínios e URLs

| Ambiente | URL                                         |
| -------- | ------------------------------------------- |
| Produção | `https://carterinha-vacinacao.vercel.app`   |
| Repo     | `https://github.com/elizfab/carteira-saude` |

### Credenciais de acesso

- Sem login; os dados são isolados por perfil localmente.

### Portas planejadas

| Serviço  | Porta local | Observação                                                  |
| -------- | ----------- | ----------------------------------------------------------- |
| Frontend | `6010`      | Porta definida em `package.json` e usada no desenvolvimento |

---

## 9. Screenshots e ativos visuais

Os prints são gerados pelo `frontend/scripts/screenshots.mjs`, com base nas 14 rotas da aplicação.

### Rotas a capturar

```js
const ROUTES = [
  { path: "/carteira/dados", name: "01-dados-pessoais" },
  { path: "/carteira/condicoes", name: "02-condicoes" },
  { path: "/carteira/equipe", name: "03-equipe" },
  { path: "/carteira/vacinas", name: "04-vacinas" },
  { path: "/carteira/medicamentos", name: "05-medicamentos" },
  { path: "/carteira/exames", name: "06-exames" },
  { path: "/carteira/consultas", name: "07-consultas" },
  { path: "/carteira/alergias", name: "08-alergias" },
  { path: "/carteira/cirurgias", name: "09-cirurgias" },
  { path: "/carteira/familiar", name: "10-familiar" },
  { path: "/carteira/controle", name: "11-controle" },
  { path: "/carteira/notas", name: "12-notas" },
  { path: "/carteira/opcoes", name: "13-opcoes" },
  { path: "/preview", name: "14-preview" },
];
```

### Estrutura de páginas / imagens

| Ordem | Rota                     | Nome do arquivo         | Descrição da tela                | Destino no portfólio                                    |
| ----- | ------------------------ | ----------------------- | -------------------------------- | ------------------------------------------------------- |
| 1     | `/carteira/dados`        | `01-dados-pessoais.png` | Dados pessoais + foto 3x4        | `/images/projects/carteira-saude/01-dados-pessoais.png` |
| 2     | `/carteira/condicoes`    | `02-condicoes.png`      | Condições e diagnósticos         | `/images/projects/carteira-saude/02-condicoes.png`      |
| 3     | `/carteira/equipe`       | `03-equipe.png`         | Equipe de saúde e acompanhamento | `/images/projects/carteira-saude/03-equipe.png`         |
| 4     | `/carteira/vacinas`      | `04-vacinas.png`        | Histórico de vacinação           | `/images/projects/carteira-saude/04-vacinas.png`        |
| 5     | `/carteira/medicamentos` | `05-medicamentos.png`   | Medicamentos contínuos           | `/images/projects/carteira-saude/05-medicamentos.png`   |
| 6     | `/carteira/exames`       | `06-exames.png`         | Exames realizados                | `/images/projects/carteira-saude/06-exames.png`         |
| 7     | `/carteira/consultas`    | `07-consultas.png`      | Consultas e especialistas        | `/images/projects/carteira-saude/07-consultas.png`      |
| 8     | `/carteira/alergias`     | `08-alergias.png`       | Alergias e restrições            | `/images/projects/carteira-saude/08-alergias.png`       |
| 9     | `/carteira/cirurgias`    | `09-cirurgias.png`      | Cirurgias e internações          | `/images/projects/carteira-saude/09-cirurgias.png`      |
| 10    | `/carteira/familiar`     | `10-familiar.png`       | Histórico familiar               | `/images/projects/carteira-saude/10-familiar.png`       |
| 11    | `/carteira/controle`     | `11-controle.png`       | Pressão, peso e glicemia         | `/images/projects/carteira-saude/11-controle.png`       |
| 12    | `/carteira/notas`        | `12-notas.png`          | Anotações gerais                 | `/images/projects/carteira-saude/12-notas.png`          |
| 13    | `/carteira/opcoes`       | `13-opcoes.png`         | Opções de impressão              | `/images/projects/carteira-saude/13-opcoes.png`         |
| 14    | `/preview`               | `14-preview.png`        | Pré-visualização A4              | `/images/projects/carteira-saude/14-preview.png`        |

### Comandos

```bash
cd frontend
npm run screenshots

# Usa um servidor já rodando
SHOTS_BASE_URL=http://localhost:6010 npm run screenshots

# Captura também variante escura (tema escuro via toggle)
SHOTS_DARK=1 npm run screenshots

# Define caminho alternativo do Chrome
CHROME_PATH=/caminho/do/chrome npm run screenshots
```

### Diretórios de saída

| Origem           | Destino dos screenshots                                             | Finalidade                               |
| ---------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| Projeto          | `frontend/docs/screenshots/`                                        | Documentação do próprio projeto e README |
| README do GitHub | `.github/assets/images/projects-personal/carteira-saude/`           | Ativos do README do repositório          |
| Portfólio        | `portfolio-angular-frontend/public/images/projects/carteira-saude/` | Exibição no portfólio Angular            |

### Logo / capa

- Logo do app: `frontend/public/logo.png`
- Logo para README/portfólio: `.github/assets/images/projects-personal/carterinha-saude/logo.png` (padrão antigo, avaliar unificar para `carteira-saude`)

### Fluxo de publicação dos ativos

1. Após finalizar as telas, execute `npm run screenshots`.
2. Valide os arquivos em `frontend/docs/screenshots/`.
3. Copie os arquivos selecionados para o README do GitHub do projeto: `.github/assets/images/projects-personal/carteira-saude/`.
4. Copie os arquivos selecionados para o portfólio: `portfolio-angular-frontend/public/images/projects/carteira-saude/`.
5. Atualize a seção `## 10. Dados do portfólio` deste roadmap com os caminhos finais.
6. Replique as informações em `src/app/shared/data/projects/portfolio-personal.data.ts`.
   Futuramente esse passo será substituído por um formulário/backend no próprio portfólio.

---

## 10. Dados do portfólio

> Seção pronta para ser copiada para `portfolio-personal.data.ts`.

```ts
{
  slug: 'carteira-saude',
  title: 'Carteira de Saúde e Vacinação',
  description:
    'Aplicação Angular para controle pessoal de carteira de vacinação e histórico de saúde, ' +
    'com múltiplos perfis, dados pessoais, vacinas, medicamentos, exames, consultas, alergias, ' +
    'cirurgias, histórico familiar, sinais vitais, notas e impressão A4.',
  category: 'Frontend',
  typeTag: 'saude',
  techs: ['Angular 21', 'TypeScript', 'SCSS', 'ng-zorro-antd', 'NgRx', 'Jest'],
  image: {
    src: '/images/projects/carteira-saude/logo.png',
    alt: 'Logo da Carteira de Saúde e Vacinação',
    fit: 'contain',
  },
  repoUrl: 'https://github.com/elizfab/carteira-saude',
  demoUrl: 'https://carterinha-vacinacao.vercel.app',
  problem:
    'Dificuldade em manter o histórico de saúde e vacinação organizado, acessível e transportável ' +
    'para consultas médicas.',
  solution:
    'App 100% client-side com múltiplos perfis, formulários por seção, tabelas dinâmicas, ' +
    'persistência local, import/export JSON e pré-visualização/relatório A4.',
  technicalDecisions: [
    'NgRx store + entity para gerenciar múltiplos perfis e perfil ativo',
    'Facade pattern (PerfilFacadeService) para centralizar mutações de dados',
    'Tabela dinâmica editável reutilizável (`EditableTableComponent`)',
    'Persistência em localStorage com chave `carteira-saude:v1` e formato de export versionado',
    'Tema claro/escuro com toggle e self-host da fonte Carlito para impressão consistente',
    'Impressão A4 via CSS `@media print` e `PrintLayoutService`',
  ],
  gallery: [
    { src: '/images/projects/carteira-saude/01-dados-pessoais.png', alt: 'Dados pessoais e foto 3x4' },
    { src: '/images/projects/carteira-saude/02-condicoes.png', alt: 'Condições e diagnósticos' },
    { src: '/images/projects/carteira-saude/03-equipe.png', alt: 'Equipe de saúde e acompanhamento' },
    { src: '/images/projects/carteira-saude/04-vacinas.png', alt: 'Histórico de vacinação' },
    { src: '/images/projects/carteira-saude/05-medicamentos.png', alt: 'Medicamentos contínuos' },
    { src: '/images/projects/carteira-saude/06-exames.png', alt: 'Exames realizados' },
    { src: '/images/projects/carteira-saude/07-consultas.png', alt: 'Consultas e especialistas' },
    { src: '/images/projects/carteira-saude/08-alergias.png', alt: 'Alergias e restrições' },
    { src: '/images/projects/carteira-saude/09-cirurgias.png', alt: 'Cirurgias e internações' },
    { src: '/images/projects/carteira-saude/10-familiar.png', alt: 'Histórico familiar' },
    { src: '/images/projects/carteira-saude/11-controle.png', alt: 'Pressão, peso e glicemia' },
    { src: '/images/projects/carteira-saude/12-notas.png', alt: 'Anotações gerais' },
    { src: '/images/projects/carteira-saude/13-opcoes.png', alt: 'Opções de impressão' },
    { src: '/images/projects/carteira-saude/14-preview.png', alt: 'Pré-visualização A4' },
  ],
  // Este projeto não possui backend — remova `backendContext` ao copiar para o portfólio.
}
```

### Campos pendentes de preenchimento

- [x] `slug`
- [x] `title`
- [x] `description`
- [x] `category`
- [x] `techs`
- [x] `image.src` e `image.alt`
- [x] `repoUrl`
- [x] `demoUrl`
- [x] `problem`
- [x] `solution`
- [x] `technicalDecisions`
- [x] `gallery`
- [ ] `backendContext` (`N/A` — projeto sem backend)

---

## 11. Backend (se existir)

> Não aplicável. A Carteira de Saúde e Vacinação é 100% client-side: os dados são mantidos no `localStorage` do navegador do usuário e podem ser exportados/importados via JSON. Não há backend, banco de dados remoto nem autenticação.

---

## 12. Checklist de finalização

### Planejamento e setup

- [x] Nome e domínio definidos
- [x] Repositório criado no GitHub
- [x] Estrutura `frontend/` criada
- [ ] `.env` e `.env.example` configurados (`N/A` para frontend client-side)
- [ ] `docker-compose.yml` ajustado e testado (`N/A` por enquanto)

### Desenvolvimento

- [x] Telas / rotas principais implementadas (14 seções)
- [ ] Integração frontend ↔ backend concluída (`N/A`)
- [x] Testes unitários passando
- [x] Build de produção gerado sem erros

### Documentação

- [ ] `README.md` do projeto preenchido (hoje só tem placeholders)
- [x] `sdd/` com specs por seção
- [x] Pendências documentadas em `docs/PENDENCIAS.md`

### Captura de imagens

- [x] `scripts/screenshots.mjs` configurado com as 14 rotas
- [x] Prints gerados em `frontend/docs/screenshots/`
- [x] Logo/capa produzida (`public/logo.png`)
- [ ] Prints copiados para `portfolio-angular-frontend/public/images/projects/carteira-saude/`

### Deploy

- [x] Frontend publicado na Vercel
- [ ] Backend publicado em Render / outro provedor (`N/A`)
- [ ] Banco acessível e persistindo dados (`N/A`)
- [ ] `GET /health` respondendo 200 (`N/A`)
- [ ] Testes de fumaça no ambiente de produção

### Portfólio

- [x] Seção `## 10. Dados do portfólio` preenchida
- [ ] Entrada inserida em `portfolio-personal.data.ts`
- [ ] Imagens ajustadas no portfólio (`public/images/projects/carteira-saude/...`)
- [ ] Deploy do portfólio realizado e card funcionando

---

## 13. Links e referências

### Projeto

- Repo: `https://github.com/elizfab/carteira-saude`
- Deploy: `https://carterinha-vacinacao.vercel.app`
- README: `carteira-saude/README.md` (em andamento)
- Pendências: `carteira-saude/frontend/docs/PENDENCIAS.md`
- SDD: `carteira-saude/frontend/sdd/README.md`

### Documentação e caderno de estudos

- Protótipo de referência: `org-elizfab/docs/backup/carteira-saude.html`
- Especificações: `frontend/sdd/`

### Gerenciamento

- Template de roadmap por projeto: `MFE/.github/assets/documentation/00.template.roadmap.md`

---

## 14. Notas de evolução

- Pendência consciente: aviso de texto cortado na pré-visualização A4 ainda não foi portado do protótipo.
- Tema escuro existe mas é uma adição própria; o protótipo original é 100% claro.
- Fonte Carlito agora é self-hosted via `@fontsource/carlito` para evitar dependência de fontes do SO.
- Modelo de multi-perfil permite que uma mesma instalação do app armazene dados de várias pessoas (ex.: família).

---

## 15. Bloco de dados do portfólio — pronto para copiar

> Copie o bloco abaixo e cole em `portfolio-angular-frontend/src/app/shared/data/projects/portfolio-personal.data.ts`.

```ts
{
  slug: 'carteira-saude',
  title: 'Carteira de Saúde e Vacinação',
  description:
    'Aplicação Angular para controle pessoal de carteira de vacinação e histórico de saúde, ' +
    'com múltiplos perfis, dados pessoais, vacinas, medicamentos, exames, consultas, alergias, ' +
    'cirurgias, histórico familiar, sinais vitais, notas e impressão A4.',
  category: 'Frontend',
  techs: ['Angular 21', 'TypeScript', 'SCSS', 'ng-zorro-antd', 'NgRx', 'Jest'],
  image: {
    src: '/images/projects/carteira-saude/logo.png',
    alt: 'Logo da Carteira de Saúde e Vacinação',
    fit: 'contain',
  },
  repoUrl: 'https://github.com/elizfab/carteira-saude',
  demoUrl: 'https://carterinha-vacinacao.vercel.app',
  problem:
    'Dificuldade em manter o histórico de saúde e vacinação organizado, acessível e transportável ' +
    'para consultas médicas.',
  solution:
    'App 100% client-side com múltiplos perfis, formulários por seção, tabelas dinâmicas, ' +
    'persistência local, import/export JSON e pré-visualização/relatório A4.',
  technicalDecisions: [
    'NgRx store + entity para gerenciar múltiplos perfis e perfil ativo',
    'Facade pattern (PerfilFacadeService) para centralizar mutações de dados',
    'Tabela dinâmica editável reutilizável (`EditableTableComponent`)',
    'Persistência em localStorage com chave `carteira-saude:v1` e formato de export versionado',
    'Tema claro/escuro com toggle e self-host da fonte Carlito para impressão consistente',
    'Impressão A4 via CSS `@media print` e `PrintLayoutService`',
  ],
  gallery: [
    { src: '/images/projects/carteira-saude/01-dados-pessoais.png', alt: 'Dados pessoais e foto 3x4' },
    { src: '/images/projects/carteira-saude/02-condicoes.png', alt: 'Condições e diagnósticos' },
    { src: '/images/projects/carteira-saude/03-equipe.png', alt: 'Equipe de saúde e acompanhamento' },
    { src: '/images/projects/carteira-saude/04-vacinas.png', alt: 'Histórico de vacinação' },
    { src: '/images/projects/carteira-saude/05-medicamentos.png', alt: 'Medicamentos contínuos' },
    { src: '/images/projects/carteira-saude/06-exames.png', alt: 'Exames realizados' },
    { src: '/images/projects/carteira-saude/07-consultas.png', alt: 'Consultas e especialistas' },
    { src: '/images/projects/carteira-saude/08-alergias.png', alt: 'Alergias e restrições' },
    { src: '/images/projects/carteira-saude/09-cirurgias.png', alt: 'Cirurgias e internações' },
    { src: '/images/projects/carteira-saude/10-familiar.png', alt: 'Histórico familiar' },
    { src: '/images/projects/carteira-saude/11-controle.png', alt: 'Pressão, peso e glicemia' },
    { src: '/images/projects/carteira-saude/12-notas.png', alt: 'Anotações gerais' },
    { src: '/images/projects/carteira-saude/13-opcoes.png', alt: 'Opções de impressão' },
    { src: '/images/projects/carteira-saude/14-preview.png', alt: 'Pré-visualização A4' },
  ],
}
```
