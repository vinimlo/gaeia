---
titulo: "Self-Attention"
tags: ["transformer", "atencao", "nlp", "arquitetura", "softmax", "mascaramento-causal"]
prerequisitos: ["embeddings-texto"]
nivel: "intermediario"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Atencao como Conceito

**Teoria:** Softmax como operacao, normas (L2), o conceito de "prestar atencao" em partes relevantes, mascaramento causal

**Pratica:** Implementar self-attention em matrizes pequenas (3x4, 4x4)

> Com as bases dos topicos anteriores, Q x K^T e "so" um dot product que voce ja domina, e softmax e "so" uma funcao que voce ja implementou.

---

## Videos Fundamentais

- **3Blue1Brown - Attention in Transformers** - Queries como "perguntas", keys como "respostas", analogia adjetivo-substantivo
  - [3blue1brown.com/lessons/attention](https://3blue1brown.com/lessons/attention)

---

## Papers e Leituras Densas

- **Vaswani et al. (2017) - Attention Is All You Need** - O paper. Releia agora - vai ser outro paper.
  - [arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)

- **Lilian Weng - "Attention? Attention!"** - Survey mais completo: Bahdanau/Luong ate self-attention
  - [lilianweng.github.io/posts/2018-06-24-attention](https://lilianweng.github.io/posts/2018-06-24-attention)

- **Lilian Weng - Transformer Family v2.0** - Atualizacao cobrindo sparse attention, efficient transformers, MoE
  - [lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2](https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2)

---

## Tutoriais Step-by-Step

- **Jay Alammar - The Illustrated Transformer** - Leia com calma. A referencia visual definitiva.
  - [jalammar.github.io/illustrated-transformer](https://jalammar.github.io/illustrated-transformer)

- **Machine Learning Mastery - Attention from Scratch** - Calculo explicito: 4 embeddings, Q/K/V, dot product, softmax, weighted sums com NumPy
  - [machinelearningmastery.com/the-attention-mechanism-from-scratch](https://machinelearningmastery.com/the-attention-mechanism-from-scratch)

- **UvA Deep Learning Notebooks - Tutorial 6** - Material completo de curso universitario com exercicios
  - [uvadlc-notebooks.readthedocs.io/.../tutorial6](https://uvadlc-notebooks.readthedocs.io/.../tutorial6)

---

## Visualizadores de Attention

- **BertViz** - Head view, model view, neuron view para qualquer modelo HuggingFace
  - [github.com/jessevig/bertviz](https://github.com/jessevig/bertviz)

- **Transformer Explainer** - GPT-2 rodando live no browser, hover para ver weights
  - [poloclub.github.io/transformer-explainer](https://poloclub.github.io/transformer-explainer)

- **AttentionViz** - Visualiza attention como embeddings conjuntos query-key
  - [attentionviz.com](https://attentionviz.com)

---

## Mascaramento Causal

Em modelos **decoder-only** como o GPT, cada posicao so pode "prestar atencao" em posicoes anteriores (e em si mesma). Isso e implementado com uma **mascara triangular** que seta scores de posicoes futuras para `-inf` antes do softmax, fazendo-os virar 0.

```
Mascara (sequencia de 4 tokens):
[  0, -inf, -inf, -inf ]
[  0,    0, -inf, -inf ]
[  0,    0,    0, -inf ]
[  0,    0,    0,    0 ]
```

Sem essa mascara, o modelo "veria o futuro" durante o treino - como fazer uma prova ja sabendo as respostas. A diferenca fundamental: **BERT** usa attention bidirecional (sem mascara), **GPT** usa attention causal (com mascara). Voce vai implementar a versao causal em [[seu-gpt]].

---

## Insight Chave

O scaling por sqrt(d_k) importa: sem ele, dot products grandes causam saturacao do softmax e gradientes quase zero.

E como um parametro de "temperatura" - **sem scaling, a attention vira hard (one-hot) ao inves de soft**.

---

## Entregavel

Self-attention implementada em NumPy com uma frase curta (ex: 4 palavras). Crie embeddings simples de dimensao 4 para cada palavra.

**Inclua mascara causal.** Explique o que acontece com os scores de posicoes futuras.

**Visualize** a matriz de atencao como heatmap (matplotlib ou print formatado). Identifique qual token presta mais atencao em qual.

**Voce deve conseguir apontar para um attention score e explicar:** "Esse token esta prestando atencao naquele porque..."

---

## Checklist

- [ ] Assistir 3Blue1Brown sobre attention
- [ ] Ler Jay Alammar Illustrated Transformer
- [ ] Reler paper Attention Is All You Need
- [ ] Entender Q, K, V
- [ ] Implementar self-attention em NumPy
- [ ] Implementar mascara causal
- [ ] Explicar attention scores

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[embeddings-texto]]
>
> **Proximo passo:** Monte o transformer completo em [[transformer]]
