---
titulo: "Chunking para RAG"
tags: ["chunking", "rag", "preprocessamento"]
prerequisitos: ["what-is-rag", "embeddings"]
nivel: "intermediario"
tempoEstimado: 40
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Chunking para RAG

Chunking e o processo de dividir documentos grandes em pedacos menores e gerenciaveis para uso em sistemas de Retrieval-Augmented Generation (RAG). Esta etapa e crucial porque determina a qualidade da recuperacao de informacoes e, consequentemente, a qualidade das respostas geradas.

## Por que Chunking e Necessario?

### Limitacoes dos Modelos

1. **Limite de Tokens**: LLMs tem limites de contexto (4K, 8K, 32K, 128K tokens)
2. **Custo**: Mais tokens = maior custo de processamento
3. **Qualidade**: Contextos muito longos podem diluir informacoes relevantes
4. **Eficiencia**: Embeddings funcionam melhor com textos de tamanho apropriado

### Beneficios do Chunking Adequado

- Recuperacao mais precisa de informacoes relevantes
- Menor custo de processamento
- Melhor qualidade das respostas
- Maior eficiencia no armazenamento

## Estrategias de Chunking

### 1. Fixed-Size Chunking (Tamanho Fixo)

Divide o texto em pedacos de tamanho fixo (por caracteres ou tokens).

```python
def fixed_size_chunking(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap  # Overlap para manter contexto
    return chunks
```

**Pros**: Simples, previsivel
**Contras**: Pode cortar no meio de frases/paragrafos

### 2. Sentence-Based Chunking (Por Sentencas)

Agrupa sentencas completas ate atingir um limite.

```python
import nltk
nltk.download('punkt')

def sentence_chunking(text, max_chunk_size=1000):
    sentences = nltk.sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_size = 0

    for sentence in sentences:
        if current_size + len(sentence) > max_chunk_size and current_chunk:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_size = 0
        current_chunk.append(sentence)
        current_size += len(sentence)

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks
```

**Pros**: Preserva sentencas completas
**Contras**: Tamanhos variaveis

### 3. Recursive Character Text Splitter (LangChain)

Divide recursivamente usando uma hierarquia de separadores.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = text_splitter.split_text(document)
```

**Pros**: Respeita estrutura do documento
**Contras**: Mais complexo

### 4. Semantic Chunking (Por Semantica)

Agrupa texto baseado em similaridade semantica.

```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain.embeddings import OpenAIEmbeddings

text_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"
)

chunks = text_splitter.split_text(document)
```

**Pros**: Chunks semanticamente coerentes
**Contras**: Mais lento, requer modelo de embeddings

### 5. Document-Specific Chunking

Para tipos especificos de documentos:

```python
# Para Markdown
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers_to_split = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

splitter = MarkdownHeaderTextSplitter(headers_to_split)
chunks = splitter.split_text(markdown_text)

# Para codigo
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter

python_splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,
    chunk_size=500,
    chunk_overlap=50
)
```

## Parametros Importantes

### Chunk Size (Tamanho do Chunk)

| Tamanho | Uso Recomendado |
|---------|-----------------|
| 100-500 tokens | Perguntas especificas, FAQ |
| 500-1000 tokens | Uso geral, documentacao |
| 1000-2000 tokens | Contexto amplo, narrativas |

### Chunk Overlap (Sobreposicao)

A sobreposicao evita perda de contexto nas bordas:

```
Chunk 1: [-------TEXTO-------]
Chunk 2:            [-------TEXTO-------]
                    ↑
              Overlap (10-20%)
```

Recomendacao: 10-20% do tamanho do chunk

## Boas Praticas

1. **Experimente diferentes estrategias** para seu caso de uso
2. **Mantenha metadados** (fonte, pagina, secao) junto aos chunks
3. **Use overlap** para nao perder contexto entre chunks
4. **Considere o modelo de embedding** ao definir tamanhos
5. **Avalie a qualidade** com queries de teste

## Exemplo Completo

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

# 1. Carregar documento
loader = PyPDFLoader("documento.pdf")
pages = loader.load()

# 2. Configurar splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    separators=["\n\n", "\n", ". ", " ", ""]
)

# 3. Dividir em chunks
chunks = text_splitter.split_documents(pages)

# 4. Cada chunk mantem metadados da pagina original
for i, chunk in enumerate(chunks[:3]):
    print(f"Chunk {i}: {len(chunk.page_content)} chars")
    print(f"Metadata: {chunk.metadata}")
```

---

## Resources

- [Understanding LangChain's RecursiveCharacterTextSplitter](https://dev.to/eteimz/understanding-langchains-recursivecharactertextsplitter-2846)
- [Chunking Strategies for LLM Applications - Pinecone](https://www.pinecone.io/learn/chunking-strategies/)
- [A Guide to Chunking Strategies for RAG - Zilliz](https://zilliz.com/learn/guide-to-chunking-strategies-for-rag)
- [LangChain Text Splitters Documentation](https://python.langchain.com/docs/modules/data_connection/document_transformers/)

---

## Checklist

- [ ] Compreender por que chunking e necessario para RAG
- [ ] Conhecer as principais estrategias: fixed-size, sentence, recursive, semantic
- [ ] Saber configurar chunk_size e overlap adequados ao caso de uso
- [ ] Implementar chunking usando LangChain RecursiveCharacterTextSplitter
- [ ] Preservar metadados dos documentos originais nos chunks
