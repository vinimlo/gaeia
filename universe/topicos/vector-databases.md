---
titulo: "Vector Databases"
tags: ["vector-databases", "armazenamento", "embeddings"]
prerequisitos: ["embeddings"]
nivel: "intermediario"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Vector Databases

Vector databases sao sistemas especializados em armazenar, indexar e recuperar vetores de alta dimensionalidade, frequentemente usados como embeddings para dados como texto, imagens ou audio. Diferente de bancos de dados tradicionais que trabalham com dados estruturados, vector databases se destacam no gerenciamento de dados nao-estruturados ao permitir buscas por similaridade rapidas e eficientes.

## Por que Vector Databases?

Em aplicacoes de IA modernas, especialmente aquelas que utilizam Large Language Models (LLMs), precisamos de uma forma eficiente de:

1. **Armazenar embeddings**: Vetores de centenas ou milhares de dimensoes
2. **Buscar por similaridade**: Encontrar os vetores mais proximos a uma query
3. **Escalar para milhoes de registros**: Manter performance mesmo com grandes volumes

Bancos de dados relacionais tradicionais nao foram projetados para esse tipo de operacao.

## Como Funcionam

### Indexacao de Vetores

Vector databases utilizam estruturas de dados especializadas para indexar vetores:

- **Flat Index**: Busca exaustiva (preciso, mas lento para grandes datasets)
- **IVF (Inverted File Index)**: Agrupa vetores em clusters para busca mais rapida
- **HNSW (Hierarchical Navigable Small World)**: Grafos navegaveis para busca aproximada
- **PQ (Product Quantization)**: Compressao de vetores para economia de memoria

### Busca por Similaridade

A busca aproximada de vizinhos mais proximos (ANN - Approximate Nearest Neighbor) permite encontrar vetores similares de forma eficiente:

```python
# Exemplo conceitual de busca
query_vector = embed("Como funciona machine learning?")
results = vector_db.search(
    vector=query_vector,
    top_k=5,  # retorna os 5 mais similares
    metric="cosine"  # metrica de similaridade
)
```

### Metricas de Similaridade

As metricas mais comuns incluem:

- **Cosine Similarity**: Mede o angulo entre vetores (comum para texto)
- **Euclidean Distance**: Distancia geometrica entre pontos
- **Dot Product**: Produto escalar dos vetores

## Casos de Uso

### Semantic Search

Busca por significado, nao apenas palavras-chave:

```python
# Busca tradicional: "cachorro" != "cao"
# Busca semantica: "cachorro" ≈ "cao" (vetores proximos)
```

### Retrieval-Augmented Generation (RAG)

Vector databases sao fundamentais em sistemas RAG:

1. Documentos sao convertidos em embeddings e armazenados
2. Query do usuario e convertida em embedding
3. Documentos mais relevantes sao recuperados
4. LLM gera resposta baseada nos documentos

### Sistemas de Recomendacao

Encontrar itens similares baseado em representacoes vetoriais de usuarios e produtos.

### Deteccao de Duplicatas

Identificar conteudo similar ou duplicado em grandes colecoes.

## Principais Solucoes

| Database | Tipo | Destaque |
|----------|------|----------|
| **Pinecone** | Cloud | Totalmente gerenciado, facil de usar |
| **Chroma** | Open-source | Leve, otimo para desenvolvimento |
| **FAISS** | Biblioteca | Alta performance, Meta/Facebook |
| **Weaviate** | Open-source | GraphQL, modulos de ML integrados |
| **Qdrant** | Open-source | Rust, filtros avancados |
| **Milvus** | Open-source | Escalabilidade empresarial |

## Arquitetura Tipica

```
Aplicacao
    |
    v
[Embedding Model] --> [Vector Database]
    |                       |
    v                       v
Query Vector  <----  Similaridade Search
    |
    v
Top K Resultados --> [LLM / Aplicacao]
```

## Consideracoes de Design

### Escolha do Indice

- **Precisao vs Velocidade**: Indices aproximados sao mais rapidos, mas menos precisos
- **Memoria vs Disco**: Trade-off entre performance e custo
- **Dimensionalidade**: Mais dimensoes = mais memoria e processamento

### Metadados e Filtragem

A maioria dos vector databases permite armazenar metadados junto com vetores:

```python
vector_db.upsert([
    {
        "id": "doc_1",
        "vector": [0.1, 0.2, ...],
        "metadata": {
            "source": "manual.pdf",
            "category": "tutorial",
            "date": "2024-01-15"
        }
    }
])

# Busca com filtro
results = vector_db.search(
    vector=query_vec,
    filter={"category": "tutorial"},
    top_k=5
)
```

---

## Resources

- [Vector Databases - Cloudflare](https://developers.cloudflare.com/vectorize/reference/what-is-a-vector-database/)
- [What are Vector Databases? - MongoDB](https://www.mongodb.com/resources/basics/databases/vector-databases)
- [Vector Database Comparison](https://vdbs.superlinked.com/)

---

## Checklist

- [ ] Compreender a diferenca entre bancos tradicionais e vector databases
- [ ] Entender como funcionam as buscas por similaridade (ANN)
- [ ] Conhecer as principais metricas de similaridade (cosine, euclidean)
- [ ] Saber quando usar vector databases em projetos de IA
- [ ] Comparar as principais solucoes disponiveis no mercado
