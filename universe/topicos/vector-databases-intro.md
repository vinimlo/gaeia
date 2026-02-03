---
titulo: "Introducao a Vector Databases"
tags: ["vector-databases", "terminologia"]
prerequisitos: ["embeddings-intro"]
nivel: "iniciante"
tempoEstimado: 35
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Introducao a Vector Databases

Vector databases sao sistemas especializados em armazenar, indexar e recuperar vetores de alta dimensao (embeddings). Eles sao essenciais para aplicacoes de IA modernas que precisam de busca semantica.

## Por que Vector Databases?

Bancos de dados tradicionais (SQL, NoSQL) sao otimizados para:
- Busca exata (`WHERE nome = 'João'`)
- Ranges (`WHERE preco < 100`)

Mas nao conseguem fazer eficientemente:
- "Encontre documentos **similares** a este"
- "Quais produtos sao **parecidos** com este?"

Vector databases resolvem isso com **busca por similaridade**.

## Como funcionam?

1. **Armazenamento** - Guardam vetores (embeddings) com metadados
2. **Indexacao** - Criam estruturas para busca rapida (HNSW, IVF, etc.)
3. **Busca ANN** - Approximate Nearest Neighbor - encontra vetores mais proximos
4. **Filtragem** - Combinam busca vetorial com filtros de metadados

## Principais Vector Databases

| Database | Tipo | Caracteristicas |
|----------|------|-----------------|
| **Pinecone** | Managed | Facil de usar, escalavel, serverless |
| **Weaviate** | Open-source | GraphQL, modulos de ML integrados |
| **Chroma** | Open-source | Simples, otimo para desenvolvimento |
| **Qdrant** | Open-source | Alto desempenho, Rust |
| **Milvus** | Open-source | Escalavel, GPU support |
| **pgvector** | Extension | PostgreSQL com vetores |
| **LanceDB** | Open-source | Embedded, serverless |

## Conceitos Importantes

### Indice HNSW
Hierarchical Navigable Small World - estrutura de grafo que permite buscas muito rapidas sacrificando um pouco de precisao.

### Approximate vs Exact
- **Exact** - Encontra os K vizinhos mais proximos (lento)
- **Approximate (ANN)** - Encontra vizinhos "bons o suficiente" (rapido)

### Metadados
Informacoes adicionais associadas a cada vetor:
```json
{
  "vector": [0.1, 0.2, ...],
  "metadata": {
    "source": "documento.pdf",
    "page": 5,
    "category": "financeiro"
  }
}
```

## Exemplo com Chroma

```python
import chromadb
from chromadb.utils import embedding_functions

# Criar cliente
client = chromadb.Client()

# Criar colecao
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="sua-key",
    model_name="text-embedding-3-small"
)

collection = client.create_collection(
    name="documentos",
    embedding_function=openai_ef
)

# Adicionar documentos
collection.add(
    documents=["Python e uma linguagem de programacao",
               "JavaScript roda no navegador"],
    ids=["doc1", "doc2"]
)

# Buscar similares
results = collection.query(
    query_texts=["linguagens para web"],
    n_results=2
)
```

## Quando usar cada um?

- **Prototipo rapido** - Chroma, LanceDB
- **Producao serverless** - Pinecone
- **Self-hosted robusto** - Qdrant, Weaviate
- **Ja usa PostgreSQL** - pgvector

---

## Recursos

- [Vector Databases - Cloudflare](https://developers.cloudflare.com/vectorize/reference/what-is-a-vector-database/)
- [What are Vector Databases? - MongoDB](https://www.mongodb.com/resources/basics/databases/vector-databases)

---

## Checklist

- [ ] Entender a diferenca entre busca exata e busca por similaridade
- [ ] Conhecer os principais vector databases
- [ ] Entender o conceito de indice ANN
- [ ] Experimentar com Chroma localmente
- [ ] Fazer uma busca semantica basica

---

## Conexoes

> **Proximo passo:** Aprenda a usar embeddings e vector databases juntos em [[rag-intro]]
