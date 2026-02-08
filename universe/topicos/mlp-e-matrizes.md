---
titulo: "MLP e Matrizes"
tags: ["fundamentos", "matematica", "neural", "matrizes", "forward-pass", "broadcasting", "ativacoes"]
prerequisitos: ["neuronio-e-vetores"]
nivel: "iniciante"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Forward Pass e Matrizes

**Teoria:** Multiplicacao de matrizes, broadcasting, transpostas, funcoes de ativacao

**Pratica:** Empilhar neuronios em camadas - primeira MLP com forward pass

> Um neuronio e um dot product. Uma camada e uma multiplicacao de matrizes. Voce sente *na implementacao* por que matrizes existem.

---

## Videos Fundamentais

- **3Blue1Brown - eps 5-7** - Multiplicacao de matrizes como composicao de transformacoes
  - [3blue1brown.com/lessons/matrix-multiplication](https://3blue1brown.com/lessons/matrix-multiplication)

- **Karpathy - micrograd (continuacao)** - Construindo operacoes em grafos computacionais
  - [github.com/karpathy/micrograd](https://github.com/karpathy/micrograd)

---

## Leituras e Tutoriais

- **Jake VanderPlas - Python Data Science Handbook (Broadcasting)** - As 3 regras de broadcasting com analogia de "stretching"
  - [jakevdp.github.io/PythonDataScienceHandbook/02.05](https://jakevdp.github.io/PythonDataScienceHandbook/02.05)

- **NumPy Official - Broadcasting Rules** - Definicoes autoritativas com tabelas de compatibilidade
  - [numpy.org/doc/stable/user/basics.broadcasting.html](https://numpy.org/doc/stable/user/basics.broadcasting.html)

- **Gregory Gundersen - Matrix Intuition** - Determinantes como escala de area, rank como dimensionalidade
  - [gregorygundersen.com/blog/2018/10/24/matrices](https://gregorygundersen.com/blog/2018/10/24/matrices)

- **ML From Scratch - Neural Network Tutorial** - MLP com MNIST focando forward pass como "dot + activation"
  - [mlfromscratch.com/neural-network-tutorial](https://mlfromscratch.com/neural-network-tutorial)

- **CS231n - Neural Networks Part 1** - Explicacao completa de funcoes de ativacao e arquitetura de redes
  - [cs231n.github.io/neural-networks-1](https://cs231n.github.io/neural-networks-1)

---

## Ferramentas Interativas

- **Math is Fun - Transformation Matrices** - Applet interativo com rotacao, reflexao, escala
  - [mathsisfun.com/algebra/matrix-transform.html](https://mathsisfun.com/algebra/matrix-transform.html)

---

## Insight Chave

**Por que funcoes de ativacao sao essenciais:** Se voce empilhar camadas lineares sem ativacao, o resultado e... outra transformacao linear. Matematicamente, `W2(W1·x) = W3·x` - nao importa quantas camadas, a rede so consegue aprender funcoes lineares. A ativacao (sigmoid, ReLU, etc.) quebra essa linearidade e permite que a rede aprenda fronteiras curvas e padroes complexos.

- **Sigmoid:** `1/(1+e^-x)` - voce ja usou no neuronio. Esmaga em [0,1], mas sofre de gradientes que somem nas extremidades.
- **ReLU:** `max(0, x)` - simples e eficiente, domina redes modernas. Gradiente e 0 ou 1, sem saturacao.
- **GELU:** Versao suave do ReLU usada em GPTs (voce vai reencontrar em [[seu-gpt]]).

---

## Entregavel

MLP com arquitetura `[3, 4, 2]` (3 inputs, camada oculta de 4 neuronios com ReLU, saida de 2 com sigmoid) em NumPy.

**Verificacao de shapes:** Imprima o shape de cada ativacao intermediaria. Se input e `(5, 3)`, apos W1 `(3, 4)` voce deve ter `(5, 4)`.

**Sem treinar ainda** — so o fluxo pra frente.

**Voce deve conseguir explicar:** Por que sem funcao de ativacao, empilhar camadas nao ajuda.

---

## Checklist

- [ ] Assistir 3Blue1Brown eps 5-7
- [ ] Ler sobre broadcasting no NumPy
- [ ] Entender multiplicacao de matrizes como composicao
- [ ] Entender por que ativacoes sao necessarias
- [ ] Implementar MLP com forward pass
- [ ] Testar com dados de exemplo

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[neuronio-e-vetores]]
>
> **Proximo passo:** Entenda como medir o erro em [[loss-e-derivadas]]
