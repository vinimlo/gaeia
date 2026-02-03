---
titulo: "Bias e Fairness em IA"
tags: ["bias", "fairness", "etica"]
prerequisitos: []
nivel: "intermediario"
tempoEstimado: 50
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Bias e Fairness em IA

Bias (vies) e Fairness (equidade) em IA referem-se aos desafios de garantir que modelos de machine learning nao produzam resultados discriminatorios ou enviesados. Esta e uma das areas mais criticas da etica em IA.

## O que e Bias em IA?

Bias em IA ocorre quando um sistema produz resultados sistematicamente preconceituosos ou injustos para certos grupos. Isso pode acontecer devido a:

### Fontes de Bias

1. **Dados de Treinamento Desbalanceados**
   - Sub-representacao de certos grupos demograficos
   - Dados historicos que refletem preconceitos passados

2. **Pressupostos Falhos**
   - Variaveis proxy que correlacionam com caracteristicas protegidas
   - Definicoes de "sucesso" que favorecem certos grupos

3. **Algoritmos Enviesados**
   - Funcoes de otimizacao que amplificam desigualdades
   - Falta de restricoes de fairness no treinamento

## Tipos de Bias

### Selection Bias
Quando os dados de treinamento nao representam adequadamente a populacao alvo.

```python
# Exemplo: Dataset de contratacao historica
# Se historicamente so homens foram contratados,
# o modelo aprendera a preferir candidatos homens
```

### Measurement Bias
Quando as features ou labels sao medidas de forma diferente para grupos diferentes.

### Algorithmic Bias
Quando o proprio algoritmo introduz ou amplifica vieses.

## O que e Fairness?

Fairness busca garantir que sistemas de IA tratem todos os grupos de forma justa e equitativa. Existem diferentes definicoes matematicas de fairness:

### Metricas de Fairness

#### 1. Demographic Parity
Todos os grupos devem receber resultados positivos na mesma proporcao.

```python
def demographic_parity(predictions, sensitive_attr):
    """Verifica se a taxa de positivos e igual entre grupos"""
    groups = predictions.groupby(sensitive_attr)
    positive_rates = groups['prediction'].mean()
    return positive_rates.max() - positive_rates.min()
```

#### 2. Equalized Odds
A taxa de verdadeiros positivos e falsos positivos deve ser igual entre grupos.

```python
def equalized_odds(y_true, y_pred, sensitive_attr):
    """Calcula diferenca em TPR e FPR entre grupos"""
    results = {}
    for group in sensitive_attr.unique():
        mask = sensitive_attr == group
        y_t, y_p = y_true[mask], y_pred[mask]

        tp = ((y_p == 1) & (y_t == 1)).sum()
        fp = ((y_p == 1) & (y_t == 0)).sum()
        fn = ((y_p == 0) & (y_t == 1)).sum()
        tn = ((y_p == 0) & (y_t == 0)).sum()

        results[group] = {
            'tpr': tp / (tp + fn) if (tp + fn) > 0 else 0,
            'fpr': fp / (fp + tn) if (fp + tn) > 0 else 0
        }
    return results
```

#### 3. Individual Fairness
Individuos similares devem receber tratamento similar.

## Tecnicas de Mitigacao

### Pre-processamento
Corrigir o dataset antes do treinamento.

```python
from sklearn.utils import resample

def balance_dataset(df, target_col, sensitive_col):
    """Balanceia dataset para ter representacao igual"""
    groups = df.groupby([target_col, sensitive_col])
    max_size = groups.size().max()

    balanced_dfs = []
    for name, group in groups:
        resampled = resample(group, replace=True, n_samples=max_size)
        balanced_dfs.append(resampled)

    return pd.concat(balanced_dfs)
```

### In-processamento
Adicionar restricoes de fairness durante o treinamento.

```python
# Exemplo conceitual: adicionar termo de regularizacao
def fairness_loss(predictions, sensitive_attr, lambda_fair=0.1):
    """Penaliza disparidade entre grupos"""
    group_means = []
    for group in sensitive_attr.unique():
        mask = sensitive_attr == group
        group_means.append(predictions[mask].mean())

    disparity = max(group_means) - min(group_means)
    return lambda_fair * disparity
```

### Pos-processamento
Ajustar as predicoes apos o treinamento.

```python
def calibrate_thresholds(predictions, sensitive_attr, y_true):
    """Ajusta thresholds por grupo para equalizar metricas"""
    thresholds = {}
    for group in sensitive_attr.unique():
        mask = sensitive_attr == group
        # Encontra threshold que equaliza TPR
        thresholds[group] = find_optimal_threshold(
            predictions[mask], y_true[mask]
        )
    return thresholds
```

## Ferramentas para Auditoria de Fairness

- **Fairlearn** (Microsoft): Biblioteca Python para avaliar e melhorar fairness
- **AI Fairness 360** (IBM): Toolkit abrangente para deteccao e mitigacao de bias
- **What-If Tool** (Google): Interface visual para exploracao de fairness

---

## Recursos

- [What Do We Do About the Biases in AI? - HBR](https://hbr.org/2019/10/what-do-we-do-about-the-biases-in-ai)
- [AI Bias - What Is It and How to Avoid It? - Levity](https://levity.ai/blog/ai-bias-how-to-avoid)
- [What about fairness, bias and discrimination? - ICO UK](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/how-do-we-ensure-fairness-in-ai/what-about-fairness-bias-and-discrimination/)

---

## Checklist

- [ ] Entender as diferentes fontes de bias em sistemas de IA
- [ ] Conhecer as principais metricas de fairness (Demographic Parity, Equalized Odds)
- [ ] Saber aplicar tecnicas de mitigacao em pre, in e pos-processamento
- [ ] Utilizar ferramentas como Fairlearn ou AI Fairness 360 para auditoria
- [ ] Implementar monitoramento continuo de fairness em modelos em producao
