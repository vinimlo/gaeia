---
titulo: "Transformer Completo"
tags: ["transformer", "arquitetura", "nlp", "encoder-decoder", "multi-head-attention", "layer-norm"]
prerequisitos: ["self-attention"]
nivel: "avancado"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# O Transformer Completo

**Teoria:** Multi-head attention, layer norm, residual connections, positional encoding

**Pratica:** Montar um bloco Transformer completo

> Cada componente e simples isolado. A arquitetura e a composicao deles.

---

## Papers Originais dos Componentes

- **Ba, Kiros & Hinton (2016) - Layer Normalization** - Normaliza por features (nao batch), consistente em train/test
  - [arxiv.org/abs/1607.06450](http://arxiv.org/abs/1607.06450)

- **He et al. (2016) - Deep Residual Learning (ResNet)** - Skip connections que permitiram treinar 152+ camadas
  - [arxiv.org/abs/1512.03385](http://arxiv.org/abs/1512.03385)

---

## Implementacoes Anotadas

- **Harvard NLP - The Annotated Transformer** - ~400 linhas de PyTorch intercaladas com texto do paper, Jupyter notebook executavel (atualizado 2022)
  - [nlp.seas.harvard.edu/annotated-transformer](http://nlp.seas.harvard.edu/annotated-transformer)
  - [github.com/harvardnlp/annotated-transformer](http://github.com/harvardnlp/annotated-transformer)

- **Karpathy - build-nanogpt** - Video de 4h construindo GPT-2 de um arquivo vazio, commits limpos
  - [github.com/karpathy/build-nanogpt](http://github.com/karpathy/build-nanogpt)

- **Karpathy - minGPT** - 3 arquivos, prioriza educacao sobre performance
  - [github.com/karpathy/minGPT](http://github.com/karpathy/minGPT)

- **Dive into Deep Learning - Attention Mechanisms** - Multi-framework (PyTorch, JAX, TF)
  - [d2l.ai/chapter_attention-mechanisms-and-transformers](http://d2l.ai/chapter_attention-mechanisms-and-transformers)

---

## Positional Encoding Deep Dive

- **Amirhossein Kazemnejad** - Explicacao mais profunda de por que funcoes sinusoidais funcionam, com interpretacao geometrica
  - [kazemnejad.com/blog/transformer_architecture_positional_encoding](http://kazemnejad.com/blog/transformer_architecture_positional_encoding)
  - Propriedades chave:
    - Generaliza para sequencias maiores que o treino
    - Dot products refletem distancia relativa
    - Dimensoes baixas capturam estrutura global

---

## Entregavel

Um bloco Transformer funcional em NumPy/PyTorch.

Dados entram, passam por attention + feed-forward + norm, saem transformados.

---

## Checklist

- [ ] Entender multi-head attention
- [ ] Implementar layer normalization
- [ ] Implementar residual connections
- [ ] Implementar positional encoding
- [ ] Montar bloco transformer completo
- [ ] Testar com sequencias de exemplo

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[self-attention]]
>
> **Paralelo:** [[tokenizacao]] pode ser feito em paralelo - e independente do Transformer
>
> **Proximo passo:** Integre tudo em [[seu-gpt]]
