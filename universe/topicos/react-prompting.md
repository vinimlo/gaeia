---
titulo: "ReAct Prompting"
tags: ["react", "prompting", "agentes"]
prerequisitos: ["prompt-engineering", "ai-agents"]
nivel: "avancado"
tempoEstimado: 40
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# ReAct Prompting

ReAct (Reasoning + Acting) e uma tecnica de prompting que combina raciocinio e acao, guiando modelos de linguagem a pensar passo-a-passo e entao tomar acoes especificas baseadas nesse raciocinio. Esta abordagem e fundamental para a construcao de AI Agents eficazes.

## O Que e ReAct?

ReAct e um paradigma que intercala:
- **Reasoning (Raciocinio)**: O modelo pensa sobre o problema, analisa informacoes
- **Acting (Acao)**: O modelo executa acoes concretas (buscar dados, chamar APIs)

Este ciclo se repete ate que o objetivo seja alcancado.

## Por Que ReAct e Importante?

### Problemas com Abordagens Tradicionais

**Apenas Raciocinio (Chain-of-Thought)**:
- Modelo raciocina mas nao pode verificar fatos
- Pode "alucinar" informacoes

**Apenas Acao**:
- Executa acoes sem planejamento
- Dificuldade em tarefas que requerem multiplos passos

### ReAct Resolve Ambos
- Raciocinio informa quais acoes tomar
- Acoes fornecem informacoes reais para o raciocinio
- Ciclo iterativo permite correcao de curso

## Estrutura do ReAct

```
Thought: [Raciocinio sobre o que fazer]
Action: [Nome da acao a executar]
Action Input: [Parametros da acao]
Observation: [Resultado da acao]
... (repete ate conclusao)
Thought: [Raciocinio final]
Final Answer: [Resposta ao usuario]
```

## Exemplo Pratico

**Pergunta**: "Qual e a populacao da capital do pais que ganhou a Copa do Mundo de 2022?"

```
Thought: Preciso descobrir qual pais ganhou a Copa do Mundo de 2022.
Action: Search
Action Input: "Copa do Mundo 2022 vencedor"
Observation: A Argentina venceu a Copa do Mundo de 2022.

Thought: Agora preciso saber qual e a capital da Argentina.
Action: Search
Action Input: "capital da Argentina"
Observation: Buenos Aires e a capital da Argentina.

Thought: Agora preciso buscar a populacao de Buenos Aires.
Action: Search
Action Input: "populacao Buenos Aires"
Observation: Buenos Aires tem aproximadamente 3 milhoes de habitantes na cidade e 15 milhoes na area metropolitana.

Thought: Tenho todas as informacoes necessarias.
Final Answer: A populacao de Buenos Aires, capital da Argentina (vencedora da Copa 2022), e de aproximadamente 3 milhoes na cidade e 15 milhoes na area metropolitana.
```

## Implementacao com LangChain

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

# Definir ferramentas
tools = [
    Tool(
        name="Search",
        func=search_function,
        description="Busca informacoes na internet"
    ),
    Tool(
        name="Calculator",
        func=calculator_function,
        description="Realiza calculos matematicos"
    )
]

# Prompt ReAct
react_prompt = """
Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
"""

# Criar agente
agent = create_react_agent(llm, tools, react_prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
```

## Variacoes do ReAct

### ReAct com Reflexao
Adiciona um passo de auto-avaliacao:
```
Thought: Minha resposta anterior pode estar incompleta...
Reflection: Devo verificar se considerei todos os aspectos...
```

### ReAct com Planejamento
Adiciona fase inicial de planejamento:
```
Plan: 1. Buscar X, 2. Calcular Y, 3. Comparar Z
Thought: Executando passo 1 do plano...
```

## Melhores Praticas

### 1. Descricoes Claras de Tools
```python
# Ruim
Tool(name="Search", description="Busca coisas")

# Bom
Tool(name="Search", description="Busca informacoes atualizadas na web. Use para fatos, noticias, dados que podem mudar.")
```

### 2. Limitar Iteracoes
```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=10,  # Evita loops infinitos
    early_stopping_method="generate"
)
```

### 3. Logging para Debug
```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    return_intermediate_steps=True  # Retorna todo o raciocinio
)
```

## Quando Usar ReAct

**Ideal para**:
- Perguntas que requerem busca de informacoes
- Tarefas multi-passo com dependencias
- Problemas que precisam de verificacao de fatos

**Evitar quando**:
- Tarefas simples de uma unica etapa
- Quando latencia e critica (ReAct e mais lento)
- Dominio completamente conhecido (sem necessidade de busca)

---

## Resources

- [ReAct Prompting - Prompting Guide](https://www.promptingguide.ai/techniques/react)
- [ReAct Prompting: How We Prompt for High-Quality Results from LLMs](https://www.width.ai/post/react-prompting)

---

## Checklist

- [ ] Entender a diferenca entre Chain-of-Thought e ReAct
- [ ] Implementar um prompt ReAct basico com ferramentas
- [ ] Criar um agente ReAct usando LangChain
- [ ] Experimentar com diferentes descricoes de ferramentas
- [ ] Implementar limites de seguranca (max_iterations, timeouts)
