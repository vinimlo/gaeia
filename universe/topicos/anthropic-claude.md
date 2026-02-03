---
titulo: "Anthropic Claude"
tags: ["anthropic", "claude", "api", "llms"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Anthropic Claude

O Claude e um modelo de linguagem desenvolvido pela Anthropic, empresa focada em criar sistemas de IA seguros e alinhados com intencoes humanas. Nomeado em homenagem a Claude Shannon, o pai da teoria da informacao, o Claude se destaca por seu foco em seguranca, transparencia e minimizacao de outputs prejudiciais.

## Diferenciais do Claude

### Constitutional AI
A Anthropic desenvolveu uma abordagem chamada "Constitutional AI" onde o modelo e treinado para seguir um conjunto de principios eticos, resultando em respostas mais seguras e alinhadas.

### Contexto Extenso
O Claude oferece janelas de contexto muito grandes (ate 200K tokens no Claude 3), permitindo processar documentos longos, codigos extensos e conversas prolongadas.

### Capacidades Multimodais
As versoes mais recentes do Claude podem processar imagens alem de texto, permitindo analise visual e compreensao de documentos com graficos.

## Modelos Claude

| Modelo | Caracteristicas | Uso Ideal |
|--------|----------------|-----------|
| Claude 3 Opus | Mais capaz, raciocinio complexo | Tarefas criticas, analise profunda |
| Claude 3 Sonnet | Equilibrio performance/custo | Uso geral, producao |
| Claude 3 Haiku | Mais rapido e economico | Tarefas simples, alto volume |

## Usando a API do Claude

### Instalacao
```bash
pip install anthropic
```

### Exemplo Basico
```python
import anthropic

client = anthropic.Anthropic(api_key="sua-api-key")

message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explique o que e inteligencia artificial."}
    ]
)

print(message.content[0].text)
```

### Com System Prompt
```python
message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    system="Voce e um professor de ciencia da computacao. Explique conceitos de forma clara e didatica.",
    messages=[
        {"role": "user", "content": "O que sao redes neurais?"}
    ]
)
```

## Recursos Avancados

### Analise de Imagens
```python
message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": base64_image
                    }
                },
                {
                    "type": "text",
                    "text": "O que voce ve nesta imagem?"
                }
            ]
        }
    ]
)
```

### Streaming de Respostas
```python
with client.messages.stream(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Conte uma historia curta."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## Claude vs GPT: Quando Usar Cada Um?

| Aspecto | Claude | GPT |
|---------|--------|-----|
| Contexto longo | Excelente (200K) | Bom (128K) |
| Seguranca | Foco principal | Importante |
| Criatividade | Muito bom | Excelente |
| Codigo | Muito bom | Excelente |
| Custo | Competitivo | Variado |

---

## Recursos

- [Claude.ai - Interface Web](https://claude.ai)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [How To Use Claude Pro For Beginners](https://www.youtube.com/watch?v=J3X_JWQkvo8)

---

## Checklist

- [ ] Criar uma conta na Anthropic e obter uma API key
- [ ] Instalar a biblioteca anthropic e fazer uma chamada basica
- [ ] Experimentar diferentes modelos Claude (Opus, Sonnet, Haiku)
- [ ] Testar o uso de system prompts para personalizar comportamento
- [ ] Comparar respostas do Claude com outro LLM para a mesma tarefa
