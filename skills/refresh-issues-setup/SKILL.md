---
name: refresh-issues-setup
description: Configure or check the Refresh Issues instruction in the current project's AGENTS.md when the user asks to set up the skill.
---

# Refresh Issues Setup

Use esta skill quando o usuário pedir para configurar Refresh Issues em um projeto ou verificar a configuração. Trabalhe no projeto da conversa; se não houver um projeto definido, peça o caminho.

A configuração adiciona uma única regra ao `AGENTS.md`: depois de uma tarefa ou commit que entrega uma feature, usar `$refresh-issues` antes da resposta final. Uma revisão pode cobrir vários commits e deve tocar apenas as Issues afetadas. Preserve todas as outras regras do arquivo. Não adicione política de PR, autorização para escrever no GitHub nem hook do Git sem pedido específico.

Se Node.js estiver disponível, resolva `scripts/setup.mjs` a partir desta pasta da skill e execute `node <caminho-do-script> <diretório-do-projeto>`. O script cria o arquivo se necessário, reconhece uma regra equivalente, atualiza seu bloco e evita duplicatas. Em seguida, execute `node <caminho-do-script> --check <diretório-do-projeto>` e confira o resultado. Se Node.js não estiver disponível, faça a mesma edição diretamente, preservando o arquivo, e confira o texto salvo.

Explique em uma frase o que foi adicionado ou que a regra já existia. Esclareça que o comando configura o comportamento do Codex durante uma tarefa; um `git commit` fora do Codex não executa a skill sozinho.