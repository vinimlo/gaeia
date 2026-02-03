---
titulo: "Processo de Retrieval em RAG"
tags: ["retrieval", "rag", "busca"]
prerequisitos: ["what-is-rag", "embeddings", "vector-databases"]
nivel: "intermediario"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Processo de Retrieval em RAG

O processo de retrieval (recuperacao) e o coracao de qualquer sistema RAG. E responsavel por encontrar as informacoes mais relevantes em uma base de conhecimento para responder a pergunta do usuario. A qualidade do retrieval determina diretamente a qualidade das respostas geradas.

## Visao Geral do Processo

```
Query do Usuario
       |
       v
[1. Query Embedding]
       |
       v
[2. Similarity Search]
       |
       v
[3. Ranking/Reranking]
       |
       v
[4. Filtering/Post-processing]
       |
       v
Documentos Relevantes
```

## Etapas do Retrieval

### 1. Query Embedding

A query do usuario e convertida em um vetor usando o mesmo modelo de embeddings usado para indexar os documentos.

```python
from openai import OpenAI

client = OpenAI()

def get_query_embedding(query):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding

query = "Como funciona o processo de ferias?"
query_vector = get_query_embedding(query)
```

**Importante**: O modelo de embedding da query deve ser o mesmo usado para os documentos!

### 2. Similarity Search (Busca por Similaridade)

O vetor da query e comparado com os vetores armazenados no banco de dados vetorial.

#### Metricas de Similaridade

| Metrica | Formula | Uso |
|---------|---------|-----|
| **Cosine Similarity** | cos(A, B) = (A . B) / (\|A\| \|B\|) | Mais comum, normalizado |
| **Euclidean Distance** | d(A, B) = sqrt(sum((ai - bi)^2)) | Distancia geometrica |
| **Dot Product** | A . B = sum(ai * bi) | Rapido, para vetores normalizados |

```python
# Exemplo com Pinecone
import pinecone

index = pinecone.Index("meu-indice")

results = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True
)

# Exemplo com ChromaDB
import chromadb

client = chromadb.Client()
collection = client.get_collection("documentos")

results = collection.query(
    query_embeddings=[query_vector],
    n_results=5
)
```

### 3. Algoritmos de Busca

#### Busca Exata (Brute Force)

Compara com todos os vetores. Preciso, mas lento para grandes bases.

```python
import numpy as np

def exact_search(query_vector, all_vectors, k=5):
    similarities = np.dot(all_vectors, query_vector)
    top_k_indices = np.argsort(similarities)[-k:][::-1]
    return top_k_indices
```

#### Approximate Nearest Neighbor (ANN)

Algoritmos que sacrificam precisao por velocidade:

- **HNSW (Hierarchical Navigable Small World)**: Grafos hierarquicos
- **IVF (Inverted File Index)**: Clusterizacao de vetores
- **LSH (Locality Sensitive Hashing)**: Hashing para similaridade

```python
# FAISS com IVF
import faiss

# Criar indice IVF
nlist = 100  # numero de clusters
quantizer = faiss.IndexFlatL2(dimension)
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)

# Treinar e adicionar vetores
index.train(vectors)
index.add(vectors)

# Buscar
index.nprobe = 10  # clusters a verificar
distances, indices = index.search(query_vector, k=5)
```

### 4. Reranking

Apos a busca inicial, um segundo modelo pode reordenar os resultados para maior precisao.

```python
from sentence_transformers import CrossEncoder

# Cross-encoder para reranking
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Documentos recuperados inicialmente
candidates = ["doc1 text", "doc2 text", "doc3 text"]

# Reranking
pairs = [[query, doc] for doc in candidates]
scores = reranker.predict(pairs)

# Ordenar por score
ranked_docs = [doc for _, doc in sorted(zip(scores, candidates), reverse=True)]
```

### 5. Hybrid Search (Busca Hibrida)

Combina busca semantica (vetores) com busca lexica (keywords).

```python
# Exemplo conceitual de hybrid search
def hybrid_search(query, alpha=0.5):
    # Busca semantica
    semantic_results = vector_search(query)

    # Busca lexica (BM25)
    lexical_results = bm25_search(query)

    # Combinar scores
    combined = {}
    for doc_id, score in semantic_results:
        combined[doc_id] = alpha * score

    for doc_id, score in lexical_results:
        combined[doc_id] = combined.get(doc_id, 0) + (1 - alpha) * score

    # Retornar top resultados
    return sorted(combined.items(), key=lambda x: x[1], reverse=True)
```

## Estrategias Avancadas

### Multi-Query Retrieval

Gera multiplas versoes da query para capturar diferentes aspectos.

```python
from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# Gera queries alternativas e busca com todas
docs = retriever.get_relevant_documents(query)
```

### Self-Query Retrieval

Extrai filtros da query do usuario automaticamente.

```python
from langchain.retrievers.self_query.base import SelfQueryRetriever

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_content_description="Documentos sobre politicas da empresa",
    metadata_field_info=metadata_fields
)

# Query: "politicas de ferias para funcionarios senior"
# Extrai automaticamente: filtro por cargo = senior
```

### Contextual Compression

Comprime documentos para manter apenas partes relevantes.

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever()
)
```

## Metricas de Avaliacao

| Metrica | Descricao |
|---------|-----------|
| **Recall@K** | Proporcao de docs relevantes no top K |
| **Precision@K** | Proporcao de top K que sao relevantes |
| **MRR** | Mean Reciprocal Rank - posicao media do primeiro relevante |
| **nDCG** | Normalized Discounted Cumulative Gain |

```python
def recall_at_k(retrieved_ids, relevant_ids, k):
    retrieved_set = set(retrieved_ids[:k])
    relevant_set = set(relevant_ids)
    return len(retrieved_set & relevant_set) / len(relevant_set)
```

---

## Resources

- [What is Retrieval-Augmented Generation (RAG)? - Google Cloud](https://cloud.google.com/use-cases/retrieval-augmented-generation)
- [What Is Retrieval-Augmented Generation, aka RAG? - NVIDIA](https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/)
- [Retrieval Strategies - LangChain](https://python.langchain.com/docs/modules/data_connection/retrievers/)
- [FAISS Documentation](https://faiss.ai/index.html)

---

## Checklist

- [ ] Entender o fluxo completo do processo de retrieval
- [ ] Conhecer as metricas de similaridade: cosine, euclidean, dot product
- [ ] Compreender a diferenca entre busca exata e ANN (approximate)
- [ ] Saber quando usar reranking para melhorar resultados
- [ ] Implementar busca hibrida combinando semantica e lexica
