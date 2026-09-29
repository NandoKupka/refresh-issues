#!/usr/bin/env node
// Add the Refresh Issues rule to a project's AGENTS.md.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const START = "<!-- refresh-issues:setup:start -->";
const END = "<!-- refresh-issues:setup:end -->";
const RULE =
  "- Ao concluir uma tarefa ou commit que entrega uma feature, use " +
  "$refresh-issues antes da resposta final. Uma revisão pode cobrir vários " +
  "commits da mesma tarefa. Atualize apenas as Issues afetadas; se nada " +
  "mudou, não edite as Issues.";

function fail(message, code = 2) {
  console.error(message);
  process.exit(code);
}

const args = process.argv.slice(2);
const check = args.includes("--check");
const paths = args.filter((arg) => arg !== "--check");
if (paths.length > 1 || paths.some((arg) => arg.startsWith("-"))) {
  fail("Uso: node scripts/setup.mjs [--check] [diretório-do-projeto]");
}

const project = resolve(paths[0] ?? ".");
if (!existsSync(project) || !statSync(project).isDirectory()) {
  fail(`Diretório não encontrado: ${project}`);
}

const agents = join(project, "AGENTS.md");
const raw = existsSync(agents) ? readFileSync(agents) : Buffer.alloc(0);
const original = raw.toString("utf8");
if (!Buffer.from(original, "utf8").equals(raw)) {
  fail(`Não foi possível ler ${agents} como UTF-8.`);
}

const starts = original.split(START).length - 1;
const ends = original.split(END).length - 1;
if (
  starts !== ends ||
  starts > 1 ||
  (starts && original.indexOf(END) < original.indexOf(START))
) {
  fail(`Marcadores do Refresh Issues incompletos em ${agents}; revise o arquivo.`);
}

const hasExistingRule = original.split(/\r?\n/).some((line) => {
  const lower = line.toLocaleLowerCase("pt-BR");
  return lower.includes("refresh-issues") &&
    (lower.includes("concluir") || lower.includes("após"));
});

if (!starts && hasExistingRule) {
  console.log(`Refresh Issues já está configurado em ${agents}.`);
  process.exit(0);
}

const newline = original.includes("\r\n") ? "\r\n" : "\n";
const block = [START, RULE, END].join(newline);
if (check) {
  if (starts && original.slice(original.indexOf(START), original.indexOf(END)).includes(RULE)) {
    console.log(`Refresh Issues está configurado em ${agents}.`);
    process.exit(0);
  }
  fail(`Refresh Issues ainda não está configurado em ${agents}.`, 1);
}

let updated;
if (starts) {
  const begin = original.indexOf(START);
  const finish = original.indexOf(END) + END.length;
  updated = original.slice(0, begin) + block + original.slice(finish);
} else {
  let prefix = original;
  if (prefix && !prefix.endsWith("\n")) prefix += newline;
  if (prefix && !prefix.endsWith(newline + newline)) prefix += newline;
  updated = prefix + block + newline;
}

if (updated === original) {
  console.log(`Refresh Issues já está atualizado em ${agents}.`);
} else {
  writeFileSync(agents, updated, "utf8");
  console.log(`Refresh Issues configurado em ${agents}.`);
}