# GAEIA — Guia de Aprendizado em Engenharia de IA

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Site](https://img.shields.io/badge/Site-Online-10b981.svg)](https://vinimlo.github.io/gaeia)
[![Topicos](https://img.shields.io/badge/T%C3%B3picos-44%2B-6366f1.svg)](https://vinimlo.github.io/gaeia/topicos)
[![Cosmos](https://img.shields.io/badge/Engine-Cosmos-ff5d01.svg)](https://github.com/vinimlo/cosmos)

> Plataforma educacional interativa para aprender IA e Machine Learning, com trilhas gamificadas e conteudo em portugues.

![GAEIA — Plataforma de aprendizado em IA](screenshots/02-home-conquistas.png)

## O que e?

GAEIA e uma plataforma de aprendizado em Inteligencia Artificial para a comunidade brasileira. Oferece trilhas de estudo estruturadas, progresso gamificado, badges e conteudo 100% em portugues.

Este repositorio e o **integrador** que combina dois projetos:

| Projeto | Descricao |
|---------|-----------|
| [Cosmos](https://github.com/vinimlo/cosmos) | Engine generica que gera sites de aprendizado gamificados |
| [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) | Conteudo de IA no formato Universe |

## Acesse Online

**[vinimlo.github.io/gaeia](https://vinimlo.github.io/gaeia)**

## Trilhas Disponiveis

### LLM do Zero

Entenda como LLMs funcionam por dentro, construindo um do zero.
*9 topicos · 3 modulos · Intermediario*

### IA Pratica

Aplique IA em projetos reais: LLMs, RAG, agentes e integracoes.
*33 topicos · 10 modulos · Intermediario*

### AI Engineer

Torne-se um engenheiro de IA completo, dominando LLMs, RAG, agentes e muito mais.
*35 topicos · 10 modulos · Intermediario*

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

O Cosmos detecta automaticamente o diretorio `universe/` como irmao.

## Arquitetura

```
GAEIA/                              # Integrador
├── cosmos/                         # submodule — engine (Astro 5)
├── universe/                       # submodule — conteudo de IA
├── docker-compose.yml              # Dev environment
├── .github/workflows/deploy.yml    # CI/CD (GitHub Pages)
├── docs/                           # Documentacao e planos
└── tools/                          # Scripts auxiliares
```

```
┌──────────┐     combina      ┌──────────┐     ┌──────────────────┐
│  GAEIA   │ ───────────────► │  Cosmos  │ ◄── │  Universe (IA)   │
│integrador│                  │  engine  │     │  conteudo        │
└──────────┘                  └────┬─────┘     └──────────────────┘
                                   │
                                   ▼
                            Site Gamificado
                         vinimlo.github.io/gaeia
```

## Como Contribuir

| Quer contribuir com... | Onde contribuir |
|------------------------|-----------------|
| Conteudo e topicos | [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) |
| Ferramenta e UI | [cosmos](https://github.com/vinimlo/cosmos) |
| Deploy e integracao | Aqui neste repo |

Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).

---

Feito com dedicacao para a comunidade de IA brasileira.
