---
titulo: "LangChain Framework"
tags: ["langchain", "framework", "rag"]
prerequisitos: ["what-is-rag", "embeddings"]
nivel: "intermediario"
tempoEstimado: 60
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# LangChain Framework

LangChain e um framework de desenvolvimento que simplifica a criacao de aplicacoes baseadas em Large Language Models (LLMs). Ele fornece abstraccoes e ferramentas para integrar modelos de linguagem com diversas fontes de dados, APIs e outros sistemas, permitindo construir aplicacoes complexas de forma modular e escalavel.

## Por que Usar LangChain?

### Desafios que LangChain Resolve

1. **Complexidade de Integracao**: Padroniza a integracao com diferentes LLMs
2. **Gerenciamento de Prompts**: Templates reutilizaveis e versionados
3. **Orquestracao**: Encadeamento de operacoes complexas
4. **Memoria**: Persistencia de contexto em conversas
5. **Retrieval**: Integracao com vector stores e RAG

### Ecossistema LangChain

```
LangChain Core
     |
     +-- LangChain (Python/JS)
     |
     +-- LangSmith (Observabilidade)
     |
     +-- LangServe (Deploy)
     |
     +-- LangGraph (Agentes)
```

## Componentes Principais

### 1. Models (Modelos)

Abstraccoes para diferentes tipos de modelos:

```python
# LLMs (texto -> texto)
from langchain_openai import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-instruct")
response = llm.invoke("Explique o que e machine learning")

# Chat Models (mensagens -> mensagens)
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

chat = ChatOpenAI(model="gpt-4")
messages = [
    SystemMessage(content="Voce e um assistente tecnico."),
    HumanMessage(content="O que e RAG?")
]
response = chat.invoke(messages)

# Embeddings
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector = embeddings.embed_query("texto para embedding")
```

### 2. Prompts

Templates para construir prompts dinamicos:

```python
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate

# Template simples
template = PromptTemplate.from_template(
    "Traduza o seguinte texto para {idioma}: {texto}"
)
prompt = template.format(idioma="ingles", texto="Ola mundo")

# Template de chat
chat_template = ChatPromptTemplate.from_messages([
    ("system", "Voce e um assistente que responde em {estilo}."),
    ("human", "{pergunta}")
])
messages = chat_template.format_messages(
    estilo="formato tecnico",
    pergunta="Como funciona TCP/IP?"
)
```

### 3. Chains

Sequencias de operacoes encadeadas:

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

# LCEL (LangChain Expression Language)
prompt = ChatPromptTemplate.from_template("Conte uma piada sobre {topico}")
model = ChatOpenAI()
parser = StrOutputParser()

# Chain usando pipe operator
chain = prompt | model | parser

# Executar
response = chain.invoke({"topico": "programacao"})
```

### 4. Retrievers e Vector Stores

Integracao com bancos de dados vetoriais:

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. Carregar documentos
loader = TextLoader("documento.txt")
documents = loader.load()

# 2. Dividir em chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(documents)

# 3. Criar vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# 4. Criar retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

# 5. Buscar documentos
docs = retriever.invoke("minha pergunta")
```

### 5. Memory

Persistencia de contexto em conversas:

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_openai import ChatOpenAI

# Memoria em buffer
memory = ConversationBufferMemory()

chain = ConversationChain(
    llm=ChatOpenAI(),
    memory=memory
)

# Multiplas interacoes mantendo contexto
response1 = chain.invoke({"input": "Meu nome e Carlos"})
response2 = chain.invoke({"input": "Qual e meu nome?"})
# Resposta: "Seu nome e Carlos"
```

## Construindo um RAG com LangChain

Exemplo completo de sistema RAG:

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. Carregar e processar documentos
loader = PyPDFLoader("manual_empresa.pdf")
pages = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = splitter.split_documents(pages)

# 2. Criar vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 3. Definir prompt
template = """Responda a pergunta baseado no contexto abaixo.
Se nao souber a resposta, diga que nao sabe.

Contexto:
{context}

Pergunta: {question}

Resposta:"""

prompt = ChatPromptTemplate.from_template(template)

# 4. Criar chain RAG
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

model = ChatOpenAI(model="gpt-4")

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# 5. Usar
response = rag_chain.invoke("Qual e a politica de ferias?")
```

## LangSmith para Observabilidade

```python
import os

# Configurar LangSmith
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "sua-api-key"
os.environ["LANGCHAIN_PROJECT"] = "meu-projeto"

# Agora todas as chains sao automaticamente rastreadas
chain.invoke({"input": "teste"})
# Visualize traces em: https://smith.langchain.com
```

## Boas Praticas

1. **Use LCEL**: LangChain Expression Language e mais moderno e eficiente
2. **Streaming**: Implemente streaming para melhor UX
3. **Observabilidade**: Use LangSmith para debug e monitoramento
4. **Modularidade**: Crie chains reutilizaveis
5. **Tratamento de Erros**: Implemente fallbacks e retries

```python
# Exemplo com streaming
for chunk in rag_chain.stream("minha pergunta"):
    print(chunk, end="", flush=True)
```

---

## Resources

- [LangChain Official Website](https://www.langchain.com/)
- [LangChain Documentation](https://python.langchain.com/docs/)
- [What is LangChain? (Video)](https://www.youtube.com/watch?v=1bUy-1hGZpI)
- [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/)
- [LangSmith](https://smith.langchain.com/)

---

## Checklist

- [ ] Entender os componentes principais: Models, Prompts, Chains, Retrievers
- [ ] Conhecer LCEL (LangChain Expression Language) e o operador pipe
- [ ] Implementar integracao com vector stores (Chroma, Pinecone, etc.)
- [ ] Construir um pipeline RAG completo usando LangChain
- [ ] Configurar LangSmith para observabilidade e debugging
