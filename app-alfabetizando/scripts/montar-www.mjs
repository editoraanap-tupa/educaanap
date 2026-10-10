// Monta a pasta www/ do app: copia as páginas do Alfabetizando (conteudo/)
// e injeta o web/premium.js (bloqueio das trilhas + compra) em cada uma.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TROCAS, ajustarInicio } from './textos-app.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'conteudo'), destino = join(raiz, 'www');
rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });

const tag = '<script src="premium.js"></script>';
// O código de cada trilha fica fechado numa função; este gancho deixa o
// premium.js ver a lista de itens (GAMES) e barrar a abertura dos trancados.
const abrir = 'function openGame(id){';
const gancho = 'window.AlfJogos=()=>GAMES;' + abrir + 'if(window.AlfTrava&&window.AlfTrava(GAMES,id))return;';
const usadas = new Set();
for (const nome of readdirSync(origem).filter(n => n.endsWith('.html'))) {
  let html = readFileSync(join(origem, nome), 'utf8');
  const vezes = html.split(abrir).length - 1;
  if (nome !== 'index.html' && vezes !== 1) throw new Error(`${nome}: esperava 1 openGame, achei ${vezes}`);
  html = html.replace(abrir, gancho);
  if (nome === 'index.html') html = ajustarInicio(html);
  for (const [de, para] of TROCAS) if (html.includes(de)) { html = html.split(de).join(para); usadas.add(de); }
  const i = html.lastIndexOf('</body>');
  if (i < 0) throw new Error(`${nome}: não achei </body>`);
  writeFileSync(join(destino, nome), html.slice(0, i) + tag + '\n' + html.slice(i));
  console.log('ok', nome);
}
for (const [de] of TROCAS) if (!usadas.has(de)) throw new Error(`Texto não encontrado no conteúdo: ${de}`);
copyFileSync(join(raiz, 'web', 'premium.js'), join(destino, 'premium.js'));
