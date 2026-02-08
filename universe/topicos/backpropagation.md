---
titulo: "Backpropagation"
tags: ["fundamentos", "neural", "gradientes", "otimizacao", "regra-da-cadeia", "computational-graph"]
prerequisitos: ["loss-e-derivadas"]
nivel: "intermediario"
tempoEstimado: 420
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Backpropagation (Marco Critico)

**Teoria:** Regra da cadeia em profundidade, derivadas parciais, computational graph, otimizadores

**Pratica:** Implementar backprop na mao para seu MLP

> **Esse e o topico mais denso. Nao apresse.** A regra da cadeia e *a essencia* de como redes neurais aprendem.

---

## Videos Fundamentais

- **Karpathy - micrograd (video completo)** - Autograd engine do zero, 2h30 de ouro puro (assista o video COMPLETO desta vez - voce viu o inicio em [[neuronio-e-vetores]])
  - [youtube.com/watch?v=VMj-3S1tku0](https://youtube.com/watch?v=VMj-3S1tku0)

- **3Blue1Brown - Backpropagation** - Visualizacao da propagacao de gradientes
  - [3blue1brown.com/lessons/backpropagation](https://3blue1brown.com/lessons/backpropagation)

---

## Leituras e Tutoriais

- **CS231n - Backpropagation Notes** - Backprop como "backward flow in real-valued circuits", gate communication (add distributes, multiply swaps)
  - [cs231n.github.io/optimization-2](https://cs231n.github.io/optimization-2)

- **CS231n - Optimization Notes** - Gradient descent, learning rate, SGD, momentum, Adam - tudo que falta entre "calcular gradiente" e "atualizar pesos"
  - [cs231n.github.io/neural-networks-3](https://cs231n.github.io/neural-networks-3)

- **Colah - Calculus on Computational Graphs** - Diagramas excelentes de forward e reverse-mode differentiation
  - [colah.github.io/posts/2015-08-Backprop](https://colah.github.io/posts/2015-08-Backprop)

- **Rumelhart, Hinton & Williams (1986)** - Paper original de backpropagation na Nature (3 paginas historicas)
  - [nature.com/articles/323533a0](https://nature.com/articles/323533a0)

---

## Exercicios de Calculo Manual

- **Matt Mazur - Step by Step Backprop Example** - Walkthrough numerico completo com valores reais de pesos
  - [mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example](https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example)

- **A Not So Random Walk - Backprop with Numbers** - Rede 3-2-2 com formulas derivadas do basico
  - [anotsorandomwalk.com/backpropagation-example-with-numbers-step-by-step](https://anotsorandomwalk.com/backpropagation-example-with-numbers-step-by-step)

- **Prof. Tom Yeh - AI by Hand (Spreadsheet)** - Calcule backprop em celulas do Excel
  - [byhand.ai/p/backpropagation-spreadsheet](https://byhand.ai/p/backpropagation-spreadsheet)

---

## Ferramentas e Codigo

- **TensorFlow Playground** - Veja pesos e aprendizado em tempo real
  - [playground.tensorflow.org](https://playground.tensorflow.org)

- **jaymody/backpropagation** - Implementacao limpa e minima focada em entendimento
  - [github.com/jaymody/backpropagation](https://github.com/jaymody/backpropagation)

---

## Otimizadores e Update de Pesos

Backprop calcula os gradientes, mas **como exatamente voce atualiza os pesos?**

- **Gradient Descent (vanilla):** `w = w - lr * grad`. Simples, mas sensivel ao learning rate.
- **SGD (Stochastic Gradient Descent):** Atualiza com mini-batches ao inves do dataset inteiro. Mais ruidoso, mas muito mais rapido.
- **Adam:** Combina momentum (media movel dos gradientes) com RMSprop (media movel dos gradientes ao quadrado). O otimizador padrao para a maioria dos projetos - e o que voce vai usar em [[seu-gpt]].

O **learning rate** e o hyperparametro mais importante: muito alto e o treino diverge, muito baixo e nunca converge.

---

## Mecanica do Treino

O loop de treinamento completo que conecta tudo:

1. **Forward pass:** dados entram, predicoes saem
2. **Loss:** compara predicoes com labels reais
3. **Backward pass:** calcula gradientes via backprop
4. **Update:** aplica otimizador para ajustar pesos
5. **Repita**

Conceitos essenciais:
- **Epoch:** uma passada completa por todo o dataset
- **Batch:** subconjunto dos dados processado de uma vez
- **Monitorar loss:** se o loss de treino desce mas o de validacao sobe, voce esta em overfitting

---

## Insight Chave

**Backprop e "so" a regra da cadeia aplicada recursivamente.** Cada no no computational graph recebe o gradiente de cima (como sua saida afeta o loss) e passa pra baixo (como seus inputs afetam sua saida). A elegancia e que cada no so precisa de informacao local - nao precisa "saber" sobre o resto da rede. Isso e o que torna o treinamento de redes profundas computacionalmente viavel.

---

## Entregavel

**Parte 1 (obrigatoria):** Calcule manualmente o backprop para uma rede de 2 inputs, 2 neuronios ocultos, 1 output, usando o walkthrough do Matt Mazur. Faca no papel ou planilha.

**Parte 2:** Seu MLP agora **treina**: Forward → Loss → Backward → Update. Implemente backprop **sem autograd** — escreva as derivadas manualmente para cada camada.

**Alvo:** Faca-o aprender XOR. Apos treinamento, deve acertar todas as 4 saidas com loss `< 0.01`.

**Voce deve conseguir explicar:** Por que cada no so precisa de informacao local para calcular seu gradiente.

---

## Checklist

- [ ] Assistir Karpathy micrograd completo
- [ ] Assistir 3Blue1Brown backpropagation
- [ ] Ler CS231n backprop notes
- [ ] Ler CS231n optimization notes
- [ ] Fazer exercicio do Matt Mazur no papel
- [ ] Implementar backprop no MLP
- [ ] Implementar training loop com SGD
- [ ] Treinar em XOR
- [ ] Verificar que loss diminui

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[loss-e-derivadas]]
>
> **Proximo passo:** Aprenda como texto e dividido em tokens em [[tokenizacao]]
