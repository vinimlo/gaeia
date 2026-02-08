---
titulo: "Loss e Derivadas"
tags: ["fundamentos", "matematica", "calculo", "otimizacao", "loss", "gradiente"]
prerequisitos: ["mlp-e-matrizes"]
nivel: "intermediario"
tempoEstimado: 120
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Loss, Derivadas e o Por Que do Treinamento

**Teoria:** Derivadas (revisao), conceito de loss function, gradiente como direcao

**Pratica:** Implementar MSE e cross-entropy, calcular loss do MLP

> "O modelo chutou X, a resposta era Y, quao errado ele esta?" Derivadas entram porque voce precisa saber *em que direcao ajustar* para errar menos.

---

## Videos Fundamentais

- **3Blue1Brown - Essence of Calculus** - Derivadas e regra da cadeia com visualizacoes
  - [youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr](https://youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr)

---

## Leituras e Tutoriais

- **Deep Learning Book (Goodfellow) - Cap. 4** - Diferenciacao e algebra tensorial
  - [deeplearningbook.org](https://deeplearningbook.org)

- **"The Gradient: A Visual Descent"** - Melhor explicacao visual: gradiente como generalizacao n-dimensional da derivada
  - [thelaziestprogrammer.com/sharrington/math-of-machine-learning/the-gradient-a-visual-descent](https://thelaziestprogrammer.com/sharrington/math-of-machine-learning/the-gradient-a-visual-descent)

- **Rohan Varma - Loss Functions** - Demonstra matematicamente por que cross-entropy aprende mais rapido que MSE para classificacao
  - [rohanvarma.me/Loss-Functions](https://rohanvarma.me/Loss-Functions)

- **Neural Network in 100 Lines** - Implementa cross-entropy com log-sum-exp trick para estabilidade numerica
  - [papers-100-lines.medium.com/neural-network-from-scratch-in-100-lines-of-python-da89a0ce9b03](https://papers-100-lines.medium.com/neural-network-from-scratch-in-100-lines-of-python-da89a0ce9b03)

---

## Ferramentas Interativas

- **Desmos Calculator** - Plote funcoes e derivadas com sliders para explorar mudancas de parametros
  - [desmos.com/calculator](https://desmos.com/calculator)
  - Pre-built: [Visualizing Derivatives](https://desmos.com/calculator/qhks6uqi7a) | [Intro to Derivatives](https://desmos.com/calculator/5nbrcsw4j2)

---

## Insight Chave

**MSE para regressao, Cross-Entropy para classificacao.**

O termo sigma'(z) nos gradientes do MSE causa aprendizado lento quando neuronios saturam. A curva de custo mais ingreme da cross-entropy previne que o modelo fique preso quando predicoes estao muito erradas.

---

## Entregavel

Seu MLP do bloco anterior agora tem dados COM labels (crie pontos 2D sinteticos com classes 0/1) e calcula o loss.

Implemente **MSE** e **Cross-Entropy**. Compare os valores para o mesmo input.

**Gradient check:** Perturbe um peso em `+0.001`, recalcule o loss, e compare `(loss_novo - loss_original) / 0.001` com a derivada analitica. A diferenca deve ser `< 1e-5`.

**Voce deve conseguir explicar:** "Se eu mexer nesse peso um pouquinho pra cima, o loss sobe ou desce?" — e verificar numericamente.

---

## Checklist

- [ ] Revisar derivadas com 3Blue1Brown
- [ ] Entender gradiente como direcao
- [ ] Implementar MSE
- [ ] Implementar Cross-Entropy
- [ ] Calcular loss do MLP
- [ ] Entender quando usar cada loss

---

## Conexoes

> **Fundamento:** Este topico usa conceitos de [[mlp-e-matrizes]]
>
> **Proximo passo:** Aprenda a propagar gradientes em [[backpropagation]]
