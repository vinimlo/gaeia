# Guia de Contribuição

Obrigado pelo interesse em contribuir com o GAEIA! Este documento explica como você pode participar do projeto.

## Configurando o Ambiente de Desenvolvimento

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose (recomendado)
- Ou: [Node.js](https://nodejs.org/) 18+ e npm

### Setup com Docker

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/GAEIA.git
cd GAEIA/gaeia-web

# Inicie o ambiente de desenvolvimento
docker compose up
```

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/GAEIA.git
cd GAEIA/gaeia-web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Padrões de Código

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any` - prefira tipos específicos ou `unknown`
- Exporte tipos em arquivos dedicados em `src/types/`

### Componentes Astro

- Um componente por arquivo
- Nomes em PascalCase (ex: `ProgressBar.astro`)
- Props tipadas no frontmatter

### CSS/Tailwind

- Use classes Tailwind diretamente nos componentes
- Para estilos complexos, use arquivos CSS em `src/styles/`

### Commits

Siga o padrão de mensagens descritivas:

```
Adiciona sistema de badges na página de conquistas

- Implementa BadgeDisplay component
- Adiciona lógica de desbloqueio baseada em progresso
- Integra com localStorage para persistência
```

## Processo de Pull Request

1. **Fork** o repositório
2. **Crie uma branch** para sua feature/fix:
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/descricao-do-bug
   ```
3. **Faça suas alterações** seguindo os padrões de código
4. **Teste localmente** antes de submeter
5. **Commit** com mensagens descritivas
6. **Push** para seu fork
7. **Abra um Pull Request** descrevendo suas mudanças

### Checklist do PR

- [ ] Código segue os padrões do projeto
- [ ] Funciona localmente sem erros
- [ ] Descrição clara do que foi alterado
- [ ] Issues relacionadas linkadas (se aplicável)

## Reportando Bugs

Ao reportar um bug, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir** o bug
3. **Comportamento esperado** vs. comportamento atual
4. **Screenshots** (se aplicável)
5. **Ambiente**: navegador, sistema operacional, etc.

Use o template de issue de bug disponível no repositório.

## Guidelines para Conteúdo Educacional

### Criando Tópicos

Tópicos ficam em `universe/topicos/` como arquivos Markdown:

```markdown
---
title: Nome do Tópico
description: Breve descrição do conteúdo
tags: [tag1, tag2]
---

# Nome do Tópico

Conteúdo do tópico aqui...
```

#### Boas práticas para tópicos:

- **Foco único**: Cada tópico deve abordar um conceito específico
- **Linguagem clara**: Escreva de forma acessível, evitando jargões desnecessários
- **Exemplos práticos**: Inclua exemplos de código quando relevante
- **Progressivo**: Assuma conhecimento dos tópicos anteriores na trilha

### Criando/Modificando Trilhas

Trilhas são definidas em `universe/trilhas/` como arquivos JSON:

```json
{
  "id": "nome-da-trilha",
  "titulo": "Nome da Trilha",
  "descricao": "Descrição da trilha",
  "modulos": [
    {
      "id": "modulo-1",
      "titulo": "Nome do Módulo",
      "topicos": ["topico-1", "topico-2"]
    }
  ]
}
```

#### Considerações para trilhas:

- Ordem lógica de aprendizado
- Pré-requisitos claros entre módulos
- Balanceamento entre teoria e prática

## Dúvidas?

Abra uma issue com a tag `question` ou participe das discussões no repositório.

---

Obrigado por contribuir!
