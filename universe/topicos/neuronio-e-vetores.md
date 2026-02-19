---
titulo: "Neurônio e Vetores"
tags: ["fundamentos", "matematica", "neural", "algebra-linear", "dot-product"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Neurônio e Vetores

**Teoria:** Vetores, dot product, operações básicas de algebra linear

**Pratica:** Implementar um neurônio unico em NumPy puro

> A motivacao é concreta desde o minuto um: voce aprende dot product *porque precisa dele* para fazer o neurônio funcionar.

---

## Videos Fundamentais

- **3Blue1Brown - Essence of Linear Algebra (eps 1-4)** - Vetores, combinacoes lineares, transformacoes
  - [youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab](https://youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

- **3Blue1Brown - Dot Products and Duality** - Conexao profunda entre dot product e transformacoes lineares
  - [3blue1brown.com/lessons/dot-products](https://3blue1brown.com/lessons/dot-products)

- **Karpathy - Neural Networks: Zero to Hero (inicio do micrograd)** - Primeiro contato com neurônio computacional (assista os primeiros ~30 min)
  - [youtube.com/watch?v=VMj-3S1tku0](https://youtube.com/watch?v=VMj-3S1tku0)

---

## Leituras e Tutoriais

- **BetterExplained - "Understanding the Dot Product"** - Melhor modelo mental: dot product como "multiplicacao direcional" (analogia do painel solar)
  - [betterexplained.com/articles/vector-calculus-understanding-the-dot-product](https://betterexplained.com/articles/vector-calculus-understanding-the-dot-product)

- **Pablo Insente - Linear Algebra for Applied ML** - Cada operacao pareada com codigo NumPy
  - [pabloinsente.github.io/intro-linear-algebra](https://pabloinsente.github.io/intro-linear-algebra)

- **"9 Lines of Python" Neural Network** - Ponto de partida mais minimalista possivel com sigmoid
  - [medium.com/technology-invention-and-more/how-to-build-a-simple-neural-network-in-9-lines-of-python-code-cc8f23647ca1](https://medium.com/technology-invention-and-more/how-to-build-a-simple-neural-network-in-9-lines-of-python-code-cc8f23647ca1)

---

## Ferramentas Interativas

- **Immersive Linear Algebra** - Textbook interativo gratuito com diagramas 3D manipulaveis
  - [immersivemath.com](https://immersivemath.com)

- **GeoGebra - Geometric Interpretation** - Arraste vetores e veja projecoes em tempo real
  - [geogebra.org/m/gTs4bMs2](https://geogebra.org/m/gTs4bMs2)

- **Georgia Tech Interactive Linear Algebra** - Applets embutidos de sistemas ate autovalores
  - [textbooks.math.gatech.edu/ila](https://textbooks.math.gatech.edu/ila)

---

## Insight Chave

**Um neurônio é um classificador linear.** O dot product `w·x` mede o quanto o input se alinha com os pesos - geometricamente, é uma projeção. O bias desloca a fronteira de decisao, e a sigmoid "esmaga" o resultado em uma probabilidade entre 0 e 1. Com um neurônio, voce so consegue separar dados com uma linha reta. Para resolver problemas nao-lineares como XOR, voce precisa empilhar neurônios - que e exatamente o proximo topico.

---

## Entregavel

Um neurônio em NumPy que recebe inputs, multiplica por pesos, soma bias, aplica sigmoid, e retorna output.

**Sanity check:** Com inputs `[1, 0.5]`, pesos `[0.7, -0.3]`, bias `0.1`, seu neurônio deve retornar `~0.5987`.

**Teste:** Execute com 3 pares de inputs diferentes e observe como mudar os pesos muda o output.

**Voce deve conseguir explicar:** O que o dot product esta fazendo geometricamente ali — escreva 2-3 linhas de comentario no codigo.

---

## Checklist

- [x] Assistir 3Blue1Brown eps 1-4
- [x] Ler BetterExplained sobre dot product
- [ ] Experimentar com GeoGebra
- [ ] Implementar neurônio em NumPy
- [ ] Explicar dot product geometricamente

---

## Conexoes

> **Proximo passo:** Entenda como empilhar neurônios em camadas em [[mlp-e-matrizes]]
