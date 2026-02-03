---
titulo: "Escrevendo Prompts Eficazes"
tags: ["prompt-engineering", "prompts", "pratica"]
prerequisitos: []
nivel: "iniciante"
tempoEstimado: 30
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Escrevendo Prompts Eficazes

Prompts sao instrucoes cuidadosamente elaboradas que guiam modelos de linguagem (LLMs) a gerar conteudo especifico e de alta qualidade. A arte de escrever bons prompts e fundamental para qualquer AI Engineer, pois a qualidade da saida depende diretamente da qualidade da entrada.

## Por Que Prompts Importam?

Um prompt bem construido pode ser a diferenca entre uma resposta generica e uma solucao precisa para seu problema. Os modelos de IA sao extremamente capazes, mas precisam de direcao clara para entregar resultados uteis.

## Anatomia de um Bom Prompt

### 1. Contexto
Forneca informacoes de fundo que ajudem o modelo a entender a situacao:
```
"Voce e um especialista em marketing digital com 10 anos de experiencia..."
```

### 2. Instrucao Clara
Seja especifico sobre o que voce quer:
```
"Escreva um resumo de 3 paragrafos sobre os beneficios da energia renovavel"
```

### 3. Formato Desejado
Especifique como a resposta deve ser estruturada:
```
"Responda em formato de lista com bullet points"
```

### 4. Exemplos (Few-shot)
Inclua exemplos do que voce espera:
```
"Exemplo: Entrada: 'gato' -> Saida: 'animal domestico felino'"
```

## Tecnicas Essenciais

### Zero-shot Prompting
Pedir diretamente sem exemplos:
```
"Traduza para ingles: Ola, como voce esta?"
```

### Few-shot Prompting
Fornecer alguns exemplos antes da tarefa:
```
"Classifique o sentimento:
'Adorei o produto!' -> Positivo
'Pessimo atendimento' -> Negativo
'O servico foi ok' -> ?"
```

### Chain-of-Thought (CoT)
Pedir que o modelo explique seu raciocinio:
```
"Resolva passo a passo: Se Maria tem 3 macas e ganha mais 5..."
```

## Erros Comuns a Evitar

1. **Prompts vagos**: "Escreva algo sobre tecnologia"
2. **Instrucoes contraditorias**: "Seja breve e detalhado"
3. **Falta de contexto**: Assumir que o modelo sabe informacoes especificas
4. **Excesso de complexidade**: Tentar fazer muitas coisas em um unico prompt

## Exemplo Pratico

**Prompt Ruim:**
```
"Fale sobre carros"
```

**Prompt Bom:**
```
"Voce e um jornalista automotivo. Escreva um artigo de 300 palavras
comparando carros eletricos e hibridos, focando em: custo de manutencao,
autonomia e impacto ambiental. Use linguagem acessivel para leigos."
```

---

## Recursos

- [Roadmap de Prompt Engineering](https://roadmap.sh/prompt-engineering)
- [How to Write AI Prompts](https://www.descript.com/blog/article/how-to-write-ai-prompts)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---

## Checklist

- [ ] Entender a estrutura basica de um prompt (contexto, instrucao, formato)
- [ ] Praticar escrevendo prompts zero-shot e few-shot
- [ ] Experimentar a tecnica Chain-of-Thought em problemas de raciocinio
- [ ] Refatorar um prompt vago para um prompt especifico e claro
- [ ] Testar diferentes variacoes de prompt para a mesma tarefa e comparar resultados
