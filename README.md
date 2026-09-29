# Refresh Issues

Uma skill para manter as Issues do GitHub alinhadas com o que foi entregue. Ela compara o trabalho em andamento e as entregas com as ideias abertas, atualiza o status e deixa claro o próximo passo.

Foi feita para uso com o Codex em repositórios GitHub que tenham Issues.

## O que ela faz

1. Confere o trabalho em andamento, o diff ou os commits e os testes que realmente rodaram.
2. Procura Issues relacionadas pelo número e pelo objetivo, sem criar duplicatas.
3. Confere e atualiza o status no Project, nas labels existentes ou na descrição, além do resultado, da verificação e da próxima ação. Fecha uma Issue somente quando seu objetivo foi atendido.
4. Se nenhuma Issue precisa mudar, termina sem editar o backlog.

Uma revisão comum olha apenas as Issues relacionadas ao trabalho. Peça uma revisão geral quando quiser comparar todo o backlog.

## Issue não exige PR

Uma Issue pode guardar só uma ideia para discutir depois. Ela começa com objetivo, estado atual e próxima pergunta; decisões, critérios e testes detalhados entram conforme o trabalho avança. A existência da Issue não obriga a abrir PR nem a executar uma suíte completa de testes. Quando o objetivo estiver atendido, um commit direto em `master` pode concluir e fechar a Issue sem PR. Se o commit ainda for local, registre isso. A skill segue as regras do projeto e o risco da mudança.

## Instalação

No Codex, peça:

> Use $skill-installer para instalar as skills `skills/refresh-issues` e `skills/refresh-issues-setup` do repositório `NandoKupka/refresh-issues`.

Isso instala as duas skills: uma revisa as Issues; a outra configura o projeto. Para ler e editar Issues, conecte o GitHub ao Codex ou configure o `gh` com acesso ao repositório.

Se você já clonou uma versão anterior em `~/.codex/skills/refresh-issues`, ela continua funcionando. Instale apenas `skills/refresh-issues-setup` com o `$skill-installer` para adicionar o setup.

## Setup no projeto

Abra o projeto no Codex, digite `/` e selecione **refresh-issues-setup** no menu de skills. Você também pode escrever `$refresh-issues-setup` na conversa. A skill cria ou atualiza o `AGENTS.md` do projeto sem apagar as regras existentes. Se a regra já existir, ela não a duplica.

O setup adiciona esta instrução:

```md
- Ao iniciar uma Issue, quando seu andamento mudar e ao concluir uma tarefa ou commit que entrega uma feature, use $refresh-issues para conferir e atualizar o status e as informações das Issues afetadas. Uma revisão pode cobrir vários commits da mesma tarefa. Se nada mudou, não edite as Issues.
```

O setup não define política de PR nem autoriza edição de Issues no GitHub. Se quiser que o Codex mantenha o backlog sem pedir autorização a cada Issue, acrescente separadamente ao `AGENTS.md`:

```md
- Autorizo o Codex a atualizar Issues relacionadas ao trabalho concluído e a registrar ideias futuras sem duplicatas. Feche uma Issue apenas quando seu objetivo estiver atendido.
```

A skill roda quando o Codex a chama durante uma tarefa. Ela **não instala um hook do Git**: um `git commit` feito fora de uma tarefa do Codex não a executa sozinho.

## Revisar o status

No Codex, selecione **refresh-issues** no menu `/` ou escreva:

> $refresh-issues revise o status da Issue #41 e atualize conforme o trabalho em andamento.

A mesma skill confere o status ao começar uma Issue, quando o andamento muda e ao entregar uma feature. Se a Issue já estiver num Project, ela usa o campo de status existente; sem Project, segue as labels de status do projeto ou atualiza a descrição. **Aberta** e **Em andamento** podem coexistir: fechar a Issue significa que seu objetivo foi atendido.

## Exemplo de Issue atualizada

```md
## Ideia
Facilitar o envio de imagens para o site.

## Estado atual
O envio foi implementado no commit abc123 e os testes focados passaram. O commit ainda é local.

## Próxima ação
Integrar a mudança e testar o envio com imagens reais antes de publicar.
```

A skill não inventa testes, não trata um commit local como publicação e não abre PR por conta própria. Se faltar acesso ao GitHub, ela informa o que ficou pendente.

## Dicionário

- **Skill:** instruções que ajudam o Codex a executar uma tarefa recorrente.
- **Issue:** registro de uma ideia, problema ou trabalho no GitHub.
- **Backlog:** conjunto de Issues ainda abertas ou planejadas.
- **Commit:** versão registrada no Git; pode existir só no computador.
- **Diff:** comparação que mostra o que mudou entre versões.
- **Check:** verificação, como um teste ou análise de código.
- **Branch:** linha de trabalho separada no Git.
- **PR (pull request):** proposta de integrar uma branch a outra.
- **Hook:** programa disparado automaticamente por uma ação do Git, como um commit.

## Licença

MIT. Veja [LICENSE](LICENSE).

