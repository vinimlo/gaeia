---
titulo: "Neuronio e Vetores"
tags: ["fundamentos", "matematica", "neural", "algebra-linear", "dot-product"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 60
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Neuronio e Vetores

**Teoria:** Vetores, dot product, operacoes basicas de algebra linear

**Pratica:** Implementar um neuronio unico em NumPy puro

> A motivacao e concreta desde o minuto um: voce aprende dot product *porque precisa dele* para fazer o neuronio funcionar.

---

## Videos Fundamentais

- **3Blue1Brown - Essence of Linear Algebra (eps 1-4)** - Vetores, combinacoes lineares, transformacoes
  - [youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab](http://youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

- **3Blue1Brown - Dot Products and Duality** - Conexao profunda entre dot product e transformacoes lineares
  - [3blue1brown.com/lessons/dot-products](http://3blue1brown.com/lessons/dot-products)

- **Karpathy - Neural Networks: Zero to Hero (inicio do micrograd)** - Primeiro contato com neuronio computacional
  - [youtube.com/watch?v=VMj-3S1tku0](http://youtube.com/watch?v=VMj-3S1tku0)

---

## Leituras e Tutoriais

- **BetterExplained - "Understanding the Dot Product"** - Melhor modelo mental: dot product como "multiplicacao direcional" (analogia do painel solar)
  - [betterexplained.com/articles/vector-calculus-understanding-the-dot-product](http://betterexplained.com/articles/vector-calculus-understanding-the-dot-product)

- **Pablo Insente - Linear Algebra for Applied ML** - Cada operacao pareada com codigo NumPy
  - [pabloinsente.github.io/intro-linear-algebra](http://pabloinsente.github.io/intro-linear-algebra)

- **"9 Lines of Python" Neural Network** - Ponto de partida mais minimalista possivel com sigmoid
  - [medium.com/technology-invention-and-more](http://medium.com/technology-invention-and-more)

---

## Ferramentas Interativas

- **Immersive Linear Algebra** - Textbook interativo gratuito com diagramas 3D manipulaveis
  - [immersivemath.com](http://immersivemath.com)

- **GeoGebra - Geometric Interpretation** - Arraste vetores e veja projecoes em tempo real
  - [geogebra.org/m/gTs4bMs2](http://geogebra.org/m/gTs4bMs2)

- **Georgia Tech Interactive Linear Algebra** - Applets embutidos de sistemas ate autovalores
  - [textbooks.math.gatech.edu/ila](http://textbooks.math.gatech.edu/ila)

---

## Entregavel

Um neuronio que recebe inputs, multiplica por pesos, soma bias, aplica sigmoid, e retorna output.

**Voce deve conseguir explicar:** O que o dot product esta fazendo geometricamente ali.

---

## Checklist

- [ ] Assistir 3Blue1Brown eps 1-4
- [ ] Ler BetterExplained sobre dot product
- [ ] Experimentar com GeoGebra
- [ ] Implementar neuronio em NumPy
- [ ] Explicar dot product geometricamente

---

## Conexoes

> **Proximo passo:** Entenda como empilhar neuronios em camadas em [[mlp-e-matrizes]]
