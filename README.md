# GAEIA - Guia de Aprendizado em Engenharia de IA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Plataforma educacional interativa para aprender Inteligencia Artificial e Machine Learning, com trilhas de aprendizado estruturadas e conteudo em portugues.

## Arquitetura

GAEIA e um **integrador** que combina dois projetos:

| Repositorio | Descricao |
|-------------|-----------|
| [cosmos](https://github.com/vinimlo/cosmos) | Ferramenta generica que le "universes" e gera sites de aprendizado gamificados |
| [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) | Conteudo de IA no formato Universe |

```
GAEIA/                          # Integrador
├── cosmos/                     ← submodule (ferramenta)
├── universe/                   ← submodule (conteudo)
├── docker-compose.yml          # Dev environment
├── .github/workflows/          # CI/CD (deploy para GitHub Pages)
├── docs/                       # Documentacao e planos
└── tools/                      # Scripts auxiliares
```

## Quick Start

### Clone (com submodules)

```bash
git clone --recursive https://github.com/vinimlo/GAEIA.git
cd GAEIA
```

Se voce ja clonou sem `--recursive`:

```bash
git submodule update --init --recursive
```

### Com Docker (Recomendado)

```bash
docker compose up
# Acesse http://localhost:4321
```

### Desenvolvimento Local

```bash
cd cosmos
npm install
npm run dev
# Acesse http://localhost:4321
```

O Cosmos detecta automaticamente o diretorio `universe/` como irmao (`../universe`).

### Comandos Uteis (Docker)

```bash
# Build do projeto (modo static)
docker compose run --rm cosmos npm run build

# Type checking
docker compose run --rm cosmos npm run astro check

# Instalar dependencias
docker compose run --rm cosmos npm install
```

## Trilhas Disponiveis

- **LLM do Zero** - Entenda como funcionam os Large Language Models desde a base
- **IA Pratica** - Aprenda a usar APIs e ferramentas de IA no dia a dia
- **AI Engineer** - Trilha completa para se tornar um engenheiro de IA

## Como Contribuir

Contribuicoes sao bem-vindas! Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

- **Conteudo**: Contribua no repo [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai)
- **Ferramenta**: Contribua no repo [cosmos](https://github.com/vinimlo/cosmos)
- **Integracao/Deploy**: Contribua aqui neste repo

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).

---

Feito com dedicacao para a comunidade de IA brasileira.
