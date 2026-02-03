---
titulo: "Chroma"
tags: ["chroma", "vector-databases", "open-source"]
prerequisitos: ["vector-databases", "embeddings"]
nivel: "intermediario"
tempoEstimado: 40
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Chroma

Chroma e um banco de dados vetorial open-source projetado para ser simples, rapido e "AI-native". Ele foi criado especificamente para aplicacoes que utilizam embeddings, tornando-se uma escolha popular para desenvolvimento de sistemas RAG, busca semantica e outras aplicacoes de IA.

## Por que Chroma?

O Chroma se destaca por sua simplicidade e foco na experiencia do desenvolvedor:

1. **Zero configuracao**: Funciona imediatamente sem setup complexo
2. **Persistencia flexivel**: Pode rodar em memoria ou persistir dados
3. **API intuitiva**: Interface Python/JavaScript simples e direta
4. **Embeddings integrados**: Gera embeddings automaticamente se necessario

## Instalacao e Setup

### Instalacao basica

```bash
pip install chromadb
```

### Primeiro uso

```python
import chromadb

# Criar cliente (em memoria por padrao)
client = chromadb.Client()

# Criar colecao
collection = client.create_collection(name="meus_documentos")
```

### Persistencia de dados

```python
import chromadb

# Cliente com persistencia em disco
client = chromadb.PersistentClient(path="/caminho/para/dados")

# A colecao sera salva automaticamente
collection = client.get_or_create_collection(name="documentos_persistentes")
```

## Operacoes Basicas

### Adicionar documentos

O Chroma pode gerar embeddings automaticamente:

```python
# Adicionar documentos (Chroma gera embeddings)
collection.add(
    documents=[
        "Python e uma linguagem de programacao",
        "Machine learning usa algoritmos para aprender",
        "Deep learning utiliza redes neurais profundas"
    ],
    ids=["doc1", "doc2", "doc3"],
    metadatas=[
        {"categoria": "programacao"},
        {"categoria": "ml"},
        {"categoria": "dl"}
    ]
)
```

### Adicionar embeddings proprios

```python
# Com embeddings pre-calculados
collection.add(
    embeddings=[
        [0.1, 0.2, 0.3, ...],  # seu vetor
        [0.4, 0.5, 0.6, ...],
    ],
    documents=["texto 1", "texto 2"],
    ids=["id1", "id2"]
)
```

### Buscar por similaridade

```python
# Busca semantica
results = collection.query(
    query_texts=["como funciona aprendizado de maquina?"],
    n_results=3
)

print(results['documents'])
print(results['distances'])
print(results['metadatas'])
```

### Busca com filtros

```python
# Combinar busca vetorial com filtros de metadados
results = collection.query(
    query_texts=["algoritmos de aprendizado"],
    n_results=5,
    where={"categoria": "ml"}  # filtro de metadados
)
```

## Funcoes de Embedding

O Chroma suporta diferentes funcoes de embedding:

### Embedding padrao (all-MiniLM-L6-v2)

```python
# Usa Sentence Transformers por padrao
collection = client.create_collection(name="default_embedding")
```

### OpenAI Embeddings

```python
from chromadb.utils import embedding_functions

openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="sua-api-key",
    model_name="text-embedding-ada-002"
)

collection = client.create_collection(
    name="openai_collection",
    embedding_function=openai_ef
)
```

### Hugging Face

```python
huggingface_ef = embedding_functions.HuggingFaceEmbeddingFunction(
    api_key="sua-api-key",
    model_name="sentence-transformers/all-mpnet-base-v2"
)
```

## Exemplo Completo: Sistema RAG Simples

```python
import chromadb
from openai import OpenAI

# Setup Chroma
chroma_client = chromadb.PersistentClient(path="./chroma_data")
collection = chroma_client.get_or_create_collection(name="knowledge_base")

# Adicionar documentos a base de conhecimento
documentos = [
    "O Chroma e um banco de dados vetorial open-source.",
    "RAG significa Retrieval-Augmented Generation.",
    "Embeddings sao representacoes numericas de texto.",
    "Vector databases armazenam e buscam vetores eficientemente."
]

collection.add(
    documents=documentos,
    ids=[f"doc_{i}" for i in range(len(documentos))]
)

# Funcao de busca + geracao
def rag_query(pergunta: str, n_results: int = 2):
    # Buscar documentos relevantes
    results = collection.query(
        query_texts=[pergunta],
        n_results=n_results
    )

    # Montar contexto
    contexto = "\n".join(results['documents'][0])

    # Gerar resposta com LLM
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"Use o contexto para responder: {contexto}"
            },
            {"role": "user", "content": pergunta}
        ]
    )

    return response.choices[0].message.content

# Usar
resposta = rag_query("O que e o Chroma?")
print(resposta)
```

## Chroma em Producao

### Docker

```yaml
# docker-compose.yml
version: '3.9'
services:
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - ./chroma_data:/chroma/chroma
```

### Cliente HTTP

```python
import chromadb

# Conectar ao servidor Chroma
client = chromadb.HttpClient(host="localhost", port=8000)
collection = client.get_or_create_collection("producao")
```

## Melhores Praticas

1. **Use persistencia**: Para dados importantes, sempre use `PersistentClient`
2. **Escolha embeddings apropriados**: O modelo de embedding afeta a qualidade da busca
3. **Aproveite metadados**: Filtros de metadados melhoram precisao das buscas
4. **Batch operations**: Para grandes volumes, adicione documentos em lotes
5. **Monitore tamanho**: Chroma funciona bem para milhoes de documentos, mas planeje escala

---

## Resources

- [Chroma - Site Oficial](https://www.trychroma.com/)
- [Chroma Tutorials - LabLab](https://lablab.ai/tech/chroma)
- [Video: Chroma - Vector Database for LLM Applications](https://youtu.be/Qs_y0lTJAp0)
- [Chroma Documentation](https://docs.trychroma.com/)

---

## Checklist

- [ ] Instalar e configurar o Chroma localmente
- [ ] Criar colecoes e adicionar documentos com metadados
- [ ] Realizar buscas por similaridade com filtros
- [ ] Configurar diferentes funcoes de embedding
- [ ] Implementar um sistema RAG simples usando Chroma
