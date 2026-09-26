/**
 * Captura screenshots full-page de cada tela do app.
 *
 * Uso:
 *   npm run screenshots              -> sobe ng serve na porta 6100, captura e encerra
 *   SHOTS_BASE_URL=http://localhost:6001 npm run screenshots
 *                                    -> usa um servidor ja rodando (nao sobe outro)
 *   SHOTS_DARK=1 npm run screenshots -> captura tambem no tema escuro
 *   CHROME_PATH=/caminho/chrome      -> forca um binario especifico
 *
 * Saida: docs/screenshots/<NN>-<rota>.png (e -dark.png quando SHOTS_DARK=1)
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
const DARK = !!process.env.SHOTS_DARK;
const VIEWPORT = { width: 1440, height: 900 };
const SETTLE_MS = 2500; // espera animacoes de entrada (data-anim)

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
    await new Promise((r) => setTimeout(r, 1000));
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

  // Se SHOTS_BASE_URL nao foi passada, sobe um ng serve temporario
  let server = null;
  if (!process.env.SHOTS_BASE_URL) {
    console.log(`Subindo ng serve na porta ${PORT}...`);
    server = spawn('npx', ['ng', 'serve', '--port', PORT], {
      cwd: ROOT,
      stdio: 'ignore',
    });
  }

  try {
    if (!(await waitForServer(BASE))) {
      throw new Error(`Servidor nao respondeu em ${BASE}`);
    }
    console.log(`Servidor pronto em ${BASE}. Capturando ${ROUTES.length} telas...`);

    const browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    for (const { path: route, name } of ROUTES) {
      const url = `${BASE}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise((r) => setTimeout(r, SETTLE_MS));

      const out = path.join(OUT_DIR, `${name}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log(`  ${out}`);

      if (DARK) {
        const clicked = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find((b) =>
            b.textContent?.includes('Modo escuro')
          );
          if (!btn) return false;
          btn.click();
          return true;
        });
        if (clicked) {
          await new Promise((r) => setTimeout(r, SETTLE_MS));
          const dark = path.join(OUT_DIR, `${name}-dark.png`);
          await page.screenshot({ path: dark, fullPage: true });
          console.log(`  ${dark}`);
        }
      }
    }

    await browser.close();
    console.log(`\nConcluido: screenshots em ${OUT_DIR}`);
  } finally {
    server?.kill('SIGTERM');
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
