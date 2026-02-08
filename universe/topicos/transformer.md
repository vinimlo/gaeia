---
titulo: "Transformer Completo"
tags: ["transformer", "arquitetura", "nlp", "encoder-decoder", "multi-head-attention", "layer-norm", "feed-forward"]
prerequisitos: ["self-attention"]
nivel: "avancado"
tempoEstimado: 300
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# O Transformer Completo

**Teoria:** Multi-head attention, layer norm, residual connections, positional encoding, feed-forward sublayer

**Pratica:** Montar um bloco Transformer completo

> Cada componente e simples isolado. A arquitetura e a composicao deles.

---

## Papers Originais dos Componentes

- **Ba, Kiros & Hinton (2016) - Layer Normalization** - Normaliza por features (nao batch), consistente em train/test
  - [arxiv.org/abs/1607.06450](https://arxiv.org/abs/1607.06450)

- **He et al. (2016) - Deep Residual Learning (ResNet)** - Skip connections que permitiram treinar 152+ camadas
  - [arxiv.org/abs/1512.03385](https://arxiv.org/abs/1512.03385)

---

## Implementacoes Anotadas

- **Harvard NLP - The Annotated Transformer** - ~400 linhas de PyTorch intercaladas com texto do paper, Jupyter notebook executavel (atualizado 2022)
  - [nlp.seas.harvard.edu/annotated-transformer](https://nlp.seas.harvard.edu/annotated-transformer)
  - [github.com/harvardnlp/annotated-transformer](https://github.com/harvardnlp/annotated-transformer)

- **Karpathy - build-nanogpt** - Video de 4h construindo GPT-2 de um arquivo vazio, commits limpos
  - [github.com/karpathy/build-nanogpt](https://github.com/karpathy/build-nanogpt)

- **Karpathy - minGPT** - 3 arquivos, prioriza educacao sobre performance
  - [github.com/karpathy/minGPT](https://github.com/karpathy/minGPT)

- **Dive into Deep Learning - Attention Mechanisms** - Multi-framework (PyTorch, JAX, TF)
  - [d2l.ai/chapter_attention-mechanisms-and-transformers](https://d2l.ai/chapter_attention-mechanisms-and-transformers)

---

## Positional Encoding Deep Dive

- **Amirhossein Kazemnejad** - Explicacao mais profunda de por que funcoes sinusoidais funcionam, com interpretacao geometrica
  - [kazemnejad.com/blog/transformer_architecture_positional_encoding](https://kazemnejad.com/blog/transformer_architecture_positional_encoding)
  - Propriedades chave:
    - Generaliza para sequencias maiores que o treino
    - Dot products refletem distancia relativa
    - Dimensoes baixas capturam estrutura global

---

## Feed-Forward Sublayer

Cada bloco Transformer tem dois sublayers: **attention** e **feed-forward**. O feed-forward e surpreendentemente simples:

```
FFN(x) = Linear(GELU(Linear(x)))
```

A primeira camada linear expande a dimensao por um fator de **4x** (ex: 768 → 3072), aplica uma ativacao (GELU nos GPTs), e a segunda camada projeta de volta para a dimensao original (3072 → 768).

Por que expandir e comprimir? A attention captura *relacoes entre tokens*. O feed-forward processa cada token *individualmente*, dando a rede capacidade de transformar representacoes. Pesquisas recentes sugerem que os feed-forward layers funcionam como "memorias" que armazenam conhecimento factual.

---

## Insight Chave

**Residual connections sao o que tornam redes profundas possiveis.** Ao somar `x + sublayer(x)` ao inves de so `sublayer(x)`, voce cria um "atalho" para os gradientes fluirem direto ate as primeiras camadas. Sem isso, gradientes morrem exponencialmente com a profundidade. Layer norm estabiliza as magnitudes em cada camada. Juntos, eles permitem empilhar dezenas (ou centenas) de blocos Transformer.

---

## Entregavel

Um bloco Transformer em **PyTorch** (`nn.Module`) com: 4 cabecas de atencao, dimensao 64, feed-forward de 256. Este e o momento de migrar para PyTorch.

**Teste de shapes:** Input `(batch=2, seq=8, dim=64)` → output deve ter o mesmo shape.

**Teste de corretude:** Compare a saida do seu bloco com `nn.TransformerEncoderLayer` do PyTorch usando os mesmos pesos. Diferenca deve ser `< 1e-5`.

**Smoke test:** Empilhe 2 blocos, conecte com embedding layer + linear head, faca um forward pass no Tiny Shakespeare. Nao precisa treinar — so verificar que os tensores fluem.

**Voce deve conseguir explicar:** O que acontece com os gradientes sem residual connections.

---

## Checklist

- [ ] Entender multi-head attention
- [ ] Implementar layer normalization
- [ ] Implementar residual connections
- [ ] Implementar positional encoding
- [ ] Implementar feed-forward sublayer
- [ ] Montar bloco transformer completo
- [ ] Testar com sequencias de exemplo

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[self-attention]]
>
> **Proximo passo:** Integre tudo em [[seu-gpt]]
