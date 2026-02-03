---
titulo: "Introducao a AI Agents"
tags: ["ai-agents", "terminologia"]
prerequisitos: ["llms-intro"]
nivel: "iniciante"
tempoEstimado: 40
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Introducao a AI Agents

Em AI Engineering, "agents" sao sistemas autonomos que podem perceber seu ambiente, tomar decisoes e executar acoes para atingir objetivos especificos. Eles representam a evolucao dos LLMs de "respondedores de perguntas" para "executores de tarefas".

## O que e um AI Agent?

Um AI Agent e um sistema que:
1. **Recebe um objetivo** do usuario
2. **Planeja** como atingi-lo
3. **Executa acoes** usando ferramentas
4. **Observa resultados** e ajusta o plano
5. **Itera** ate completar ou falhar

```
Usuario: "Pesquise sobre o concorrente X e faca um resumo"

Agent:
  Pensamento: Preciso buscar informacoes sobre X
  Acao: search_web("empresa X noticias recentes")
  Observacao: [resultados da busca]

  Pensamento: Tenho informacoes, preciso visitar os sites
  Acao: browse_url("https://...")
  Observacao: [conteudo da pagina]

  Pensamento: Agora posso sintetizar
  Acao: generate_summary(informacoes)
  Resposta: "Aqui esta o resumo sobre X..."
```

## Componentes de um Agent

### 1. LLM (Cerebro)
O modelo que raciocina e decide proximas acoes.

### 2. Ferramentas (Tools)
Capacidades que o agent pode usar:
- `search_web` - Buscar na internet
- `read_file` - Ler arquivos
- `execute_code` - Rodar Python
- `send_email` - Enviar emails
- `query_database` - Consultar banco de dados

### 3. Memoria
- **Curto prazo** - Contexto da conversa atual
- **Longo prazo** - Informacoes persistidas entre sessoes

### 4. Planejamento
Estrategia para decompor objetivos complexos em passos.

## Tipos de Agents

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **ReAct** | Reason + Act em loop | Mais comum |
| **Plan-and-Execute** | Planeja tudo antes | Tarefas complexas |
| **Self-Ask** | Faz sub-perguntas | Pesquisa |
| **Multi-Agent** | Varios agents colaborando | Simulacoes |

## Exemplo com LangChain

```python
from langchain.agents import create_react_agent
from langchain_openai import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun, WikipediaQueryRun

# Definir ferramentas
tools = [
    DuckDuckGoSearchRun(),
    WikipediaQueryRun()
]

# Criar agent
llm = ChatOpenAI(model="gpt-4")
agent = create_react_agent(llm, tools)

# Executar
result = agent.invoke({
    "input": "Quem ganhou a Copa do Mundo de 2022?"
})
```

## Casos de Uso

- **Assistentes pessoais** - Agendar reunioes, enviar emails
- **Pesquisa automatizada** - Coletar e sintetizar informacoes
- **Automacao de tarefas** - Processar documentos, gerar relatorios
- **Coding assistants** - Escrever, testar e debugar codigo
- **Suporte ao cliente** - Resolver problemas com acesso a sistemas

## Desafios e Limitacoes

1. **Confiabilidade** - Agents podem "travar" em loops
2. **Custo** - Muitas chamadas de API = conta alta
3. **Latencia** - Multiplas etapas = tempo de resposta longo
4. **Seguranca** - Acoes autonomas precisam de guardrails
5. **Observabilidade** - Dificil debugar o que deu errado

## Boas Praticas

- Comece simples, adicione complexidade aos poucos
- Limite o numero de ferramentas disponiveis
- Implemente timeouts e limites de iteracao
- Adicione confirmacao humana para acoes criticas
- Logue todas as decisoes e acoes para debug

---

## Recursos

- [Building an AI Agent Tutorial - LangChain](https://python.langchain.com/docs/tutorials/agents/)
- [AI agents and their types - Play.ht](https://play.ht/blog/ai-agents-use-cases/)
- [The Complete Guide to Building AI Agents for Beginners - Video](https://youtu.be/MOyl58VF2ak?si=-QjRD_5y3iViprJX)

---

## Checklist

- [ ] Entender a diferenca entre LLM e AI Agent
- [ ] Conhecer os componentes: LLM, Tools, Memoria, Planejamento
- [ ] Estudar o padrao ReAct (Reason + Act)
- [ ] Explorar ferramentas disponiveis em frameworks como LangChain
- [ ] Identificar casos de uso apropriados para agents

---

## Conexoes

> **Proximo passo:** Aprenda a criar prompts efetivos em [[prompt-engineering-intro]]
