#!/usr/bin/env node
// Add or update the Refresh Issues rule in a project's AGENTS.md.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const START = "<!-- refresh-issues:setup:start -->";
const END = "<!-- refresh-issues:setup:end -->";
const RULE =
  "- Ao iniciar uma Issue, quando seu andamento mudar e ao concluir uma tarefa " +
  "ou commit que entrega uma feature, use $refresh-issues para conferir e " +
  "atualizar o status e as informações das Issues afetadas. Uma revisão pode " +
  "cobrir vários commits da mesma tarefa. Se nada mudou, não edite as Issues.";
const STATUS_RULE =
  "- Ao iniciar uma Issue ou quando seu andamento mudar, use $refresh-issues " +
  "para conferir e atualizar o status e as informações das Issues afetadas. " +
  "Se nada mudou, não edite as Issues.";

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

const begin = starts ? original.indexOf(START) : -1;
const finish = starts ? original.indexOf(END) + END.length : -1;
const outside = starts
  ? original.slice(0, begin) + original.slice(finish)
  : original;
const lines = outside.split(/\r?\n/).map((line) => line.toLocaleLowerCase("pt-BR"));
const hasDeliveryRule = lines.some((line) =>
  line.includes("refresh-issues") &&
  (line.includes("concluir") || line.includes("após"))
);
const hasStatusRule = lines.some((line) =>
  line.includes("refresh-issues") && line.includes("iniciar") &&
  line.includes("status")
);

// Preserve an existing delivery instruction and add only the missing status rule.
if (!starts && hasDeliveryRule && hasStatusRule) {
  console.log(`Refresh Issues já está configurado em ${agents}.`);
  process.exit(0);
}
const rule = hasDeliveryRule ? STATUS_RULE : RULE;
const newline = original.includes("\r\n") ? "\r\n" : "\n";
const block = [START, rule, END].join(newline);
if (check) {
  if (starts && original.slice(begin, finish) === block) {
    console.log(`Refresh Issues está configurado em ${agents}.`);
    process.exit(0);
  }
  fail(`Refresh Issues precisa ser configurado ou atualizado em ${agents}.`, 1);
}

let updated;
if (starts) {
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