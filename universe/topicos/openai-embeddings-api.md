---
titulo: "OpenAI Embeddings API"
tags: ["openai", "embeddings", "api"]
prerequisitos: ["what-are-embeddings"]
nivel: "iniciante"
tempoEstimado: 30
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# OpenAI Embeddings API

A OpenAI Embeddings API permite gerar representacoes vetoriais de texto que capturam significado semantico. Estes embeddings podem ser usados para busca semantica, clustering, classificacao e muito mais.

## Modelos Disponiveis

A OpenAI oferece diferentes modelos de embedding:

| Modelo | Dimensoes | Preco (por 1M tokens) | Uso Recomendado |
|--------|-----------|----------------------|-----------------|
| text-embedding-3-small | 1536 | $0.02 | Uso geral, custo-beneficio |
| text-embedding-3-large | 3072 | $0.13 | Maior precisao |
| text-embedding-ada-002 | 1536 | $0.10 | Legacy |

## Configuracao Inicial

### Instalacao
```bash
pip install openai
```

### Configuracao da API Key
```python
import os
from openai import OpenAI

# Via variavel de ambiente (recomendado)
# export OPENAI_API_KEY="sua-api-key"

client = OpenAI()  # Automaticamente usa OPENAI_API_KEY

# Ou explicitamente
client = OpenAI(api_key="sua-api-key")
```

## Uso Basico

### Gerando um Embedding

```python
from openai import OpenAI

client = OpenAI()

def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """Gera embedding para um texto"""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# Exemplo
texto = "Machine learning e uma area fascinante da IA"
embedding = get_embedding(texto)

print(f"Texto: {texto}")
print(f"Dimensoes: {len(embedding)}")
print(f"Primeiros 5 valores: {embedding[:5]}")
```

### Gerando Embeddings em Batch

```python
def get_embeddings_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    """Gera embeddings para multiplos textos de uma vez"""
    response = client.embeddings.create(
        input=texts,
        model=model
    )
    # Ordena pelo indice para manter a ordem original
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]

# Exemplo
textos = [
    "Python e uma linguagem de programacao",
    "JavaScript roda no navegador",
    "Gatos sao animais domesticos"
]

embeddings = get_embeddings_batch(textos)
print(f"Gerados {len(embeddings)} embeddings")
```

## Calculando Similaridade

```python
import numpy as np

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """Calcula similaridade do cosseno entre dois vetores"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# Comparando textos
texto1 = "Como treinar um modelo de machine learning?"
texto2 = "Qual e o processo para criar um modelo de ML?"
texto3 = "Qual e a receita de bolo de chocolate?"

emb1 = get_embedding(texto1)
emb2 = get_embedding(texto2)
emb3 = get_embedding(texto3)

print(f"Similaridade texto1-texto2: {cosine_similarity(emb1, emb2):.4f}")  # ~0.90
print(f"Similaridade texto1-texto3: {cosine_similarity(emb1, emb3):.4f}")  # ~0.40
```

## Exemplo Pratico: Busca Semantica

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

class SemanticSearch:
    def __init__(self, model: str = "text-embedding-3-small"):
        self.model = model
        self.documents = []
        self.embeddings = []

    def add_documents(self, docs: list[str]):
        """Adiciona documentos ao indice"""
        self.documents.extend(docs)

        # Gera embeddings em batch
        response = client.embeddings.create(input=docs, model=self.model)
        new_embeddings = [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
        self.embeddings.extend(new_embeddings)

    def search(self, query: str, top_k: int = 3) -> list[tuple[str, float]]:
        """Busca os documentos mais similares a query"""
        # Gera embedding da query
        response = client.embeddings.create(input=query, model=self.model)
        query_embedding = response.data[0].embedding

        # Calcula similaridades
        similarities = []
        for i, doc_embedding in enumerate(self.embeddings):
            sim = cosine_similarity(query_embedding, doc_embedding)
            similarities.append((self.documents[i], sim))

        # Retorna top_k mais similares
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]

# Uso
search = SemanticSearch()
search.add_documents([
    "Python e excelente para data science e machine learning",
    "JavaScript e a linguagem da web, usada no frontend e backend",
    "Rust oferece seguranca de memoria sem garbage collector",
    "Go e otimo para sistemas distribuidos e microservices"
])

resultados = search.search("Qual linguagem usar para inteligencia artificial?")
for doc, score in resultados:
    print(f"[{score:.3f}] {doc}")
```

## Reducao de Dimensionalidade

O modelo `text-embedding-3` suporta reducao de dimensionalidade nativa:

```python
def get_embedding_reduced(text: str, dimensions: int = 256) -> list[float]:
    """Gera embedding com dimensionalidade reduzida"""
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small",
        dimensions=dimensions  # Reduz de 1536 para 256
    )
    return response.data[0].embedding

# Embedding menor = menos armazenamento, busca mais rapida
embedding_full = get_embedding("Teste")           # 1536 dims
embedding_small = get_embedding_reduced("Teste")  # 256 dims
```

## Boas Praticas

1. **Batch Processing**: Sempre que possivel, envie multiplos textos em uma requisicao
2. **Cache**: Armazene embeddings para evitar recalculos
3. **Dimensionalidade**: Use reducao de dimensoes se precisar economizar espaco
4. **Pre-processamento**: Limpe o texto antes de gerar embeddings
5. **Limites**: Respeite o limite de tokens do modelo (8191 tokens)

```python
def preprocess_text(text: str) -> str:
    """Pre-processa texto antes de gerar embedding"""
    # Remove espacos extras
    text = " ".join(text.split())
    # Trunca se muito longo (aproximadamente 8000 tokens)
    max_chars = 30000  # ~8000 tokens
    if len(text) > max_chars:
        text = text[:max_chars]
    return text
```

---

## Recursos

- [OpenAI Embeddings API Reference](https://platform.openai.com/docs/api-reference/embeddings/create)
- [Master OpenAI Embedding API - Video](https://www.youtube.com/watch?v=9oCS-VQupoc)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)

---

## Checklist

- [ ] Configurar a OpenAI API key corretamente
- [ ] Gerar embeddings para textos individuais e em batch
- [ ] Calcular similaridade entre embeddings usando cosine similarity
- [ ] Implementar um sistema basico de busca semantica
- [ ] Aplicar boas praticas como pre-processamento e caching
