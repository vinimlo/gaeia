---
titulo: "Backpropagation"
tags: ["fundamentos", "neural", "gradientes", "otimizacao", "regra-da-cadeia", "computational-graph"]
prerequisitos: ["loss-e-derivadas"]
nivel: "intermediario"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Backpropagation (Marco Critico)

**Teoria:** Regra da cadeia em profundidade, derivadas parciais, computational graph

**Pratica:** Implementar backprop na mao para seu MLP

> **Esse e o topico mais denso. Nao apresse.** A regra da cadeia e *a essencia* de como redes neurais aprendem.

---

## Videos Fundamentais

- **Karpathy - micrograd (video completo)** - Autograd engine do zero, 2h30 de ouro puro
  - [youtube.com/watch?v=VMj-3S1tku0](http://youtube.com/watch?v=VMj-3S1tku0)

- **3Blue1Brown - Backpropagation** - Visualizacao da propagacao de gradientes
  - [3blue1brown.com/lessons/backpropagation](http://3blue1brown.com/lessons/backpropagation)

---

## Leituras e Tutoriais

- **CS231n - Backpropagation Notes** - Backprop como "backward flow in real-valued circuits", gate communication (add distributes, multiply swaps)
  - [cs231n.github.io/optimization-2](http://cs231n.github.io/optimization-2)

- **Colah - Calculus on Computational Graphs** - Diagramas excelentes de forward e reverse-mode differentiation
  - [colah.github.io/posts/2015-08-Backprop](http://colah.github.io/posts/2015-08-Backprop)

- **Rumelhart, Hinton & Williams (1986)** - Paper original de backpropagation na Nature (3 paginas historicas)
  - [nature.com/articles/323533a0](http://nature.com/articles/323533a0)

---

## Exercicios de Calculo Manual

- **Matt Mazur - Step by Step Backprop Example** - Walkthrough numerico completo com valores reais de pesos
  - [mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example](http://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example)

- **A Not So Random Walk - Backprop with Numbers** - Rede 3-2-2 com formulas derivadas do basico
  - [anotsorandomwalk.com/backpropagation-example-with-numbers-step-by-step](http://anotsorandomwalk.com/backpropagation-example-with-numbers-step-by-step)

- **Prof. Tom Yeh - AI by Hand (Spreadsheet)** - Calcule backprop em celulas do Excel
  - [byhand.ai/p/backpropagation-spreadsheet](http://byhand.ai/p/backpropagation-spreadsheet)

---

## Ferramentas e Codigo

- **TensorFlow Playground** - Veja pesos e aprendizado em tempo real
  - [playground.tensorflow.org](http://playground.tensorflow.org)

- **jaymody/backpropagation** - Implementacao limpa e minima focada em entendimento
  - [github.com/jaymody/backpropagation](http://github.com/jaymody/backpropagation)

---

## Entregavel

Seu MLP agora **treina**: Forward -> Loss -> Backward -> Update Weights.

Faca ele aprender XOR ou algum pattern simples.

**Bonus:** Calcule um backprop pequeno no papel antes de codar.

---

## Checklist

- [ ] Assistir Karpathy micrograd completo
- [ ] Assistir 3Blue1Brown backpropagation
- [ ] Ler CS231n notes
- [ ] Fazer exercicio do Matt Mazur no papel
- [ ] Implementar backprop no MLP
- [ ] Treinar em XOR
- [ ] Verificar que loss diminui

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[loss-e-derivadas]]
>
> **Proximo passo:** Aprenda como texto vira numeros em [[embeddings-texto]]
