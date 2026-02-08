---
titulo: "Seu GPT"
tags: ["projeto", "gpt", "transformer", "implementacao", "decoder-only", "autoregressive"]
prerequisitos: ["transformer", "tokenizacao"]
nivel: "avancado"
tempoEstimado: 300
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Seu GPT (Entregavel Final)

**Teoria:** Decoder-only architecture, autoregressive generation

**Pratica:** Juntar tokenizer + transformer blocks + training loop + geracao

---

## Papers Fundamentais

- **GPT-1 (2018) - "Improving Language Understanding by Generative Pre-Training"** - 12 layers, 768 dims, 12 heads, ~117M params
  - [cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)

- **GPT-2 (2019) - "Language Models are Unsupervised Multitask Learners"** - Byte-level BPE, pre-LayerNorm
  - [cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)

---

## Implementacoes de Referencia

- **Karpathy - nanoGPT** - ~600 linhas que reproduzem GPT-2 (124M) no OpenWebText. Custo: ~$10 e ~1h no Lambda Labs
  - [github.com/karpathy/nanoGPT](https://github.com/karpathy/nanoGPT)

- **Karpathy - build-nanogpt** - Video de 4h + commits limpos para acompanhar passo a passo
  - [github.com/karpathy/build-nanogpt](https://github.com/karpathy/build-nanogpt)

- **jaymody/picoGPT** - Forward pass em 40 linhas de NumPy - inferencia com pesos reais do GPT-2
  - [github.com/jaymody/picoGPT](https://github.com/jaymody/picoGPT)

---

## Hyperparameters de Referencia (nanoGPT 124M)

| Parametro | Valor | O que faz |
|-----------|-------|-----------|
| **Learning rate** | 6e-4 | Tamanho do passo de atualizacao dos pesos. Muito alto = diverge, muito baixo = lento |
| **Weight decay** | 0.1 | Penaliza pesos grandes para evitar overfitting (multiplica pesos por 0.999 cada step) |
| **Warmup** | Linear → cosine decay to 10% | Comeca com lr baixo, sobe linearmente, depois decai suavemente ate 10% do pico |
| **Dropout** | 0.1 | Desliga 10% dos neuronios aleatoriamente durante treino, forcando redundancia |
| **Activation** | GELU | Versao suave do ReLU (voce viu em [[mlp-e-matrizes]]) |
| **Position embeddings** | Learned | Vetores aprendidos (nao sinusoidais) indicando posicao de cada token |

---

## Apple Silicon (MLX)

- **MLX Framework**
  - [github.com/ml-explore/mlx](https://github.com/ml-explore/mlx)
  - [ml-explore.github.io/mlx](https://ml-explore.github.io/mlx)

- **nanoGPT_mlx** - Port direto do nanoGPT para MLX
  - [github.com/vithursant/nanoGPT_mlx](https://github.com/vithursant/nanoGPT_mlx)

---

## Datasets para Treino

| Dataset | Tamanho | Ideal para |
|---------|---------|------------|
| **Tiny Shakespeare** | ~1MB | Experimentos rapidos (incluso no nanoGPT) |
| **TinyStories** | 2.14M historias | Modelos coerentes < 10M params em < 1 dia |

- [huggingface.co/datasets/roneneldan/TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories)

---

## Entregavel Final

**Marco intermediario (antes de treinar):** Faca um forward pass com input aleatorio. Verifique que o loss inicial e `~ln(vocab_size)` (distribuicao uniforme sobre o vocabulario).

**Montagem passo a passo:**
1. Use seu tokenizer (topico 6) para processar Tiny Shakespeare
2. Use seus blocos Transformer (topico 8) empilhados com embedding + head
3. Adapte seu training loop (topico 4) para PyTorch com AdamW
4. Implemente geracao autoregressiva (novo)
5. Treine e avalie

### Tier 1 - Laptop (sem GPU dedicada)
GPT **character-level**, ~1M parametros. Apos 5000 iteracoes, deve gerar texto com palavras reconheciveis em ingles.

### Tier 2 - Com GPU
GPT **token-level** (BPE), ~10-30M parametros. Apos treinamento completo, deve gerar historias de 3-5 frases com coerencia gramatical.

**Voce deve conseguir explicar:** Por que o loss inicial deveria ser aproximadamente `ln(vocab_size)`.

---

## Guia de Hardware e Setup

**Setup PyTorch:**
- **NVIDIA GPU:** `pip install torch` (CUDA ja incluso nas builds oficiais)
- **Apple Silicon:** `pip install torch` (suporte MPS automatico desde PyTorch 2.0)
- **CPU only:** Funciona, mas so viavel para Tier 1

**Tempos estimados de treino:**

| Hardware | Tier 1 (~1M params) | Tier 2 (~10-30M params) |
|----------|---------------------|------------------------|
| MacBook M1/M2 (MPS) | ~5 min | ~3-6h |
| NVIDIA RTX 3090/4090 | ~2 min | ~1-2h |
| Google Colab (T4 free) | ~5 min | ~4-8h |

**Opcoes cloud (se nao tem GPU):**
- **Google Colab** - Gratuito com T4, suficiente para Tier 2
- **Lambda Labs** - ~$1/hr para uma A10G, treina Tier 2 em ~1h

---

## Checklist

- [ ] Revisar topicos anteriores
- [ ] Configurar ambiente PyTorch/MLX
- [ ] Integrar tokenizer + transformer
- [ ] Implementar training loop
- [ ] Escolher dataset e tier
- [ ] Treinar modelo
- [ ] Implementar geracao de texto
- [ ] Avaliar qualidade do texto gerado

---

## Conclusao

**Voce construiu um GPT.** De um unico neuronio com dot product ate um transformer autoregressivo que gera texto - cada peca foi implementada e entendida por voce.

### Proximos passos sugeridos:
- **Fine-tuning:** Adapte seu modelo para uma tarefa especifica
- **Scaling:** Experimente aumentar layers, heads, dimensao - observe o que muda
- **Leia GPT-3/LLaMA papers:** Agora voce tem vocabulario para entender as decisoes de design
- **RLHF/DPO:** Entenda como modelos sao alinhados apos o pre-treino

---

## Conexoes

> **Fundamento:** Este topico integra [[transformer]] e [[tokenizacao]]
>
> **Parabens!** Voce completou a trilha LLM do Zero!
