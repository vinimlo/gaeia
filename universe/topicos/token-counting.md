---
titulo: "Contagem de Tokens"
tags: ["tokens", "prompt-engineering", "otimizacao"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 25
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Contagem de Tokens

Tokens sao as unidades fundamentais de texto que modelos de linguagem processam. Entender como tokens funcionam e crucial para otimizar custos, respeitar limites de contexto e criar aplicacoes eficientes com LLMs.

## O Que Sao Tokens?

Tokens sao pedacos de texto que podem ser tao curtos quanto um caractere ou tao longos quanto uma palavra. Os modelos de linguagem nao processam texto caractere por caractere ou palavra por palavra - eles usam tokens.

### Exemplos de Tokenizacao

```
"Hello world" -> ["Hello", " world"] = 2 tokens
"Inteligencia" -> ["Int", "elig", "encia"] = 3 tokens
"AI" -> ["AI"] = 1 token
```

### Regras Gerais
- Em ingles: ~4 caracteres = 1 token
- Em portugues: ~3-4 caracteres = 1 token
- Espacos contam como parte do proximo token
- Pontuacao geralmente e um token separado
- Numeros podem ser tokenizados de formas inesperadas

## Por Que Tokens Importam?

### 1. Limites de Contexto
Cada modelo tem um limite maximo de tokens:

| Modelo | Limite de Contexto |
|--------|-------------------|
| GPT-3.5-turbo | 16,384 tokens |
| GPT-4 | 8,192 - 32,768 tokens |
| GPT-4o | 128,000 tokens |
| Claude 3 | 200,000 tokens |

### 2. Custos
APIs cobram por token processado (entrada + saida):

```
Custo = (tokens_entrada * preco_entrada) + (tokens_saida * preco_saida)
```

Exemplo GPT-4o:
- Entrada: $5.00 / 1M tokens
- Saida: $15.00 / 1M tokens

### 3. Latencia
Mais tokens = mais tempo de processamento, especialmente na geracao.

## Ferramentas para Contar Tokens

### OpenAI Tokenizer (Web)
Ferramenta visual online: [platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)

### Tiktoken (Python)
```python
import tiktoken

# Encoder para GPT-4
enc = tiktoken.encoding_for_model("gpt-4")

# Contar tokens
texto = "Ola, como voce esta hoje?"
tokens = enc.encode(texto)
print(f"Numero de tokens: {len(tokens)}")  # Output: 8

# Ver os tokens
print(tokens)  # [46071, 11, 1869, 28810, 4248, 99348, 30]

# Decodificar tokens individuais
for token in tokens:
    print(f"{token} -> '{enc.decode([token])}'")
```

### Estimativa Rapida
Para estimativas sem codigo:
- **Ingles**: palavras * 1.3
- **Portugues**: palavras * 1.5
- **Codigo**: linhas * 10

## Estrategias de Otimizacao

### 1. Prompts Concisos
```
# Ruim (muitos tokens)
"Por favor, eu gostaria muito que voce pudesse me ajudar a escrever um email"

# Bom (menos tokens)
"Escreva um email profissional sobre:"
```

### 2. Reutilizar System Prompts
Armazene system prompts longos e reutilize em multiplas chamadas.

### 3. Summarizacao para Contexto Longo
Quando o historico de conversa ficar grande, resuma mensagens antigas.

### 4. Truncar Documentos
Para RAG, extraia apenas trechos relevantes em vez de documentos inteiros.

## Calculando Custos

```python
import tiktoken

def calcular_custo(texto_entrada, texto_saida, modelo="gpt-4o"):
    enc = tiktoken.encoding_for_model(modelo)

    tokens_in = len(enc.encode(texto_entrada))
    tokens_out = len(enc.encode(texto_saida))

    # Precos GPT-4o (por 1M tokens)
    preco_in = 5.00 / 1_000_000
    preco_out = 15.00 / 1_000_000

    custo = (tokens_in * preco_in) + (tokens_out * preco_out)

    return {
        "tokens_entrada": tokens_in,
        "tokens_saida": tokens_out,
        "custo_usd": round(custo, 6)
    }
```

---

## Recursos

- [OpenAI Tokenizer Tool](https://platform.openai.com/tokenizer)
- [How to Count Tokens with Tiktoken](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
- [Tiktoken GitHub](https://github.com/openai/tiktoken)

---

## Checklist

- [ ] Entender o que sao tokens e como texto e tokenizado
- [ ] Usar o OpenAI Tokenizer para visualizar tokens de diferentes textos
- [ ] Instalar tiktoken e contar tokens programaticamente
- [ ] Calcular o custo estimado de uma chamada de API
- [ ] Otimizar um prompt longo para usar menos tokens sem perder qualidade
