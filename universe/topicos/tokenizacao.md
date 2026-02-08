---
titulo: "Tokenizacao"
tags: ["nlp", "preprocessamento", "bpe", "texto", "vocabulario"]
prerequisitos: ["backpropagation"]
nivel: "intermediario"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Tokenizacao

**Teoria:** BPE (Byte Pair Encoding), vocabulario, tokens vs caracteres

**Pratica:** Implementar tokenizer BPE do zero

> Antes de transformar texto em vetores, precisamos decidir: qual a unidade basica? Caractere? Palavra? A resposta e mais sutil do que parece.

---

## Papers Fundamentais

- **Sennrich, Haddow & Birch (2016) - BPE for NMT** - Adaptacao do algoritmo de compressao para traducao
  - [arxiv.org/abs/1508.07909](https://arxiv.org/abs/1508.07909)

- **Kudo & Richardson (2018) - SentencePiece** - Tokenizacao language-independent, sem pre-tokenizacao
  - [arxiv.org/abs/1808.06226](https://arxiv.org/abs/1808.06226)

- **Kudo (2018) - Unigram Model** - Alternativa ao BPE: comeca grande e trima por loss
  - [arxiv.org/abs/1804.10959](https://arxiv.org/abs/1804.10959)

---

## Videos e Tutoriais

- **Karpathy - Let's build the GPT Tokenizer** - Video dedicado so a tokenizacao
  - [youtube.com/watch?v=zduSFxRajkE](https://youtube.com/watch?v=zduSFxRajkE)

- **HuggingFace LLM Course - BPE Chapter** - Implementacao pedagogica completa
  - [huggingface.co/learn/llm-course/en/chapter6/5](https://huggingface.co/learn/llm-course/en/chapter6/5)

- **Sebastian Raschka - BPE From Scratch** - Jupyter notebook standalone imitando tiktoken
  - [sebastianraschka.com/blog/2025/bpe-from-scratch.html](https://sebastianraschka.com/blog/2025/bpe-from-scratch.html)

---

## Codigo de Referencia

- **Karpathy - minbpe** - Implementacao educacional de referencia: BasicTokenizer, RegexTokenizer (GPT-2), GPT4Tokenizer
  - [github.com/karpathy/minbpe](https://github.com/karpathy/minbpe)
  - Inclui `exercise.md` para pratica hands-on

- **HuggingFace Tokenizers Summary** - Comparacao BPE vs WordPiece vs Unigram
  - [huggingface.co/docs/transformers/en/tokenizer_summary](https://huggingface.co/docs/transformers/en/tokenizer_summary)

- **rsennrich/subword-nmt** - Implementacao original dos autores do paper
  - [github.com/rsennrich/subword-nmt](https://github.com/rsennrich/subword-nmt)

---

## Comparacao de Metodos

| Metodo | Usado por | Estrategia |
|--------|-----------|------------|
| **BPE** | GPT-2, GPT-4, LLaMA | Merge pares mais frequentes |
| **WordPiece** | BERT | Merge pares que maximizam likelihood |
| **Unigram** | XLNet, T5 | Comeca grande, trima por loss |
| **SentencePiece** | T5, LLaMA | Wrapper language-independent |

---

## Entregavel

Tokenizer BPE treinado em Tiny Shakespeare com vocabulario de 256 tokens.

**Round-trip test:** `decode(encode(texto)) == texto` para qualquer string do corpus.

**Metrica:** Calcule a taxa de compressao `(chars / tokens)` — deve ser > 2x.

**Voce deve conseguir explicar:** Por que tokens BPE sao melhores que caracteres individuais e melhores que palavras inteiras.

---

## Checklist

- [ ] Assistir Karpathy GPT Tokenizer
- [ ] Ler sobre BPE
- [ ] Entender diferenca entre metodos
- [ ] Implementar BPE do zero
- [ ] Treinar em um corpus
- [ ] Testar encode/decode

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[backpropagation]]
>
> **Proximo passo:** Aprenda como tokens viram vetores em [[embeddings-texto]]
