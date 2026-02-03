---
titulo: "Seu GPT"
tags: ["projeto", "gpt", "transformer", "implementacao", "decoder-only", "autoregressive"]
prerequisitos: ["transformer", "tokenizacao"]
nivel: "avancado"
tempoEstimado: 180
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Seu GPT (Entregavel Final)

**Teoria:** Decoder-only architecture, autoregressive generation

**Pratica:** Juntar tokenizer + transformer blocks + training loop + geracao

---

## Papers Fundamentais

- **GPT-1 (2018) - "Improving Language Understanding by Generative Pre-Training"** - 12 layers, 768 dims, 12 heads, ~117M params
  - [cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf](http://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)

- **GPT-2 (2019) - "Language Models are Unsupervised Multitask Learners"** - Byte-level BPE, pre-LayerNorm
  - [cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf](http://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)

---

## Implementacoes de Referencia

- **Karpathy - nanoGPT** - ~600 linhas que reproduzem GPT-2 (124M) no OpenWebText. Custo: ~$10 e ~1h no Lambda Labs
  - [github.com/karpathy/nanoGPT](http://github.com/karpathy/nanoGPT)

- **Karpathy - build-nanogpt** - Video de 4h + commits limpos para acompanhar passo a passo
  - [github.com/karpathy/build-nanogpt](http://github.com/karpathy/build-nanogpt)

- **jaymody/picoGPT** - Forward pass em 40 linhas de NumPy - inferencia com pesos reais do GPT-2
  - [github.com/jaymody/picoGPT](http://github.com/jaymody/picoGPT)

---

## Hyperparameters de Referencia (nanoGPT 124M)

| Parametro | Valor |
|-----------|-------|
| Learning rate | 6e-4 |
| Weight decay | 0.1 |
| Warmup | Linear -> cosine decay to 10% |
| Dropout | 0.1 |
| Activation | GELU |
| Position embeddings | Learned |

---

## Apple Silicon (MLX)

- **MLX Framework**
  - [github.com/ml-explore/mlx](http://github.com/ml-explore/mlx)
  - [ml-explore.github.io/mlx](http://ml-explore.github.io/mlx)

- **nanoGPT_mlx** - Port direto do nanoGPT para MLX
  - [github.com/vithursant/nanoGPT_mlx](http://github.com/vithursant/nanoGPT_mlx)

---

## Datasets para Treino

| Dataset | Tamanho | Ideal para |
|---------|---------|------------|
| **Tiny Shakespeare** | ~1MB | Experimentos rapidos (incluso no nanoGPT) |
| **TinyStories** | 2.14M historias | Modelos coerentes < 10M params em < 1 dia |

- [huggingface.co/datasets/roneneldan/TinyStories](http://huggingface.co/datasets/roneneldan/TinyStories)

---

## Entregavel Final

Um mini-GPT (~10M-125M parametros) que treina em um corpus e **gera texto coerente**.

Nessa fase, migra pra PyTorch ou MLX por performance - mas voce sabe exatamente o que esta por baixo.

---

## Checklist

- [ ] Revisar topicos anteriores
- [ ] Integrar tokenizer + transformer
- [ ] Implementar training loop
- [ ] Escolher dataset (Tiny Shakespeare ou TinyStories)
- [ ] Treinar modelo
- [ ] Implementar geracao de texto
- [ ] Avaliar qualidade do texto gerado

---

## Conclusao

> **Implementacao ensina o que leitura nao consegue.** Comece cada topico com intuicao visual (3Blue1Brown, TF Playground), passe para precisao matematica (CS231n, papers originais), e solidifique atraves de codigo (repositorios Karpathy, labml.ai).

### Recursos mais subestimados:
- Matt Mazur's numerical backprop walkthrough ([[backpropagation]])
- Kazemnejad's positional encoding deep-dive ([[transformer]])
- minbpe's exercise.md ([[tokenizacao]])

### Para cobertura moderna alem do Goodfellow:
Understanding Deep Learning (2024) e essencial.

### O dataset TinyStories:
Permite treinar modelos coerentes em horas, tornando este topico alcancavel em hardware consumer.

---

## Conexoes

> **Fundamento:** Este topico integra [[transformer]] e [[tokenizacao]]
>
> **Parabens!** Voce completou a trilha LLM do Zero!
