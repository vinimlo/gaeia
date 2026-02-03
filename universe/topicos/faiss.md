---
titulo: "FAISS"
tags: ["faiss", "vector-databases", "facebook"]
prerequisitos: ["vector-databases", "embeddings"]
nivel: "intermediario"
tempoEstimado: 50
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# FAISS

FAISS (Facebook AI Similarity Search) e uma biblioteca desenvolvida pela Meta AI para busca eficiente por similaridade e clustering de vetores densos. Diferente de bancos de dados vetoriais gerenciados, o FAISS e uma biblioteca que voce integra diretamente em sua aplicacao, oferecendo controle total sobre indexacao e busca.

## Por que FAISS?

O FAISS e a escolha ideal quando voce precisa de:

1. **Performance maxima**: Otimizado para CPU e GPU
2. **Escalabilidade extrema**: Suporta bilhoes de vetores
3. **Controle total**: Escolha exata do algoritmo e parametros
4. **Custo zero**: Open-source, roda localmente
5. **Flexibilidade**: Varios tipos de indices para diferentes trade-offs

## Instalacao

### CPU apenas

```bash
pip install faiss-cpu
```

### Com suporte a GPU

```bash
pip install faiss-gpu
```

## Conceitos Fundamentais

### Tipos de Indices

O FAISS oferece varios tipos de indices, cada um com diferentes trade-offs:

| Index | Descricao | Uso |
|-------|-----------|-----|
| `Flat` | Busca exata (brute force) | Datasets pequenos, precisao maxima |
| `IVF` | Inverted File Index | Datasets medios, boa velocidade |
| `HNSW` | Hierarchical Navigable Small World | Alta performance, mais memoria |
| `PQ` | Product Quantization | Compressao, datasets enormes |
| `IVF + PQ` | Combinacao | Bilhoes de vetores |

### Metricas de Distancia

```python
import faiss

# L2 (Euclidean) - padrao
index = faiss.IndexFlatL2(dimension)

# Inner Product (para cosine similarity com vetores normalizados)
index = faiss.IndexFlatIP(dimension)
```

## Operacoes Basicas

### Index Flat (Busca Exata)

```python
import faiss
import numpy as np

# Dimensao dos vetores
d = 128

# Criar index
index = faiss.IndexFlatL2(d)

# Dados de exemplo (1000 vetores de 128 dimensoes)
np.random.seed(42)
vectors = np.random.random((1000, d)).astype('float32')

# Adicionar vetores ao index
index.add(vectors)

print(f"Total de vetores: {index.ntotal}")

# Buscar os 5 vizinhos mais proximos
query = np.random.random((1, d)).astype('float32')
k = 5

distances, indices = index.search(query, k)

print(f"Indices: {indices}")
print(f"Distancias: {distances}")
```

### Index com IDs Customizados

```python
import faiss

d = 128
index = faiss.IndexFlatL2(d)

# Wrapper para usar IDs customizados
index_with_ids = faiss.IndexIDMap(index)

# Adicionar com IDs especificos
ids = np.array([100, 200, 300, 400, 500])
vectors = np.random.random((5, d)).astype('float32')

index_with_ids.add_with_ids(vectors, ids)

# Buscar retorna os IDs originais
distances, indices = index_with_ids.search(query, k=3)
# indices agora contem: [[100, 300, 200]] (exemplo)
```

### Index IVF (Busca Aproximada)

```python
import faiss

d = 128
nlist = 100  # numero de clusters

# Quantizador base
quantizer = faiss.IndexFlatL2(d)

# Index IVF
index = faiss.IndexIVFFlat(quantizer, d, nlist)

# IVF precisa de treinamento
training_data = np.random.random((10000, d)).astype('float32')
index.train(training_data)

# Agora pode adicionar vetores
index.add(vectors)

# Parametro nprobe: quantos clusters buscar
index.nprobe = 10  # mais clusters = mais preciso, mais lento

distances, indices = index.search(query, k=5)
```

### Index HNSW (Grafos)

```python
import faiss

d = 128
M = 32  # numero de conexoes por no

# HNSW e rapido e preciso, mas usa mais memoria
index = faiss.IndexHNSWFlat(d, M)

# Parametro de construcao
index.hnsw.efConstruction = 40

# Adicionar vetores (nao precisa treinar)
index.add(vectors)

# Parametro de busca
index.hnsw.efSearch = 16  # mais = mais preciso

distances, indices = index.search(query, k=5)
```

## Persistencia

### Salvar e carregar indices

```python
import faiss

# Salvar
faiss.write_index(index, "meu_index.faiss")

# Carregar
index = faiss.read_index("meu_index.faiss")
```

## Exemplo Completo: Sistema de Busca Semantica

```python
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class SemanticSearch:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.index = None
        self.documents = []

    def build_index(self, documents: list[str], use_gpu: bool = False):
        """Constroi o index a partir de uma lista de documentos."""
        self.documents = documents

        # Gerar embeddings
        embeddings = self.model.encode(
            documents,
            convert_to_numpy=True,
            show_progress_bar=True
        ).astype('float32')

        # Normalizar para usar Inner Product como cosine similarity
        faiss.normalize_L2(embeddings)

        # Criar index
        if len(documents) < 10000:
            # Flat para datasets pequenos
            self.index = faiss.IndexFlatIP(self.dimension)
        else:
            # IVF para datasets maiores
            nlist = int(np.sqrt(len(documents)))
            quantizer = faiss.IndexFlatIP(self.dimension)
            self.index = faiss.IndexIVFFlat(
                quantizer, self.dimension, nlist,
                faiss.METRIC_INNER_PRODUCT
            )
            self.index.train(embeddings)
            self.index.nprobe = 10

        # GPU se disponivel e solicitado
        if use_gpu:
            self.index = faiss.index_cpu_to_gpu(
                faiss.StandardGpuResources(), 0, self.index
            )

        self.index.add(embeddings)
        print(f"Index construido com {self.index.ntotal} vetores")

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        """Busca documentos similares a query."""
        # Gerar embedding da query
        query_embedding = self.model.encode(
            [query],
            convert_to_numpy=True
        ).astype('float32')

        faiss.normalize_L2(query_embedding)

        # Buscar
        scores, indices = self.index.search(query_embedding, top_k)

        # Formatar resultados
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1:  # -1 indica nao encontrado
                results.append({
                    "document": self.documents[idx],
                    "score": float(score),
                    "index": int(idx)
                })

        return results

    def save(self, path: str):
        """Salva o index e documentos."""
        faiss.write_index(self.index, f"{path}.faiss")
        np.save(f"{path}_docs.npy", np.array(self.documents))

    def load(self, path: str):
        """Carrega o index e documentos."""
        self.index = faiss.read_index(f"{path}.faiss")
        self.documents = np.load(f"{path}_docs.npy", allow_pickle=True).tolist()

# Uso
search = SemanticSearch()

documents = [
    "Python e uma linguagem de programacao versátil",
    "Machine learning permite que computadores aprendam",
    "FAISS e uma biblioteca para busca por similaridade",
    "Deep learning usa redes neurais com muitas camadas",
    "Natural language processing processa texto humano"
]

search.build_index(documents)

results = search.search("como computadores aprendem padroes", top_k=3)

for r in results:
    print(f"Score: {r['score']:.4f} - {r['document']}")
```

## FAISS com GPU

```python
import faiss

# Verificar GPUs disponiveis
ngpus = faiss.get_num_gpus()
print(f"GPUs disponiveis: {ngpus}")

# Mover index para GPU
gpu_resources = faiss.StandardGpuResources()
gpu_index = faiss.index_cpu_to_gpu(gpu_resources, 0, cpu_index)

# Ou usar todas as GPUs
gpu_index = faiss.index_cpu_to_all_gpus(cpu_index)
```

## Comparacao de Indices

| Index | Build Time | Search Time | Memoria | Precisao |
|-------|------------|-------------|---------|----------|
| Flat | Rapido | Lento (O(n)) | 100% | 100% |
| IVF | Medio | Rapido | ~100% | ~95-99% |
| HNSW | Lento | Muito rapido | ~130% | ~95-99% |
| IVF+PQ | Lento | Rapido | ~10-25% | ~90-95% |

## Melhores Praticas

1. **Normalize vetores**: Para cosine similarity, normalize com `faiss.normalize_L2()`
2. **Escolha o index certo**: Flat para < 100K, IVF para < 10M, HNSW ou IVF+PQ para mais
3. **Tune parametros**: `nprobe` e `efSearch` afetam precisao vs velocidade
4. **Use GPU para build**: Treinamento de indices grandes e muito mais rapido em GPU
5. **Batch queries**: Buscar multiplas queries de uma vez e mais eficiente

---

## Resources

- [FAISS - Meta AI](https://ai.meta.com/tools/faiss/)
- [What Is Faiss (Facebook AI Similarity Search)?](https://www.datacamp.com/blog/faiss-facebook-ai-similarity-search)
- [Video: FAISS Vector Library with LangChain and OpenAI](https://www.youtube.com/watch?v=ZCSsIkyCZk4)
- [FAISS Wiki - GitHub](https://github.com/facebookresearch/faiss/wiki)

---

## Checklist

- [ ] Instalar FAISS (CPU ou GPU) e testar instalacao
- [ ] Criar um IndexFlat e realizar buscas exatas
- [ ] Implementar busca aproximada com IndexIVFFlat
- [ ] Salvar e carregar indices do disco
- [ ] Construir um sistema de busca semantica completo com FAISS
