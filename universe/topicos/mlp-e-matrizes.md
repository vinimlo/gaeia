---
titulo: "MLP e Matrizes"
tags: ["fundamentos", "matematica", "neural", "matrizes", "forward-pass", "broadcasting"]
prerequisitos: ["neuronio-e-vetores"]
nivel: "iniciante"
tempoEstimado: 60
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Forward Pass e Matrizes

**Teoria:** Multiplicacao de matrizes, broadcasting, transpostas

**Pratica:** Empilhar neuronios em camadas - primeira MLP com forward pass

> Um neuronio e um dot product. Uma camada e uma multiplicacao de matrizes. Voce sente *na implementacao* por que matrizes existem.

---

## Videos Fundamentais

- **3Blue1Brown - eps 5-7** - Multiplicacao de matrizes como composicao de transformacoes
  - [3blue1brown.com/lessons/matrix-multiplication](http://3blue1brown.com/lessons/matrix-multiplication)

- **Karpathy - micrograd (continuacao)** - Construindo operacoes em grafos computacionais

---

## Leituras e Tutoriais

- **Jake VanderPlas - Python Data Science Handbook (Broadcasting)** - As 3 regras de broadcasting com analogia de "stretching"
  - [jakevdp.github.io/PythonDataScienceHandbook/02.05](http://jakevdp.github.io/PythonDataScienceHandbook/02.05)

- **NumPy Official - Broadcasting Rules** - Definicoes autoritativas com tabelas de compatibilidade
  - [numpy.org/doc/stable/user/basics.broadcasting.html](http://numpy.org/doc/stable/user/basics.broadcasting.html)

- **Gregory Gundersen - Matrix Intuition** - Determinantes como escala de area, rank como dimensionalidade
  - [gregorygundersen.com/blog/2018/10/24/matrices](http://gregorygundersen.com/blog/2018/10/24/matrices)

- **ML From Scratch - Neural Network Tutorial** - MLP com MNIST focando forward pass como "dot + activation"
  - [mlfromscratch.com/neural-network-tutorial](http://mlfromscratch.com/neural-network-tutorial)

---

## Ferramentas Interativas

- **Math is Fun - Transformation Matrices** - Applet interativo com rotacao, reflexao, escala
  - [mathsisfun.com/algebra/matrix-transform.html](http://mathsisfun.com/algebra/matrix-transform.html)

---

## Entregavel

MLP com 2+ camadas que faz forward pass em NumPy. Dados entram, passam por camadas, saem predicoes.

**Sem treinar ainda** - so o fluxo pra frente.

---

## Checklist

- [ ] Assistir 3Blue1Brown eps 5-7
- [ ] Ler sobre broadcasting no NumPy
- [ ] Entender multiplicacao de matrizes como composicao
- [ ] Implementar MLP com forward pass
- [ ] Testar com dados de exemplo

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[neuronio-e-vetores]]
>
> **Proximo passo:** Entenda como medir o erro em [[loss-e-derivadas]]
