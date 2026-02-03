---
titulo: "Fine-tuning de Modelos"
tags: ["fine-tuning", "modelos", "treinamento"]
prerequisitos: []
nivel: "intermediario"
tempoEstimado: 60
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Fine-tuning de Modelos

Fine-tuning e o processo de adaptar modelos pre-treinados para casos de uso especificos, treinando-os com datasets customizados. Isso permite refinar o comportamento do modelo e melhorar sua performance em tarefas especializadas.

## Quando Usar Fine-tuning?

### Bons Casos de Uso
- **Estilo consistente**: Quando precisar de um tom ou formato especifico
- **Dominio especializado**: Jargao tecnico, terminologia medica, juridica
- **Tarefas repetitivas**: Classificacao, extracao de dados estruturados
- **Reducao de prompts**: Eliminar instrucoes longas em cada chamada

### Quando NAO Usar
- **Conhecimento novo**: Fine-tuning nao adiciona conhecimento factual (use RAG)
- **Tarefas simples**: Prompt engineering pode ser suficiente
- **Dados limitados**: Precisa de centenas/milhares de exemplos
- **Mudancas frequentes**: Se os requisitos mudam muito, fine-tuning e caro

## Fine-tuning vs Alternativas

| Abordagem | Quando Usar | Custo | Flexibilidade |
|-----------|-------------|-------|---------------|
| Prompt Engineering | Primeiro sempre | Baixo | Alta |
| Few-shot Learning | Exemplos simples | Baixo | Media |
| RAG | Conhecimento novo | Medio | Alta |
| Fine-tuning | Comportamento especifico | Alto | Baixa |

## Preparando Dados para Fine-tuning

### Formato dos Dados (OpenAI)
```jsonl
{"messages": [{"role": "system", "content": "Voce e um assistente de suporte tecnico."}, {"role": "user", "content": "Meu computador nao liga"}, {"role": "assistant", "content": "Vamos verificar: 1) O cabo de forca esta conectado? 2) A tomada funciona com outros aparelhos?"}]}
{"messages": [{"role": "system", "content": "Voce e um assistente de suporte tecnico."}, {"role": "user", "content": "A internet esta lenta"}, {"role": "assistant", "content": "Entendo. Vamos diagnosticar: 1) Reinicie o roteador 2) Teste a velocidade em speedtest.net"}]}
```

### Boas Praticas para Dados
1. **Quantidade**: Minimo 50-100 exemplos, ideal 500+
2. **Qualidade**: Exemplos devem ser perfeitos (garbage in, garbage out)
3. **Diversidade**: Cubra diferentes cenarios e edge cases
4. **Consistencia**: Mantenha formato e estilo uniformes

## Fine-tuning com OpenAI

### 1. Preparar o Arquivo
```python
import json

# Criar arquivo JSONL
dados = [
    {
        "messages": [
            {"role": "system", "content": "Voce e um classificador de sentimentos."},
            {"role": "user", "content": "Adorei o produto!"},
            {"role": "assistant", "content": "POSITIVO"}
        ]
    },
    # ... mais exemplos
]

with open("dados_treino.jsonl", "w") as f:
    for item in dados:
        f.write(json.dumps(item) + "\n")
```

### 2. Upload do Arquivo
```python
from openai import OpenAI
client = OpenAI()

file = client.files.create(
    file=open("dados_treino.jsonl", "rb"),
    purpose="fine-tune"
)
```

### 3. Criar Job de Fine-tuning
```python
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-3.5-turbo"  # ou gpt-4o-mini
)
print(f"Job criado: {job.id}")
```

### 4. Monitorar Progresso
```python
# Verificar status
job_status = client.fine_tuning.jobs.retrieve(job.id)
print(f"Status: {job_status.status}")

# Listar eventos
events = client.fine_tuning.jobs.list_events(job.id)
for event in events.data:
    print(event.message)
```

### 5. Usar o Modelo Fine-tuned
```python
response = client.chat.completions.create(
    model="ft:gpt-3.5-turbo:minha-org::abc123",  # ID do modelo fine-tuned
    messages=[
        {"role": "user", "content": "O atendimento foi pessimo"}
    ]
)
```

## Custos de Fine-tuning

### OpenAI (GPT-3.5-turbo)
- **Treinamento**: $8.00 / 1M tokens
- **Uso**: $3.00 entrada / $6.00 saida por 1M tokens

### Dica de Economia
Comece com poucos exemplos, avalie resultados, e adicione mais dados iterativamente.

## Avaliando Resultados

```python
def avaliar_modelo(modelo, casos_teste):
    acertos = 0
    for caso in casos_teste:
        response = client.chat.completions.create(
            model=modelo,
            messages=[{"role": "user", "content": caso["input"]}]
        )
        if response.choices[0].message.content == caso["expected"]:
            acertos += 1

    return acertos / len(casos_teste)

# Comparar modelo base vs fine-tuned
print(f"Base: {avaliar_modelo('gpt-3.5-turbo', testes)}")
print(f"Fine-tuned: {avaliar_modelo('ft:gpt-3.5-turbo:...', testes)}")
```

---

## Recursos

- [Fine-tuning Documentation - OpenAI](https://platform.openai.com/docs/guides/fine-tuning)
- [Fine-tuning ChatGPT with OpenAI Tutorial](https://www.youtube.com/watch?v=VVKcSf6r3CM)
- [OpenAI Cookbook - Fine-tuning](https://cookbook.openai.com/examples/how_to_fine-tune_chat_models)

---

## Checklist

- [ ] Entender quando fine-tuning e a abordagem correta vs prompt engineering ou RAG
- [ ] Preparar um dataset no formato JSONL com pelo menos 50 exemplos
- [ ] Executar um job de fine-tuning usando a API da OpenAI
- [ ] Avaliar o modelo fine-tuned comparando com o modelo base
- [ ] Calcular o custo-beneficio do fine-tuning para seu caso de uso
