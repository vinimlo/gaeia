---
titulo: "AI Agents"
tags: ["ai-agents", "autonomia", "llms"]
prerequisitos: ["prompt-engineering", "llms"]
nivel: "avancado"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# AI Agents

Na engenharia de IA, **agentes** referem-se a sistemas ou componentes autonomos que podem perceber seu ambiente, tomar decisoes e executar acoes para atingir objetivos especificos. Agentes frequentemente interagem com sistemas externos, usuarios ou outros agentes para realizar tarefas complexas.

## O Que Sao AI Agents?

AI Agents representam uma evolucao significativa na forma como utilizamos modelos de linguagem. Em vez de simplesmente responder a prompts, um agente pode:

- **Perceber o ambiente**: Coletar informacoes de APIs, bancos de dados, arquivos ou interacoes com usuarios
- **Raciocinar**: Analisar a situacao e planejar uma sequencia de acoes
- **Agir**: Executar acoes concretas como chamar APIs, escrever arquivos ou enviar mensagens
- **Aprender**: Adaptar comportamento baseado em feedback e resultados

## Tipos de Agentes

### 1. Agentes Baseados em Regras
O tipo mais simples, onde o comportamento e determinado por condicoes pre-definidas:
```
SE usuario_pergunta_sobre_preco ENTAO consultar_tabela_precos
```

### 2. Agentes Baseados em LLMs
Utilizam modelos de linguagem para interpretar situacoes e decidir acoes:
- Mais flexiveis e adaptaveis
- Podem lidar com situacoes nao previstas
- Requerem prompts bem estruturados

### 3. Agentes Multi-Agente
Sistemas onde multiplos agentes colaboram:
- Cada agente tem especializacao diferente
- Comunicam-se para resolver problemas complexos
- Exemplo: um agente pesquisa, outro analisa, outro escreve

## Arquitetura de um AI Agent

```
┌─────────────────────────────────────────┐
│              AI Agent                    │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Memory  │  │ Planner │  │  Tools  │ │
│  │ (RAG)   │  │  (LLM)  │  │ (APIs)  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       └────────────┼────────────┘       │
│                    │                    │
│              ┌─────┴─────┐              │
│              │ Executor  │              │
│              └───────────┘              │
└─────────────────────────────────────────┘
```

## Componentes Essenciais

### 1. Sistema de Memoria
- **Memoria de curto prazo**: Contexto da conversa atual
- **Memoria de longo prazo**: Conhecimento persistente (frequentemente usando RAG)

### 2. Planejador
- Decomposicao de tarefas complexas
- Selecao de ferramentas apropriadas
- Ordenacao de acoes

### 3. Ferramentas (Tools)
- Funcoes que o agente pode chamar
- APIs externas, calculadoras, buscadores
- Acoes no mundo real (enviar email, criar arquivos)

## Frameworks Populares

### LangChain Agents
```python
from langchain.agents import create_react_agent
from langchain.tools import Tool

tools = [
    Tool(name="Search", func=search_web, description="Busca na web"),
    Tool(name="Calculator", func=calculate, description="Calculos matematicos")
]

agent = create_react_agent(llm, tools, prompt)
```

### OpenAI Function Calling
```python
functions = [
    {
        "name": "get_weather",
        "description": "Obtem previsao do tempo",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            }
        }
    }
]
```

## Desafios e Consideracoes

### Seguranca
- Agentes com acesso a ferramentas podem causar danos
- Sempre validar e limitar acoes possiveis
- Implementar sandboxing quando necessario

### Custos
- Loops de raciocinio consomem muitos tokens
- Balancear autonomia vs. eficiencia

### Confiabilidade
- Agentes podem entrar em loops infinitos
- Implementar timeouts e limites de iteracao
- Logging detalhado para debugging

---

## Resources

- [Building an AI Agent Tutorial - LangChain](https://python.langchain.com/docs/tutorials/agents/)
- [AI agents and their types](https://play.ht/blog/ai-agents-use-cases/)
- [The Complete Guide to Building AI Agents for Beginners](https://youtu.be/MOyl58VF2ak?si=-QjRD_5y3iViprJX)

---

## Checklist

- [ ] Compreender a diferenca entre AI Agents e chatbots tradicionais
- [ ] Estudar os componentes de um agente (memoria, planejador, tools)
- [ ] Implementar um agente simples com LangChain ou OpenAI Functions
- [ ] Explorar padroes como ReAct para raciocinio de agentes
- [ ] Implementar medidas de seguranca e limites em um agente
