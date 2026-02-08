---
titulo: "Embeddings de Texto"
tags: ["nlp", "vetores", "representacao", "word2vec", "embeddings"]
prerequisitos: ["tokenizacao"]
nivel: "intermediario"
tempoEstimado: 240
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Embeddings e Representacao de Texto

**Teoria:** Palavras como vetores, one-hot encoding, embeddings como lookup tables

**Pratica:** Implementar embedding layer, alimentar MLP com texto

> A ponte entre "rede neural generica" e "modelo de linguagem". Aqui voce comeca a ver como texto vira numeros.

---

## A Grande Transicao: de XOR para Linguagem

Ate agora, voce construiu uma MLP que aprende patterns como XOR. Um **modelo de linguagem** faz algo conceitualmente similar, mas com texto: dada uma sequencia de palavras, ele preve a proxima. Formalmente: `P(proxima_palavra | palavras_anteriores)`.

Para fazer isso, precisamos resolver um problema fundamental: redes neurais operam com numeros, mas texto e simbolico. **Embeddings** sao a solucao - vetores densos que capturam significado, onde palavras similares ficam proximas no espaco vetorial. Diferente de one-hot (esparso, sem relacao entre palavras), embeddings sao *aprendidos* junto com o modelo.

---

## Videos Fundamentais

- **Karpathy - makemore (bigram language model)** - Segundo video da serie Zero to Hero
  - [youtube.com/watch?v=PaCmpygFfXo](https://youtube.com/watch?v=PaCmpygFfXo)

- **Karpathy - makemore part 3 (MLP language model)** - Ponte direta entre a MLP que voce construiu e language modeling. Implementa Bengio et al. (2003)
  - [youtube.com/watch?v=TCH_1BHY58I](https://youtube.com/watch?v=TCH_1BHY58I)

---

## Papers Fundamentais

- **Mikolov et al. (2013) - Word2Vec** - Paper original: Skip-gram e CBOW
  - [arxiv.org/abs/1301.3781](https://arxiv.org/abs/1301.3781)

- **Goldberg & Levy - word2vec Explained** - Clareza matematica que o paper original nao tem
  - [arxiv.org/abs/1402.3722](https://arxiv.org/abs/1402.3722)

- **Rong - word2vec Parameter Learning Explained** - Detalhamento completo do aprendizado
  - [arxiv.org/abs/1411.2738](https://arxiv.org/abs/1411.2738)

- **Pennington, Socher & Manning (2014) - GloVe** - Combina co-ocorrencia global com contexto local
  - [nlp.stanford.edu/projects/glove](https://nlp.stanford.edu/projects/glove)

- **Bengio (2003) - A Neural Probabilistic Language Model** - O paper que inaugurou embeddings aprendidos e LMs neurais
  - [jmlr.org/papers/v3/bengio03a.html](https://jmlr.org/papers/v3/bengio03a.html)

---

## Leituras e Tutoriais

- **Jay Alammar - The Illustrated Word2Vec** - Visualizacoes excepcionais de CBOW e Skip-gram
  - [jalammar.github.io/illustrated-word2vec](https://jalammar.github.io/illustrated-word2vec)

- **Analytics Vidhya - From Count Vectors to Word2Vec** - Progressao de one-hot -> TF-IDF -> embeddings neurais
  - [analyticsvidhya.com/blog/2017/06/word-embeddings-count-word2veec](https://analyticsvidhya.com/blog/2017/06/word-embeddings-count-word2veec)

---

## Ferramentas de Visualizacao

- **TensorFlow Embedding Projector** - Exploracao 3D interativa com PCA, t-SNE, UMAP
  - [projector.tensorflow.org](https://projector.tensorflow.org)

- **gpt-intuition** - Alternativa Streamlit mais facil de configurar
  - [github.com/epec254/gpt-intuition](https://github.com/epec254/gpt-intuition)

---

## Insight Chave

**Uma embedding layer e "so" uma lookup table treinavel.** Internamente, e uma multiplicacao de matriz com um vetor one-hot - mas como one-hot tem um unico 1, isso equivale a selecionar uma linha da matriz. Essa matriz de embeddings e aprendida junto com o resto da rede via backprop. O resultado: palavras que aparecem em contextos similares acabam com vetores similares, sem ninguem programar isso explicitamente.

---

## Entregavel

**Etapa 1:** Implemente um bigram character-level **sem embeddings** (tabela de contagem + probabilidades). Treine num texto curto (~100KB). Gere 200 caracteres — deve parecer aleatorio mas respeitar frequencias de pares.

**Etapa 2:** Substitua a tabela de contagem pelo seu MLP: cada caractere vira um embedding vector de dimensao 8, janela de contexto de 2 caracteres, saida via softmax sobre o vocabulario. Treine e compare com o bigram de contagem.

**Verificacao:** Gere 200 caracteres com o modelo neural. Deve produzir sequencias que lembram palavras (nao precisa fazer sentido, mas deve parecer quase-linguagem).

**Voce deve conseguir explicar:** Por que uma embedding layer e "so" uma lookup table treinavel.

---

## Checklist

- [ ] Assistir Karpathy makemore (bigram)
- [ ] Assistir Karpathy makemore part 3 (MLP)
- [ ] Ler Jay Alammar sobre Word2Vec
- [ ] Entender one-hot vs embeddings
- [ ] Implementar embedding layer
- [ ] Treinar modelo bigram/trigram
- [ ] Gerar texto simples

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[tokenizacao]]
>
> **Na pratica:** Embeddings sao essenciais para RAG e busca semantica
>
> **Proximo passo:** Entenda como tokens prestam atencao uns nos outros em [[self-attention]]
