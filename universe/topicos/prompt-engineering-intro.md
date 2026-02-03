---
titulo: "Introducao a Prompt Engineering"
tags: ["prompt-engineering", "terminologia"]
prerequisitos: ["llms-intro"]
nivel: "iniciante"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Introducao a Prompt Engineering

Prompt Engineering e o processo de criar inputs efetivos para guiar modelos de IA a gerarem outputs desejados. E uma habilidade fundamental para AI Engineers, pois a qualidade do prompt determina diretamente a qualidade da resposta.

## Por que Prompt Engineering importa?

O mesmo modelo pode dar respostas dramaticamente diferentes dependendo de como voce pergunta:

**Prompt ruim:**
```
Escreva sobre Python
```
(Vago, resultado imprevisivel)

**Prompt bom:**
```
Escreva um tutorial de 3 paragrafos sobre list comprehensions em Python,
voltado para programadores iniciantes, com 2 exemplos de codigo.
```
(Especifico, resultado previsivel)

## Principios Fundamentais

### 1. Seja Especifico
Quanto mais detalhes, melhor o resultado.

### 2. Forneca Contexto
Explique o cenario, o publico, o objetivo.

### 3. Defina o Formato
Especifique como quer a resposta (lista, JSON, paragrafos).

### 4. Use Exemplos (Few-shot)
Mostre o padrao que espera.

### 5. Itere
Refine o prompt baseado nos resultados.

## Tecnicas Essenciais

### Zero-shot
Pedir diretamente, sem exemplos:
```
Classifique o sentimento: "Adorei o produto!" ->
```

### Few-shot
Fornecer exemplos antes:
```
Classifique o sentimento:
"Produto horrivel" -> negativo
"Gostei muito" -> positivo
"Mais ou menos" -> neutro
"Adorei o produto!" ->
```

### Chain-of-Thought (CoT)
Pedir raciocinio passo a passo:
```
Resolva o problema mostrando seu raciocinio passo a passo:
Maria tem 3 macas. Joao deu mais 5. Quantas ela tem?
```

### Role Prompting
Definir um papel para o modelo:
```
Voce e um especialista em seguranca de dados com 20 anos de experiencia.
Revise este codigo e aponte vulnerabilidades.
```

## Estrutura de um Bom Prompt

```
# SISTEMA (opcional - define comportamento geral)
Voce e um assistente tecnico especializado em Python.

# CONTEXTO
Estou desenvolvendo uma API REST e preciso validar inputs.

# TAREFA
Escreva uma funcao que valide emails usando regex.

# FORMATO
Retorne apenas o codigo Python, com docstring explicando.

# EXEMPLOS (opcional)
Exemplo de email valido: user@domain.com
Exemplo de email invalido: user@domain

# RESTRICOES
- Use apenas biblioteca padrao
- Codigo deve ser Python 3.10+
```

## Prompt Templates

Para aplicacoes, use templates reutilizaveis:

```python
TEMPLATE_RESUMO = """
Resuma o texto abaixo em {num_pontos} pontos principais.
Use linguagem {estilo}.

Texto:
{texto}

Resumo:
"""

prompt = TEMPLATE_RESUMO.format(
    num_pontos=5,
    estilo="tecnica",
    texto=documento
)
```

## Erros Comuns

1. **Prompts vagos** - "Fale sobre X" em vez de especificar
2. **Instrucoes conflitantes** - "Seja breve mas detalhado"
3. **Sem formato definido** - Resultado imprevisivel
4. **Ignorar limitacoes** - Pedir tarefas que LLMs nao fazem bem
5. **Nao iterar** - Aceitar primeira versao do prompt

## Prompt Engineering para RAG

Quando usando RAG, o prompt precisa:
- Instruir para usar apenas o contexto fornecido
- Definir como lidar com informacao ausente
- Solicitar citacao de fontes quando relevante

```
Use APENAS o contexto abaixo para responder.
Se a informacao nao estiver no contexto, diga "Nao encontrei essa informacao".
Cite a fonte quando possivel.

Contexto:
{documentos}

Pergunta: {pergunta}
```

---

## Recursos

- [Prompt Engineering Roadmap](https://roadmap.sh/prompt-engineering)
- [What is Prompt Engineering? - Video](https://www.youtube.com/watch?v=nf1e-55KKbg)

---

## Checklist

- [ ] Entender os principios fundamentais (especificidade, contexto, formato)
- [ ] Conhecer as tecnicas: zero-shot, few-shot, chain-of-thought
- [ ] Praticar escrevendo prompts estruturados
- [ ] Criar um template reutilizavel para sua aplicacao
- [ ] Iterar e melhorar um prompt baseado em resultados

---

## Conexoes

> **Proximo passo:** Agora que voce conhece os fundamentos, explore as APIs de LLMs e comece a construir!
