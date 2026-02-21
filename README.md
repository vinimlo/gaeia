# GAEIA — Guia de Aprendizado em Engenharia de IA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Site](https://img.shields.io/badge/Site-Online-10b981.svg)](https://vinimlo.github.io/gaeia)
[![Topicos](https://img.shields.io/badge/T%C3%B3picos-44%2B-6366f1.svg)](https://vinimlo.github.io/gaeia/topicos)
[![Cosmos](https://img.shields.io/badge/Engine-Cosmos-ff5d01.svg)](https://github.com/vinimlo/cosmos)

> Plataforma educacional interativa para aprender IA e Machine Learning, com trilhas gamificadas e conteúdo em português.

![GAEIA — Plataforma de aprendizado em IA](screenshots/02-home-conquistas.png)

## O que é?

GAEIA é uma plataforma de aprendizado em Inteligência Artificial para a comunidade brasileira. Oferece trilhas de estudo estruturadas, progresso gamificado, badges e conteúdo 100% em português.

Este repositório é o **integrador** que combina dois projetos:

| Projeto | Descrição |
|---------|-----------|
| [Cosmos](https://github.com/vinimlo/cosmos) | Engine genérica que gera sites de aprendizado gamificados |
| [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) | Conteúdo de IA no formato Universe |

## Acesse Online

**[vinimlo.github.io/gaeia](https://vinimlo.github.io/gaeia)**

## Trilhas Disponíveis

### LLM do Zero

Entenda como LLMs funcionam por dentro, construindo um do zero.
*9 tópicos · 3 módulos · Intermediário*

### IA Pratica

Aplique IA em projetos reais: LLMs, RAG, agentes e integrações.
*33 tópicos · 10 módulos · Intermediário*

### AI Engineer

Torne-se um engenheiro de IA completo, dominando LLMs, RAG, agentes e muito mais.
*35 tópicos · 10 módulos · Intermediário*

## Quick Start

### Clone (com submodules)

```bash
git clone --recursive https://github.com/vinimlo/GAEIA.git
cd GAEIA
```

Se você já clonou sem `--recursive`:

```bash
git submodule update --init --recursive
```

### Docker (Recomendado)

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

O Cosmos detecta automaticamente o diretório `universe/` como irmão.

## Arquitetura

```
GAEIA/                              # Integrador
├── cosmos/                         # submodule — engine (Astro 5)
├── universe/                       # submodule — conteúdo de IA
├── docker-compose.yml              # Dev environment
├── .github/workflows/deploy.yml    # CI/CD (GitHub Pages)
├── docs/                           # Documentação e planos
└── tools/                          # Scripts auxiliares
```

```
┌──────────┐     combina      ┌──────────┐     ┌──────────────────┐
│  GAEIA   │ ───────────────► │  Cosmos  │ ◄── │  Universe (IA)   │
│integrador│                  │  engine  │     │  conteúdo        │
└──────────┘                  └────┬─────┘     └──────────────────┘
                                   │
                                   ▼
                            Site Gamificado
                         vinimlo.github.io/gaeia
```

## Como Contribuir

| Quer contribuir com... | Onde contribuir |
|------------------------|-----------------|
| Conteúdo e tópicos | [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) |
| Ferramenta e UI | [cosmos](https://github.com/vinimlo/cosmos) |
| Deploy e integração | Aqui neste repo |

Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Feito com dedicação para a comunidade de IA brasileira.
