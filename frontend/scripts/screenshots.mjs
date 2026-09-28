/**
 * Captura screenshots de cada tela do app (mesmo padrão do DoseCerta).
 *
 * Uso:
 *   npm run screenshots              -> sobe ng serve na porta 6100, captura e encerra
 *   SHOTS_BASE_URL=http://localhost:6010 npm run screenshots
 *                                    -> usa um servidor ja rodando (nao sobe outro)
 *   SHOTS_VIEWPORTS=mobile,desktop   -> restringe os viewports (mobile, tablet, desktop)
 *   SHOTS_THEMES=light,dark          -> temas capturados (padrao: light,dark)
 *   SHOTS_FULLPAGE=0                 -> captura so a primeira dobra (padrao: pagina inteira)
 *   CHROME_PATH=/caminho/chrome      -> forca um binario especifico
 *
 * Saida: docs/screenshots/<NN>-<tela>-<viewport>[-dark].png
 *
 * Nota: o tema vem do NgRx (theme.reducer.ts, default isDarkMode=false, fiel ao protótipo que só
 * tem tema claro) sem persistencia em localStorage. O toggle fica no topbar
 * (app-topbar.component.html, botao com texto "Modo claro"/"Modo escuro"), entao a variante escura
 * e obtida clicando nesse botao, nao setando uma chave de storage como no projeto de referencia.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'screenshots');
const PORT = process.env.SHOTS_PORT || '6100';
const BASE = (process.env.SHOTS_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const FULL_PAGE = process.env.SHOTS_FULLPAGE !== '0';
const SETTLE_MS = 2500; // espera animacoes de entrada (data-anim)

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Rotas publicas da carteira de saude (atualizar conforme novas rotas forem criadas em
// app.routes.ts / carteira.routes.ts)
const ROUTES = [
  { path: '/carteira/dados', name: '01-dados-pessoais' },
  { path: '/carteira/condicoes', name: '02-condicoes' },
  { path: '/carteira/equipe', name: '03-equipe' },
  { path: '/carteira/vacinas', name: '04-vacinas' },
  { path: '/carteira/medicamentos', name: '05-medicamentos' },
  { path: '/carteira/exames', name: '06-exames' },
  { path: '/carteira/consultas', name: '07-consultas' },
  { path: '/carteira/alergias', name: '08-alergias' },
  { path: '/carteira/cirurgias', name: '09-cirurgias' },
  { path: '/carteira/familiar', name: '10-familiar' },
  { path: '/carteira/controle', name: '11-controle' },
  { path: '/carteira/notas', name: '12-notas' },
  { path: '/carteira/opcoes', name: '13-opcoes' },
  { path: '/preview', name: '14-preview' },
];

const ALL_VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 834, height: 1194 },
  desktop: { width: 1440, height: 900 },
};
const VIEWPORTS = (process.env.SHOTS_VIEWPORTS || 'mobile,desktop')
  .split(',')
  .map((k) => k.trim())
  .filter((k) => ALL_VIEWPORTS[k])
  .map((k) => ({ key: k, ...ALL_VIEWPORTS[k] }));
const THEMES = (process.env.SHOTS_THEMES || 'light,dark')
  .split(',')
  .map((t) => t.trim())
  .filter((t) => t === 'light' || t === 'dark');

/**
 * Ativa o tema escuro clicando no botao "Modo escuro" do topbar. O tema vive so
 * no NgRx (sem localStorage), entao volta ao claro a cada carregamento de pagina.
 */
const enableDarkMode = async (page) => {
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Modo escuro')
    );
    btn?.click();
    return !!btn;
  });
  if (!clicked) throw new Error('Botao "Modo escuro" nao encontrado no topbar.');
  await wait(600);
};

/**
 * Abre a rota no tema pedido. No escuro, telas sem topbar (ex.: /preview) nao tem o
 * botao: ativa o tema na 1a rota e navega pelo router do Angular (pushState +
 * popstate), sem recarregar a pagina, para o estado do NgRx sobreviver.
 */
const openRoute = async (page, route, theme) => {
  if (theme !== 'dark') {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await wait(SETTLE_MS);
    return;
  }
  await page.goto(`${BASE}${ROUTES[0].path}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(SETTLE_MS);
  await enableDarkMode(page);
  if (route !== ROUTES[0].path) {
    await page.evaluate((target) => {
      history.pushState({}, '', target);
      dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    }, route);
    await wait(SETTLE_MS);
  }
};

/**
 * Captura a pagina inteira esticando o viewport ate a altura do documento: o
 * fullPage do Puppeteer deixa elementos `position: fixed` presos na 1a dobra.
 */
const capture = async (page, viewport, out) => {
  if (!FULL_PAGE) {
    await page.screenshot({ path: out });
    return;
  }
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewport({ width: viewport.width, height });
  await wait(300);
  await page.screenshot({ path: out });
  await page.setViewport({ width: viewport.width, height: viewport.height });
};

const findChrome = () => {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const caches = [
    path.join(homedir(), '.cache/puppeteer/chrome'),
    path.join(homedir(), '.cache/ms-playwright'),
  ];
  for (const base of caches) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base).sort().reverse()) {
      for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
        const bin = path.join(base, dir, rel);
        if (existsSync(bin)) return bin;
      }
    }
  }
  for (const bin of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (existsSync(bin)) return bin;
  }
  return null;
};

const waitForServer = async (url, timeoutMs = 90000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return true;
    } catch {
      /* ainda subindo */
    }
    await wait(1000);
  }
  return false;
};

const main = async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.error('Chrome nao encontrado. Defina CHROME_PATH ou instale o Chromium.');
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  // Se SHOTS_BASE_URL nao foi passada, sobe um ng serve temporario. `detached` cria
  // um grupo de processos proprio: o kill(-pid) derruba o npx E o ng filho.
  let server = null;
  if (!process.env.SHOTS_BASE_URL) {
    console.log(`Subindo ng serve na porta ${PORT}...`);
    server = spawn('npx', ['ng', 'serve', '--port', PORT], {
      cwd: ROOT,
      stdio: 'ignore',
      detached: true,
    });
  }

  try {
    if (!(await waitForServer(BASE))) {
      throw new Error(`Servidor nao respondeu em ${BASE}`);
    }
    console.log(
      `Servidor pronto em ${BASE}. Capturando ${ROUTES.length} telas x ${VIEWPORTS.length} viewport(s) x ${THEMES.length} tema(s)...`
    );

    const browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    for (const theme of THEMES) {
      for (const viewport of VIEWPORTS) {
        // Contexto isolado por viewport/tema: localStorage (perfis da carteira) zerado
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setViewport({ width: viewport.width, height: viewport.height });

        for (const { path: route, name } of ROUTES) {
          await openRoute(page, route, theme);

          const suffix = theme === 'dark' ? '-dark' : '';
          const out = path.join(OUT_DIR, `${name}-${viewport.key}${suffix}.png`);
          await capture(page, viewport, out);
          console.log(`  ${path.relative(ROOT, out)}`);
        }

        await context.close();
      }
    }

    await browser.close();
    console.log(`\nConcluido: screenshots em ${path.relative(ROOT, OUT_DIR)}`);
  } finally {
    if (server?.pid) {
      try {
        process.kill(-server.pid, 'SIGTERM');
      } catch {
        /* ja encerrado */
      }
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
