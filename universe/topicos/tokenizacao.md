---
titulo: "Tokenizacao"
tags: ["nlp", "preprocessamento", "bpe", "texto", "vocabulario"]
prerequisitos: ["embeddings-texto"]
nivel: "intermediario"
tempoEstimado: 90
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Tokenizacao

**Teoria:** BPE (Byte Pair Encoding), vocabulario, tokens vs caracteres

**Pratica:** Implementar tokenizer BPE do zero

> **Pode ser feito em paralelo com [[transformer]].** E mais sutil do que parece.

---

## Papers Fundamentais

- **Sennrich, Haddow & Birch (2016) - BPE for NMT** - Adaptacao do algoritmo de compressao para traducao
  - [arxiv.org/abs/1508.07909](http://arxiv.org/abs/1508.07909)

- **Kudo & Richardson (2018) - SentencePiece** - Tokenizacao language-independent, sem pre-tokenizacao
  - [arxiv.org/abs/1808.06226](http://arxiv.org/abs/1808.06226)

- **Kudo (2018) - Unigram Model** - Alternativa ao BPE: comeca grande e trima por loss
  - [arxiv.org/abs/1804.10959](http://arxiv.org/abs/1804.10959)

---

## Videos e Tutoriais

- **Karpathy - Let's build the GPT Tokenizer** - Video dedicado so a tokenizacao
  - [youtube.com/watch?v=zduSFxRajkE](http://youtube.com/watch?v=zduSFxRajkE)

- **HuggingFace LLM Course - BPE Chapter** - Implementacao pedagogica completa
  - [huggingface.co/learn/llm-course/en/chapter6/5](http://huggingface.co/learn/llm-course/en/chapter6/5)

- **Sebastian Raschka - BPE From Scratch** - Jupyter notebook standalone imitando tiktoken
  - [sebastianraschka.com/blog/2025/bpe-from-scratch.html](http://sebastianraschka.com/blog/2025/bpe-from-scratch.html)

---

## Codigo de Referencia

- **Karpathy - minbpe** - Implementacao educacional de referencia: BasicTokenizer, RegexTokenizer (GPT-2), GPT4Tokenizer
  - [github.com/karpathy/minbpe](http://github.com/karpathy/minbpe)
  - Inclui `exercise.md` para pratica hands-on

- **HuggingFace Tokenizers Summary** - Comparacao BPE vs WordPiece vs Unigram
  - [huggingface.co/docs/transformers/en/tokenizer_summary](http://huggingface.co/docs/transformers/en/tokenizer_summary)

- **rsennrich/subword-nmt** - Implementacao original dos autores do paper
  - [github.com/rsennrich/subword-nmt](http://github.com/rsennrich/subword-nmt)

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

Seu tokenizer que treina em um corpus e codifica/decodifica texto.

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

> **Fundamento:** Este topico usa conceitos de [[embeddings-texto]]
>
> **Paralelo:** Pode ser feito junto com [[transformer]]
>
> **Proximo passo:** Integre tudo em [[seu-gpt]]
