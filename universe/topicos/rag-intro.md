---
titulo: "Introducao a RAG"
tags: ["rag", "terminologia"]
prerequisitos: ["embeddings-intro", "vector-databases-intro"]
nivel: "iniciante"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Introducao a RAG

RAG (Retrieval-Augmented Generation) e uma abordagem que combina recuperacao de informacoes com geracao de texto. E a tecnica mais importante para AI Engineers que precisam fazer LLMs responderem com base em dados especificos.

## O Problema que RAG Resolve

LLMs tem limitacoes criticas:
- **Conhecimento desatualizado** - Treinados ate uma data de corte
- **Sem dados privados** - Nao conhecem documentos da sua empresa
- **Alucinacoes** - Inventam informacoes quando nao sabem

RAG resolve isso **buscando informacao relevante** e passando para o LLM junto com a pergunta.

## Como RAG Funciona

```
Usuario: "Qual a politica de ferias da empresa?"

1. RETRIEVAL (Recuperacao)
   - Pergunta vira embedding
   - Busca no vector database
   - Retorna documentos relevantes

2. AUGMENTATION (Aumento)
   - Monta prompt com contexto
   - "Com base nos documentos: [docs], responda: [pergunta]"

3. GENERATION (Geracao)
   - LLM gera resposta baseada no contexto
   - Resposta fundamentada em dados reais
```

## Pipeline Completo

```python
from openai import OpenAI
import chromadb

client = OpenAI()
db = chromadb.Client()
collection = db.get_collection("documentos")

def rag_query(pergunta: str) -> str:
    # 1. Retrieval - buscar documentos relevantes
    results = collection.query(
        query_texts=[pergunta],
        n_results=3
    )

    contexto = "\n".join(results['documents'][0])

    # 2. Augmentation - montar prompt
    prompt = f"""Use o contexto abaixo para responder a pergunta.
    Se a resposta nao estiver no contexto, diga que nao sabe.

    Contexto:
    {contexto}

    Pergunta: {pergunta}
    """

    # 3. Generation - gerar resposta
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content
```

## Componentes de um Sistema RAG

1. **Document Loader** - Carrega PDFs, websites, databases
2. **Chunker** - Divide documentos em pedacos menores
3. **Embedder** - Gera embeddings dos chunks
4. **Vector Store** - Armazena e indexa embeddings
5. **Retriever** - Busca chunks relevantes
6. **Generator** - LLM que gera a resposta final

## Estrategias de Chunking

Como dividir documentos afeta muito a qualidade:

| Estrategia | Descricao | Quando usar |
|------------|-----------|-------------|
| Tamanho fixo | 500-1000 caracteres | Textos gerais |
| Por sentenca | Respeita limites naturais | Textos fluidos |
| Por paragrafo | Mantem contexto | Artigos, docs |
| Semantico | Agrupa por tema | Alta qualidade |
| Recursivo | Tenta varios separadores | Uso geral |

## RAG vs Fine-tuning

| Aspecto | RAG | Fine-tuning |
|---------|-----|-------------|
| Atualizacao | Instantanea | Requer retreino |
| Custo | Baixo | Alto |
| Controle | Fontes visiveis | Caixa preta |
| Escala | Milhoes de docs | Limitado |
| Uso | Perguntas sobre dados | Mudar comportamento |

**Regra geral:** Comece com RAG. Fine-tuning so se RAG nao resolver.

## Metricas de Qualidade

- **Recall** - Documentos relevantes foram recuperados?
- **Precision** - Documentos recuperados sao relevantes?
- **Faithfulness** - Resposta e fiel ao contexto?
- **Relevance** - Resposta responde a pergunta?

---

## Recursos

- [What is Retrieval Augmented Generation (RAG)? - Datacamp](https://www.datacamp.com/blog/what-is-retrieval-augmented-generation-rag)
- [What is Retrieval-Augmented Generation? - Google](https://cloud.google.com/use-cases/retrieval-augmented-generation)
- [What is Retrieval-Augmented Generation? - IBM Video](https://www.youtube.com/watch?v=T-D1OfcDW1M)

---

## Checklist

- [ ] Entender o problema que RAG resolve (alucinacoes, dados privados)
- [ ] Conhecer as 3 etapas: Retrieval, Augmentation, Generation
- [ ] Entender a importancia do chunking
- [ ] Saber quando usar RAG vs fine-tuning
- [ ] Implementar um pipeline RAG basico

---

## Conexoes

> **Proximo passo:** Conheca AI Agents, sistemas que tomam acoes autonomas em [[ai-agents-intro]]
