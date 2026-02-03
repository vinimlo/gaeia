---
titulo: "Embeddings de Texto"
tags: ["nlp", "vetores", "representacao", "word2vec", "embeddings"]
prerequisitos: ["backpropagation"]
nivel: "intermediario"
tempoEstimado: 90
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Embeddings e Representacao de Texto

**Teoria:** Palavras como vetores, one-hot encoding, embeddings como lookup tables

**Pratica:** Implementar embedding layer, alimentar MLP com texto

> A ponte entre "rede neural generica" e "modelo de linguagem". Aqui voce comeca a ver como texto vira numeros.

---

## Videos Fundamentais

- **Karpathy - makemore (bigram language model)** - Segundo video da serie Zero to Hero
  - [youtube.com/watch?v=PaCmpygFfXo](http://youtube.com/watch?v=PaCmpygFfXo)

---

## Papers Fundamentais

- **Mikolov et al. (2013) - Word2Vec** - Paper original: Skip-gram e CBOW
  - [arxiv.org/abs/1301.3781](http://arxiv.org/abs/1301.3781)

- **Goldberg & Levy - word2vec Explained** - Clareza matematica que o paper original nao tem
  - [arxiv.org/abs/1402.3722](http://arxiv.org/abs/1402.3722)

- **Rong - word2vec Parameter Learning Explained** - Detalhamento completo do aprendizado
  - [arxiv.org/abs/1411.2738](http://arxiv.org/abs/1411.2738)

- **Pennington, Socher & Manning (2014) - GloVe** - Combina co-ocorrencia global com contexto local
  - [nlp.stanford.edu/projects/glove](http://nlp.stanford.edu/projects/glove)

- **Bengio (2003) - A Neural Probabilistic Language Model** - O paper que inaugurou embeddings aprendidos e LMs neurais
  - [jmlr.org/papers/v3/bengio03a.html](http://jmlr.org/papers/v3/bengio03a.html)

---

## Leituras e Tutoriais

- **Jay Alammar - The Illustrated Word2Vec** - Visualizacoes excepcionais de CBOW e Skip-gram
  - [jalammar.github.io/illustrated-word2vec](http://jalammar.github.io/illustrated-word2vec)

- **Analytics Vidhya - From Count Vectors to Word2Vec** - Progressao de one-hot -> TF-IDF -> embeddings neurais
  - [analyticsvidhya.com/blog/2017/06/word-embeddings-count-word2veec](http://analyticsvidhya.com/blog/2017/06/word-embeddings-count-word2veec)

---

## Ferramentas de Visualizacao

- **TensorFlow Embedding Projector** - Exploracao 3D interativa com PCA, t-SNE, UMAP
  - [projector.tensorflow.org](http://projector.tensorflow.org)

- **gpt-intuition** - Alternativa Streamlit mais facil de configurar
  - [github.com/epec254/gpt-intuition](http://github.com/epec254/gpt-intuition)

---

## Entregavel

Um modelo de linguagem simples (bigram ou trigram) que preve o proximo caractere.

Treinado no seu MLP com embeddings.

---

## Checklist

- [ ] Assistir Karpathy makemore
- [ ] Ler Jay Alammar sobre Word2Vec
- [ ] Entender one-hot vs embeddings
- [ ] Implementar embedding layer
- [ ] Treinar modelo bigram/trigram
- [ ] Gerar texto simples

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[backpropagation]]
>
> **Na pratica:** Embeddings sao essenciais para RAG e busca semantica
>
> **Proximo passo:** Entenda como attention usa embeddings em [[self-attention]]
