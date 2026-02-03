# GAEIA - Guia de Aprendizado em Engenharia de IA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Plataforma educacional interativa para aprender Inteligência Artificial e Machine Learning, com trilhas de aprendizado estruturadas e conteúdo em português.

## O que é GAEIA?

GAEIA (Guia de Aprendizado em Engenharia de IA) é um projeto open-source que oferece:

- **Trilhas de Aprendizado** - Caminhos estruturados para aprender IA desde o básico até conceitos avançados
- **Tópicos Atômicos** - Conteúdo focado e objetivo sobre cada assunto
- **Sistema de Progresso** - Acompanhe seu avanço em cada trilha
- **Conquistas** - Badges e gamificação para motivar o aprendizado

### Trilhas Disponíveis

- **LLM do Zero** - Entenda como funcionam os Large Language Models desde a base
- **IA Prática** - Aprenda a usar APIs e ferramentas de IA no dia a dia
- **AI Engineer** - Trilha completa para se tornar um engenheiro de IA

## Tech Stack

- [Astro](https://astro.build/) - Framework web
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Docker](https://www.docker.com/) - Containerização
- [Shiki](https://shiki.style/) - Syntax highlighting

## Estrutura do Projeto

```
GAEIA/
├── gaeia-web/              # Aplicação web (Astro)
│   ├── src/
│   │   ├── components/     # Componentes Astro
│   │   ├── layouts/        # Layouts de página
│   │   ├── pages/          # Rotas (file-based routing)
│   │   ├── utils/          # Utilitários TypeScript
│   │   └── types/          # Definições de tipos
│   └── docker/             # Configurações Docker
├── universe/               # Conteúdo educacional
│   ├── topicos/            # Tópicos individuais (Markdown)
│   └── trilhas/            # Definições das trilhas (JSON)
├── docs/                   # Documentação e planos
└── tools/                  # Scripts auxiliares
```

## Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/GAEIA.git
cd GAEIA/gaeia-web

# Inicie o servidor de desenvolvimento
docker compose up

# Acesse http://localhost:4321
```

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/GAEIA.git
cd GAEIA/gaeia-web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:4321
```

### Comandos Úteis (Docker)

```bash
# Build do projeto
docker compose run --rm gaeia-web npm run build

# Type checking
docker compose run --rm gaeia-web npm run astro check

# Instalar dependências
docker compose run --rm gaeia-web npm install
```

## Como Contribuir

Contribuições são bem-vindas! Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre:

- Como configurar o ambiente de desenvolvimento
- Padrões de código
- Processo de Pull Request
- Como reportar bugs
- Guidelines para conteúdo educacional

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com dedicação para a comunidade de IA brasileira.
