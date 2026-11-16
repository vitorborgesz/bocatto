# Bocatto — front-end

> **Ainda não implementado.** Esta pasta só reserva o lugar do front-end no repositório.
> O projeto React + Vite será criado depois da etapa de planejamento visual (Figma).

## Tecnologias planejadas

Isto é **planejamento**, não dependências instaladas:

| Tecnologia | Finalidade | Situação |
| --- | --- | --- |
| React | Biblioteca de interface | Planejado |
| Vite | Servidor de desenvolvimento e build | Planejado |
| JavaScript ou TypeScript | Linguagem | **A definir** |
| React Router | Navegação entre páginas | Planejado |
| Axios ou Fetch | Chamadas HTTP à API | **A definir** |
| Context API | Estado global (ex.: usuário logado, carrinho) | Planejado |

## Integração com a API

- A API roda em `http://localhost:8000` (documentação em `/docs`).
- O CORS da API já libera `http://localhost:5173`, a porta padrão do Vite
  (variável `CORS_ORIGINS` no `.env`).
- A autenticação usa JWT: o login (`POST /auth/login`) devolve um token que o
  front deverá enviar no cabeçalho `Authorization: Bearer <token>`.

## Pré-requisito

- Node.js LTS (recomendado: 24, instalado via nvm no WSL).

## Próximos passos

1. Concluir o protótipo no Figma.
2. Definir JavaScript ou TypeScript e Axios ou Fetch.
3. Criar o projeto com o Vite dentro desta pasta.
4. Documentar aqui os comandos de instalação e execução.
