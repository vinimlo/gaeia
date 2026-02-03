---
titulo: "Busca Semantica"
tags: ["semantic-search", "embeddings", "busca"]
prerequisitos: ["what-are-embeddings", "openai-embeddings-api"]
nivel: "intermediario"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Busca Semantica

Busca Semantica utiliza embeddings para converter texto (queries e documentos) em vetores de alta dimensao que capturam o significado e contexto subjacente, em vez de apenas palavras exatas. Isso permite que o sistema entenda a intencao da query e recupere informacoes relevantes mesmo quando os termos exatos nao correspondem.

## Busca Semantica vs Busca por Palavras-chave

### Busca Tradicional (Keyword-based)
```
Query: "como treinar cachorro"
Resultados: Documentos que contem "treinar" E "cachorro"

Problema: Nao encontra "adestramento de caes" (mesmo significado, palavras diferentes)
```

### Busca Semantica
```
Query: "como treinar cachorro"
Resultados:
- "Tecnicas de adestramento de caes" ✓
- "Guia para ensinar truques ao seu pet" ✓
- "Como educar filhotes" ✓

Entende o SIGNIFICADO, nao apenas as palavras!
```

## Como Funciona

### 1. Indexacao
Converta todos os documentos em embeddings e armazene em um vector database.

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

# Documentos para indexar
documents = [
    {"id": 1, "text": "Python e uma linguagem de programacao versatil"},
    {"id": 2, "text": "Machine learning usa algoritmos para aprender com dados"},
    {"id": 3, "text": "Redes neurais sao inspiradas no cerebro humano"},
    {"id": 4, "text": "GPT e um modelo de linguagem generativo"},
]

# Gera embeddings para todos os documentos
def index_documents(docs):
    indexed = []
    for doc in docs:
        response = client.embeddings.create(
            input=doc["text"],
            model="text-embedding-3-small"
        )
        indexed.append({
            "id": doc["id"],
            "text": doc["text"],
            "embedding": response.data[0].embedding
        })
    return indexed

indexed_docs = index_documents(documents)
```

### 2. Busca
Converta a query em embedding e encontre os documentos mais similares.

```python
def semantic_search(query: str, indexed_docs: list, top_k: int = 3):
    """Realiza busca semantica"""
    # Gera embedding da query
    response = client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    )
    query_embedding = np.array(response.data[0].embedding)

    # Calcula similaridade com cada documento
    results = []
    for doc in indexed_docs:
        doc_embedding = np.array(doc["embedding"])
        similarity = np.dot(query_embedding, doc_embedding) / (
            np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
        )
        results.append({
            "id": doc["id"],
            "text": doc["text"],
            "score": similarity
        })

    # Ordena por similaridade
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]

# Exemplo de busca
query = "como funcionam modelos de IA que geram texto?"
results = semantic_search(query, indexed_docs)

for r in results:
    print(f"[{r['score']:.3f}] {r['text']}")
```

## Arquitetura Completa

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Documentos │ --> │  Embeddings  │ --> │ Vector Database │
└─────────────┘     │    Model     │     └─────────────────┘
                    └──────────────┘              │
                                                  │
┌─────────────┐     ┌──────────────┐              │
│    Query    │ --> │  Embeddings  │ --> Busca Similaridade
└─────────────┘     │    Model     │              │
                    └──────────────┘              │
                                                  ▼
                                         ┌───────────────┐
                                         │  Top K Docs   │
                                         └───────────────┘
```

## Implementacao com Vector Database

Para producao, use um vector database especializado.

### Com Pinecone

```python
from pinecone import Pinecone
from openai import OpenAI

# Inicializa
pc = Pinecone(api_key="sua-pinecone-key")
index = pc.Index("semantic-search")
openai_client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

# Indexar
def index_document(doc_id: str, text: str, metadata: dict = None):
    embedding = get_embedding(text)
    index.upsert(vectors=[{
        "id": doc_id,
        "values": embedding,
        "metadata": {"text": text, **(metadata or {})}
    }])

# Buscar
def search(query: str, top_k: int = 5):
    query_embedding = get_embedding(query)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return results.matches
```

### Com ChromaDB (Local)

```python
import chromadb
from openai import OpenAI

# Inicializa
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("semantic-search")
openai_client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

# Indexar
def index_documents(docs: list[dict]):
    embeddings = [get_embedding(doc["text"]) for doc in docs]
    collection.add(
        embeddings=embeddings,
        documents=[doc["text"] for doc in docs],
        ids=[doc["id"] for doc in docs]
    )

# Buscar
def search(query: str, top_k: int = 5):
    query_embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results
```

## Otimizacoes

### 1. Chunking de Documentos
Divida documentos longos em pedacos menores.

```python
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Divide texto em chunks com overlap"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks
```

### 2. Hybrid Search
Combine busca semantica com busca por palavras-chave.

```python
def hybrid_search(query: str, docs: list, alpha: float = 0.7):
    """Combina busca semantica (alpha) com keyword (1-alpha)"""
    semantic_scores = semantic_search(query, docs)
    keyword_scores = keyword_search(query, docs)

    combined = {}
    for doc_id in set(semantic_scores) | set(keyword_scores):
        sem_score = semantic_scores.get(doc_id, 0)
        key_score = keyword_scores.get(doc_id, 0)
        combined[doc_id] = alpha * sem_score + (1 - alpha) * key_score

    return sorted(combined.items(), key=lambda x: x[1], reverse=True)
```

### 3. Re-ranking
Use um modelo mais preciso para reordenar os resultados iniciais.

```python
def rerank_results(query: str, results: list[str], top_k: int = 3):
    """Re-rankeia resultados usando modelo de reranking"""
    # Cohere, cross-encoder, ou outro modelo de reranking
    # Mais lento, mas mais preciso
    pass
```

## Metricas de Avaliacao

- **Precision@K**: Proporcao de resultados relevantes nos top K
- **Recall@K**: Proporcao de documentos relevantes encontrados
- **MRR (Mean Reciprocal Rank)**: Posicao media do primeiro resultado relevante
- **NDCG**: Normalized Discounted Cumulative Gain

---

## Recursos

- [What is Semantic Search? - Elastic](https://www.elastic.co/what-is/semantic-search)
- [What is Semantic Search? - Cohere Video](https://www.youtube.com/watch?v=fFt4kR4ntAA)
- [Pinecone Semantic Search Guide](https://www.pinecone.io/learn/semantic-search/)

---

## Checklist

- [ ] Entender a diferenca entre busca por palavras-chave e busca semantica
- [ ] Implementar indexacao de documentos com embeddings
- [ ] Realizar buscas usando similaridade de cosseno
- [ ] Integrar com um vector database (Pinecone, Chroma, etc.)
- [ ] Aplicar otimizacoes como chunking e hybrid search
