---
titulo: "Hugging Face"
tags: ["hugging-face", "modelos", "open-source"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Hugging Face

Hugging Face e a principal plataforma e comunidade para modelos de machine learning open source. Conhecida como o "GitHub do ML", oferece ferramentas, bibliotecas e um hub com milhares de modelos pre-treinados para NLP, visao computacional e muito mais.

## O Ecossistema Hugging Face

### Hub
Repositorio central com mais de 500.000 modelos, datasets e espacos (demos).

### Transformers
Biblioteca Python que simplifica o uso de modelos como BERT, GPT, T5, LLaMA e CLIP.

### Datasets
Biblioteca para carregar e processar datasets de ML facilmente.

### Spaces
Plataforma para hospedar demos e aplicacoes de ML gratuitamente.

### Inference API
API para usar modelos sem precisar de infraestrutura propria.

## Primeiros Passos

### Instalacao
```bash
pip install transformers torch
```

### Uso Basico - Pipeline
A forma mais simples de usar modelos:

```python
from transformers import pipeline

# Analise de sentimento
classifier = pipeline("sentiment-analysis")
result = classifier("I love this product!")
print(result)  # [{'label': 'POSITIVE', 'score': 0.9998}]

# Geracao de texto
generator = pipeline("text-generation", model="gpt2")
text = generator("Once upon a time", max_length=50)
print(text)

# Resumo
summarizer = pipeline("summarization")
summary = summarizer("Texto longo aqui...", max_length=100)

# Traducao
translator = pipeline("translation_en_to_pt", model="Helsinki-NLP/opus-mt-en-pt")
result = translator("Hello, how are you?")
```

## Pipelines Disponiveis

| Pipeline | Descricao | Exemplo de Modelo |
|----------|-----------|-------------------|
| text-classification | Classificacao de texto | distilbert-base-uncased |
| sentiment-analysis | Analise de sentimento | nlptown/bert-base-multilingual |
| text-generation | Geracao de texto | gpt2, meta-llama/Llama-2 |
| summarization | Resumo de texto | facebook/bart-large-cnn |
| translation | Traducao | Helsinki-NLP/opus-mt-* |
| question-answering | Perguntas e respostas | deepset/roberta-base-squad2 |
| fill-mask | Completar lacunas | bert-base-uncased |
| image-classification | Classificar imagens | google/vit-base-patch16-224 |
| object-detection | Detectar objetos | facebook/detr-resnet-50 |

## Usando Modelos Especificos

### Carregando Modelos Diretamente
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Carregar modelo e tokenizer
model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Gerar texto
inputs = tokenizer("Explain quantum computing:", return_tensors="pt")
outputs = model.generate(**inputs, max_length=100)
print(tokenizer.decode(outputs[0]))
```

### Modelos para Embeddings
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

sentences = [
    "Isso e um exemplo",
    "Cada frase vira um vetor",
    "Vetores similares ficam proximos"
]

embeddings = model.encode(sentences)
print(embeddings.shape)  # (3, 384)
```

## Hugging Face Hub

### Navegando o Hub
1. Acesse [huggingface.co/models](https://huggingface.co/models)
2. Filtre por tarefa, biblioteca, licenca
3. Veja model cards com documentacao e exemplos
4. Confira metricas e benchmarks

### Autenticacao para Modelos Privados
```python
from huggingface_hub import login

# Login com token (obtenha em huggingface.co/settings/tokens)
login(token="hf_xxxxx")

# Ou via variavel de ambiente
# export HUGGING_FACE_HUB_TOKEN=hf_xxxxx
```

## Inference API

Use modelos sem baixar localmente:

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/gpt2"
headers = {"Authorization": "Bearer hf_xxxxx"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({"inputs": "The answer to life is"})
```

## Spaces - Hospedando Demos

### Criar um Space com Gradio
```python
# app.py
import gradio as gr
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

def analyze(text):
    result = classifier(text)[0]
    return f"{result['label']}: {result['score']:.2%}"

demo = gr.Interface(fn=analyze, inputs="text", outputs="text")
demo.launch()
```

### Deploy
1. Crie um repositorio no Hugging Face Spaces
2. Faca upload do `app.py` e `requirements.txt`
3. O Space sera construido e hospedado automaticamente

## Dicas de Performance

### Quantizacao para Modelos Grandes
```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    load_in_8bit=True,  # Reduz uso de memoria
    device_map="auto"
)
```

### Cache de Modelos
```bash
# Definir diretorio de cache
export HF_HOME=/path/to/cache

# Ou em Python
import os
os.environ["HF_HOME"] = "/path/to/cache"
```

---

## Recursos

- [Hugging Face - Site Oficial](https://huggingface.co)
- [Hugging Face Official Video Course](https://www.youtube.com/watch?v=00GKzGyWFEs&list=PLo2EIpI_JMQvWfQndUesu0nPBAtZ9gP1o)
- [What is Hugging Face? - Machine Learning Hub Explained](https://www.youtube.com/watch?v=1AUjKfpRZVo)
- [Transformers Documentation](https://huggingface.co/docs/transformers)

---

## Checklist

- [ ] Criar uma conta no Hugging Face e gerar um token de acesso
- [ ] Instalar a biblioteca transformers e executar um pipeline simples
- [ ] Explorar o Hub e encontrar modelos para diferentes tarefas
- [ ] Usar a Inference API para rodar um modelo sem baixar localmente
- [ ] Carregar um modelo de embeddings com sentence-transformers
