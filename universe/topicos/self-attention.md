---
titulo: "Self-Attention"
tags: ["transformer", "atencao", "nlp", "arquitetura", "softmax"]
prerequisitos: ["embeddings-texto"]
nivel: "intermediario"
tempoEstimado: 90
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Atencao como Conceito

**Teoria:** Softmax como operacao, normas (L2), o conceito de "prestar atencao" em partes relevantes

**Pratica:** Implementar self-attention em matrizes pequenas (3x4, 4x4)

> Com as bases dos topicos anteriores, Q x K^T e "so" um dot product que voce ja domina, e softmax e "so" uma funcao que voce ja implementou.

---

## Videos Fundamentais

- **3Blue1Brown - Attention in Transformers** - Queries como "perguntas", keys como "respostas", analogia adjetivo-substantivo
  - [3blue1brown.com/lessons/attention](http://3blue1brown.com/lessons/attention)

---

## Papers e Leituras Densas

- **Vaswani et al. (2017) - Attention Is All You Need** - O paper. Releia agora - vai ser outro paper.
  - [arxiv.org/abs/1706.03762](http://arxiv.org/abs/1706.03762)

- **Lilian Weng - "Attention? Attention!"** - Survey mais completo: Bahdanau/Luong ate self-attention
  - [lilianweng.github.io/posts/2018-06-24-attention](http://lilianweng.github.io/posts/2018-06-24-attention)

- **Lilian Weng - Transformer Family v2.0** - Atualizacao cobrindo sparse attention, efficient transformers, MoE
  - [lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2](http://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2)

---

## Tutoriais Step-by-Step

- **Jay Alammar - The Illustrated Transformer** - Leia com calma. A referencia visual definitiva.
  - [jalammar.github.io/illustrated-transformer](http://jalammar.github.io/illustrated-transformer)

- **Machine Learning Mastery - Attention from Scratch** - Calculo explicito: 4 embeddings, Q/K/V, dot product, softmax, weighted sums com NumPy
  - [machinelearningmastery.com/the-attention-mechanism-from-scratch](http://machinelearningmastery.com/the-attention-mechanism-from-scratch)

- **UvA Deep Learning Notebooks - Tutorial 6** - Material completo de curso universitario com exercicios
  - [uvadlc-notebooks.readthedocs.io/.../tutorial6](http://uvadlc-notebooks.readthedocs.io/.../tutorial6)

---

## Visualizadores de Attention

- **BertViz** - Head view, model view, neuron view para qualquer modelo HuggingFace
  - [github.com/jessevig/bertviz](http://github.com/jessevig/bertviz)

- **Transformer Explainer** - GPT-2 rodando live no browser, hover para ver weights
  - [poloclub.github.io/transformer-explainer](http://poloclub.github.io/transformer-explainer)

- **AttentionViz** - Visualiza attention como embeddings conjuntos query-key
  - [attentionviz.com](http://attentionviz.com)

---

## Insight Chave

O scaling por sqrt(d_k) importa: sem ele, dot products grandes causam saturacao do softmax e gradientes quase zero.

E como um parametro de "temperatura" - **sem scaling, a attention vira hard (one-hot) ao inves de soft**.

---

## Entregavel

Self-attention implementada em NumPy com matrizes pequenas.

**Voce deve conseguir apontar para um attention score e explicar:** "Esse token esta prestando atencao naquele porque..."

---

## Checklist

- [ ] Assistir 3Blue1Brown sobre attention
- [ ] Ler Jay Alammar Illustrated Transformer
- [ ] Reler paper Attention Is All You Need
- [ ] Entender Q, K, V
- [ ] Implementar self-attention em NumPy
- [ ] Explicar attention scores

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[embeddings-texto]]
>
> **Proximo passo:** Monte o transformer completo em [[transformer]]
