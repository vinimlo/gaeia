---
titulo: "Introducao a Embeddings"
tags: ["embeddings", "vetores", "terminologia"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 40
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Introducao a Embeddings

Embeddings sao representacoes vetoriais densas de dados (palavras, frases, imagens) em um espaco de menor dimensao. Eles capturam relacoes semanticas, onde itens similares ficam proximos no espaco vetorial.

## O que sao Embeddings?

Imagine transformar texto em numeros de forma que textos com significados parecidos tenham numeros parecidos. Isso e um embedding.

```
"cachorro" -> [0.2, -0.5, 0.8, 0.1, ...]  (1536 dimensoes)
"cao"      -> [0.21, -0.48, 0.79, 0.12, ...]  (muito proximo!)
"gato"     -> [0.3, -0.4, 0.7, 0.2, ...]  (proximo, mas nao igual)
"carro"    -> [-0.5, 0.8, -0.2, 0.6, ...]  (distante)
```

## Por que Embeddings sao importantes?

1. **Busca Semantica** - Encontrar documentos por significado, nao apenas palavras-chave
2. **Similaridade** - Calcular quao parecidos dois textos sao
3. **RAG** - Base para Retrieval-Augmented Generation
4. **Classificacao** - Agrupar textos por tema automaticamente
5. **Recomendacao** - Sugerir itens similares

## Como funcionam?

Modelos de embedding sao treinados para:
1. Receber texto (ou imagem, audio)
2. Processar atraves de uma rede neural
3. Produzir um vetor de dimensao fixa

O treinamento ensina o modelo que:
- Textos semanticamente similares devem ter vetores proximos
- Textos diferentes devem ter vetores distantes

## Principais Modelos de Embedding

| Modelo | Dimensoes | Provedor | Uso |
|--------|-----------|----------|-----|
| text-embedding-3-large | 3072 | OpenAI | Alta qualidade, custo |
| text-embedding-3-small | 1536 | OpenAI | Bom custo-beneficio |
| all-MiniLM-L6-v2 | 384 | Sentence Transformers | Open-source, rapido |
| voyage-3 | 1024 | Voyage AI | Otimizado para RAG |
| embed-multilingual-v3 | 1024 | Cohere | Multilingue |

## Medindo Similaridade

A similaridade entre embeddings e calculada por:

**Similaridade de Cosseno** - Angulo entre vetores (mais comum)
```python
from numpy import dot
from numpy.linalg import norm

def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))
```

Valores:
- **1.0** = Identicos
- **0.0** = Sem relacao
- **-1.0** = Opostos

## Exemplo Pratico

```python
from openai import OpenAI

client = OpenAI()

# Gerar embeddings
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=["Eu amo programar", "Adoro escrever codigo"]
)

emb1 = response.data[0].embedding
emb2 = response.data[1].embedding

# Calcular similaridade
similarity = cosine_similarity(emb1, emb2)
print(f"Similaridade: {similarity:.3f}")  # ~0.85
```

---

## Recursos

- [What are Embeddings in Machine Learning? - Cloudflare](https://www.cloudflare.com/en-gb/learning/ai/what-are-embeddings/)
- [What is Embedding? - IBM](https://www.ibm.com/topics/embedding)
- [What are Word Embeddings - Video](https://www.youtube.com/watch?v=wgfSDrqYMJ4)

---

## Checklist

- [ ] Entender o conceito de embedding como vetor semantico
- [ ] Conhecer casos de uso (busca, similaridade, RAG)
- [ ] Entender similaridade de cosseno
- [ ] Experimentar gerando embeddings com a API da OpenAI
- [ ] Calcular similaridade entre duas frases

---

## Conexoes

> **Proximo passo:** Aprenda onde armazenar embeddings em [[vector-databases-intro]]
