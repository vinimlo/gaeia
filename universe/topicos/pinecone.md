---
titulo: "Pinecone"
tags: ["pinecone", "vector-databases", "cloud"]
prerequisitos: ["vector-databases", "embeddings"]
nivel: "intermediario"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Pinecone

Pinecone e um banco de dados vetorial totalmente gerenciado (managed) projetado para busca por similaridade e recuperacao em tempo real de dados de alta dimensionalidade. Como servico cloud, elimina a necessidade de gerenciar infraestrutura, permitindo que desenvolvedores foquem na construcao de aplicacoes de IA.

## Por que Pinecone?

O Pinecone se destaca em cenarios onde voce precisa de:

1. **Simplicidade operacional**: Nao precisa gerenciar servidores ou clusters
2. **Escalabilidade automatica**: Cresce com sua aplicacao
3. **Baixa latencia**: Otimizado para buscas em tempo real
4. **Alta disponibilidade**: Infraestrutura cloud gerenciada

## Conceitos Fundamentais

### Index

Um index no Pinecone e onde seus vetores sao armazenados. Cada index tem:

- **Dimensionalidade fixa**: Definida na criacao (ex: 1536 para OpenAI ada-002)
- **Metrica de similaridade**: cosine, euclidean ou dotproduct
- **Capacidade**: Numero de vetores que pode armazenar

### Namespace

Particoes logicas dentro de um index para organizar dados:

```python
# Vetores em namespaces diferentes sao isolados
index.upsert(vectors=[...], namespace="producao")
index.upsert(vectors=[...], namespace="teste")
```

### Pod vs Serverless

- **Pod-based**: Instancias dedicadas, custo previsivel
- **Serverless**: Paga por uso, escala automatica (recomendado para novos projetos)

## Instalacao e Setup

### Instalacao

```bash
pip install pinecone-client
```

### Configuracao inicial

```python
from pinecone import Pinecone, ServerlessSpec

# Inicializar cliente
pc = Pinecone(api_key="sua-api-key")

# Criar index serverless
pc.create_index(
    name="meu-index",
    dimension=1536,  # dimensao dos seus embeddings
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

# Conectar ao index
index = pc.Index("meu-index")
```

## Operacoes Basicas

### Inserir vetores (Upsert)

```python
# Upsert = insert or update
index.upsert(
    vectors=[
        {
            "id": "vec1",
            "values": [0.1, 0.2, 0.3, ...],  # 1536 dimensoes
            "metadata": {
                "text": "Conteudo do documento",
                "source": "manual.pdf",
                "page": 1
            }
        },
        {
            "id": "vec2",
            "values": [0.4, 0.5, 0.6, ...],
            "metadata": {
                "text": "Outro documento",
                "source": "guia.pdf",
                "page": 5
            }
        }
    ],
    namespace="documentos"
)
```

### Buscar vetores similares

```python
# Query basica
results = index.query(
    vector=[0.1, 0.2, 0.3, ...],  # vetor de busca
    top_k=5,  # numero de resultados
    include_metadata=True,
    namespace="documentos"
)

for match in results['matches']:
    print(f"ID: {match['id']}")
    print(f"Score: {match['score']}")
    print(f"Metadata: {match['metadata']}")
```

### Busca com filtros de metadados

```python
# Filtrar por metadados
results = index.query(
    vector=query_vector,
    top_k=10,
    include_metadata=True,
    filter={
        "source": {"$eq": "manual.pdf"},
        "page": {"$gte": 1, "$lte": 10}
    }
)
```

### Operadores de filtro disponiveis

| Operador | Descricao |
|----------|-----------|
| `$eq` | Igual a |
| `$ne` | Diferente de |
| `$gt` | Maior que |
| `$gte` | Maior ou igual |
| `$lt` | Menor que |
| `$lte` | Menor ou igual |
| `$in` | Esta na lista |
| `$nin` | Nao esta na lista |

### Deletar vetores

```python
# Deletar por IDs
index.delete(ids=["vec1", "vec2"], namespace="documentos")

# Deletar por filtro
index.delete(
    filter={"source": {"$eq": "arquivo_antigo.pdf"}},
    namespace="documentos"
)

# Deletar namespace inteiro
index.delete(delete_all=True, namespace="teste")
```

## Exemplo Completo: RAG com Pinecone e OpenAI

```python
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import hashlib

# Setup
pc = Pinecone(api_key="pinecone-api-key")
openai_client = OpenAI(api_key="openai-api-key")

# Funcao para gerar embeddings
def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

# Criar index se nao existir
if "knowledge-base" not in pc.list_indexes().names():
    pc.create_index(
        name="knowledge-base",
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index("knowledge-base")

# Funcao para indexar documentos
def index_documents(documents: list[dict]):
    vectors = []
    for doc in documents:
        embedding = get_embedding(doc["text"])
        vec_id = hashlib.md5(doc["text"].encode()).hexdigest()
        vectors.append({
            "id": vec_id,
            "values": embedding,
            "metadata": {
                "text": doc["text"],
                "source": doc.get("source", "unknown")
            }
        })

    # Upsert em batches de 100
    for i in range(0, len(vectors), 100):
        batch = vectors[i:i+100]
        index.upsert(vectors=batch)

# Funcao RAG
def ask_question(question: str, top_k: int = 3) -> str:
    # Gerar embedding da pergunta
    query_embedding = get_embedding(question)

    # Buscar documentos relevantes
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    # Montar contexto
    context_texts = [
        match['metadata']['text']
        for match in results['matches']
    ]
    context = "\n\n".join(context_texts)

    # Gerar resposta
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"""Responda a pergunta baseado no contexto fornecido.

Contexto:
{context}

Se a resposta nao estiver no contexto, diga que nao sabe."""
            },
            {"role": "user", "content": question}
        ]
    )

    return response.choices[0].message.content

# Uso
documentos = [
    {"text": "Pinecone e um vector database gerenciado.", "source": "docs"},
    {"text": "RAG combina busca com geracao de texto.", "source": "docs"},
]
index_documents(documentos)

resposta = ask_question("O que e Pinecone?")
print(resposta)
```

## Monitoramento e Metricas

```python
# Estatisticas do index
stats = index.describe_index_stats()

print(f"Total de vetores: {stats['total_vector_count']}")
print(f"Namespaces: {stats['namespaces']}")
```

## Melhores Praticas

1. **Use namespaces**: Organize dados por tenant, ambiente ou categoria
2. **Batch upserts**: Insira vetores em lotes de 100-1000 para melhor performance
3. **Metadata lean**: Mantenha metadados pequenos, armazene textos grandes externamente
4. **Escolha a metrica certa**: cosine para texto normalizado, dotproduct para texto nao-normalizado
5. **Monitore custos**: Pinecone cobra por armazenamento e operacoes

## Precos (Serverless)

- **Armazenamento**: ~$0.33/milhao de vetores/mes
- **Leituras**: ~$8/milhao de queries
- **Escritas**: ~$2/milhao de upserts
- **Free tier**: 100K vetores, recursos limitados

---

## Resources

- [Pinecone - Site Oficial](https://www.pinecone.io)
- [Everything you need to know about Pinecone](https://www.packtpub.com/article-hub/everything-you-need-to-know-about-pinecone-a-vector-database)
- [Video: Introducing Pinecone Serverless](https://www.youtube.com/watch?v=iCuR6ihHQgc)
- [Pinecone Documentation](https://docs.pinecone.io/)

---

## Checklist

- [ ] Criar uma conta no Pinecone e obter API key
- [ ] Criar um index serverless com dimensao apropriada
- [ ] Implementar upsert de vetores com metadados
- [ ] Realizar buscas com filtros de metadados
- [ ] Construir um pipeline RAG completo com Pinecone e OpenAI
