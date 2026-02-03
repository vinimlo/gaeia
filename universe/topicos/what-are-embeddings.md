---
titulo: "O que sao Embeddings"
tags: ["embeddings", "vetores", "representacao"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 35
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# O que sao Embeddings

Embeddings sao representacoes vetoriais densas de dados (como palavras, frases, imagens ou audio) que capturam seu significado semantico e relacionamentos. Ao converter dados em vetores de tamanho fixo, embeddings permitem que modelos de machine learning processem e entendam os dados de forma mais eficaz.

## Por que Embeddings sao Importantes?

Computadores nao entendem naturalmente texto, imagens ou audio. Embeddings resolvem esse problema transformando dados complexos e nao estruturados em numeros que maquinas podem processar.

### O Problema
```
"gato" -> Como um computador entende isso?
"cachorro" -> Como saber que e similar a "gato"?
```

### A Solucao: Embeddings
```
"gato"     -> [0.2, -0.5, 0.8, 0.1, ...]  (vetor de 1536 dimensoes)
"cachorro" -> [0.3, -0.4, 0.7, 0.2, ...]  (vetor similar!)
"carro"    -> [0.9, 0.1, -0.3, 0.8, ...]  (vetor diferente)
```

## Como Embeddings Funcionam

### Espaco Vetorial de Alta Dimensao

Embeddings mapeiam dados para um espaco de alta dimensao onde:
- **Itens similares** ficam proximos
- **Itens diferentes** ficam distantes

```
Exemplo em 2D simplificado:

      ^
  1.0 |     * rei
      |   * rainha
      |
  0.5 |        * homem
      |      * mulher
      |
  0.0 +-------------------->
      0     0.5     1.0

rei - homem + mulher ≈ rainha
```

### Similaridade entre Vetores

A similaridade e calculada usando metricas como **cosine similarity**:

```python
import numpy as np

def cosine_similarity(vec1, vec2):
    """Calcula similaridade do cosseno entre dois vetores"""
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    return dot_product / (norm1 * norm2)

# Exemplo
embedding_gato = np.array([0.2, -0.5, 0.8, 0.1])
embedding_cachorro = np.array([0.3, -0.4, 0.7, 0.2])
embedding_carro = np.array([0.9, 0.1, -0.3, 0.8])

print(cosine_similarity(embedding_gato, embedding_cachorro))  # ~0.95 (muito similar)
print(cosine_similarity(embedding_gato, embedding_carro))     # ~0.20 (pouco similar)
```

## Tipos de Embeddings

### 1. Word Embeddings
Representam palavras individuais.
- **Word2Vec**: Modelo classico do Google
- **GloVe**: Global Vectors for Word Representation
- **FastText**: Considera subpalavras

### 2. Sentence/Document Embeddings
Representam frases ou documentos inteiros.
- **Sentence-BERT**: Embeddings de frases
- **OpenAI Embeddings**: Modelos como `text-embedding-3-small`

### 3. Image Embeddings
Representam imagens.
- **CLIP**: Conecta texto e imagens
- **ResNet features**: Vetores de CNNs pre-treinadas

### 4. Multimodal Embeddings
Combinam diferentes tipos de dados no mesmo espaco vetorial.

## Aplicacoes Praticas

### Busca Semantica
Encontrar documentos por significado, nao apenas palavras-chave.

```python
# Usuario busca: "animais de estimacao fofos"
# Sistema encontra: "Os gatos sao companheiros adoraveis"
# Mesmo sem palavras em comum!
```

### Sistemas de Recomendacao
Recomendar itens similares ao que o usuario gostou.

### Clustering e Classificacao
Agrupar documentos similares automaticamente.

### Deteccao de Anomalias
Identificar itens que nao se encaixam no padrao.

## Criando Embeddings com OpenAI

```python
from openai import OpenAI

client = OpenAI()

def get_embedding(text: str, model: str = "text-embedding-3-small"):
    """Gera embedding para um texto usando a API da OpenAI"""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# Exemplo de uso
texto = "Embeddings sao representacoes vetoriais de dados"
embedding = get_embedding(texto)
print(f"Dimensoes: {len(embedding)}")  # 1536 dimensoes
```

## Dimensionalidade

Modelos diferentes produzem embeddings de tamanhos diferentes:

| Modelo | Dimensoes |
|--------|-----------|
| Word2Vec | 100-300 |
| text-embedding-3-small | 1536 |
| text-embedding-3-large | 3072 |
| BERT | 768 |

Mais dimensoes geralmente = mais informacao, mas mais custo computacional.

---

## Recursos

- [Introducing Text and Code Embeddings - OpenAI](https://openai.com/index/introducing-text-and-code-embeddings/)
- [What are Embeddings - Cloudflare](https://www.cloudflare.com/learning/ai/what-are-embeddings/)
- [Word2Vec Explained - Jay Alammar](https://jalammar.github.io/illustrated-word2vec/)

---

## Checklist

- [ ] Entender o que sao embeddings e por que sao uteis
- [ ] Compreender como similaridade semantica e representada em vetores
- [ ] Saber calcular similaridade entre embeddings usando cosine similarity
- [ ] Conhecer os principais tipos de embeddings (word, sentence, image)
- [ ] Criar embeddings usando a API da OpenAI ou modelos open-source
