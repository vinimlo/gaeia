# Design: gaeia-web - Obsidian como Fonte Única de Verdade

**Data:** 2026-02-03
**Status:** Aprovado para implementação

## Contexto

O projeto gaeia-web atualmente tem dois sistemas coexistindo:
- Sistema legacy de blocos (`01-Guia-de-Estudos/`)
- Sistema novo de trilhas/tópicos (`universe/`)

O objetivo é unificar para que o Obsidian vault seja a única fonte de verdade, com estrutura clara e código simplificado.

## Decisões

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Hierarquia | Trilhas → Módulos → Tópicos | Estrutura clara e navegável |
| Localização .md | Pasta central `topicos/` | Permite reutilização em múltiplas trilhas |
| Roadmap | Migrar para tópicos | Unifica todo conteúdo |
| Discovery | Catálogo central | Controle explícito do que aparece |
| Rotas | `/trilhas/[trilha]/[topico]` | Espelha hierarquia do vault |
| Legacy | Remover completamente | Simplifica manutenção |

## Estrutura do Vault

```
universe/
├── _catalog.json           # Entrada principal
├── topicos/
│   ├── _index.json        # Índice de tópicos
│   └── *.md               # Tópicos atômicos
├── trilhas/
│   ├── llm-do-zero.json
│   ├── ia-pratica.json
│   └── ai-engineer.json
└── shared/
    └── badges.json
```

## Schemas

### _catalog.json
```json
{
  "trilhas": [
    { "id": "llm-do-zero", "path": "trilhas/llm-do-zero.json" }
  ],
  "topicos": { "path": "topicos/_index.json" }
}
```

### trilhas/*.json
```json
{
  "id": "llm-do-zero",
  "titulo": "LLM do Zero",
  "descricao": "...",
  "modulos": [
    {
      "id": "fundamentos",
      "titulo": "Fundamentos",
      "topicos": ["neuronio-e-vetores", "mlp-e-matrizes"]
    }
  ],
  "badges": [...]
}
```

### topicos/*.md (frontmatter)
```yaml
---
titulo: "Neurônio e Vetores"
descricao: "..."
duracao: 45
dificuldade: iniciante
tags: [fundamentos, math]
---
```

## Rotas Web

| Rota | Descrição |
|------|-----------|
| `/` | Home - lista trilhas |
| `/trilhas` | Catálogo de trilhas |
| `/trilhas/[trilha]` | Página da trilha |
| `/trilhas/[trilha]/[topico]` | Tópico com contexto |
| `/topicos` | Biblioteca de tópicos |
| `/topicos/[topico]` | Tópico standalone |
| `/conquistas` | Badges |

## Fora do Escopo

- Mudanças de design visual
- Gamificação adicional
- Backend/autenticação
