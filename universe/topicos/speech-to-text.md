---
titulo: "Speech-to-Text"
tags: ["stt", "audio", "transcricao"]
prerequisitos: ["multimodal-ai"]
nivel: "intermediario"
tempoEstimado: 30
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Speech-to-Text

No contexto de IA multimodal, tecnologia Speech-to-Text (STT) converte linguagem falada em texto escrito, permitindo integracao com outros tipos de dados como imagens e texto. Isso permite que sistemas de IA processem entrada de audio e combinem com informacoes visuais ou textuais.

## O Que e Speech-to-Text?

STT, tambem conhecido como ASR (Automatic Speech Recognition), e o processo de:

1. **Captura**: Receber audio de fala
2. **Processamento**: Analisar padroes acusticos
3. **Transcricao**: Converter em texto escrito
4. **Pos-processamento**: Adicionar pontuacao, formatacao

## Como Funciona?

### Pipeline Tradicional

```
Audio ──> Pre-processamento ──> Modelo Acustico ──> Modelo de Linguagem ──> Texto
          (ruido, normalizacao)  (fonemas)          (palavras/frases)
```

### Modelos End-to-End Modernos

```
Audio ──> Encoder (Transformer) ──> Decoder ──> Texto
          (representacao latente)   (geracao)
```

## APIs e Servicos

### OpenAI Whisper API

```python
from openai import OpenAI

client = OpenAI()

# Transcricao basica
with open("audio.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )

print(transcript.text)
```

### Whisper com Opcoes Avancadas

```python
# Transcricao com timestamps
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    response_format="verbose_json",
    timestamp_granularities=["word", "segment"]
)

# Acessar timestamps
for segment in transcript.segments:
    print(f"[{segment.start:.2f}s] {segment.text}")
```

### Traducao de Audio

```python
# Traduzir audio em qualquer idioma para ingles
translation = client.audio.translations.create(
    model="whisper-1",
    file=audio_file
)
```

### Google Cloud Speech-to-Text

```python
from google.cloud import speech

client = speech.SpeechClient()

with open("audio.wav", "rb") as audio_file:
    content = audio_file.read()

audio = speech.RecognitionAudio(content=content)
config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code="pt-BR",
    enable_automatic_punctuation=True
)

response = client.recognize(config=config, audio=audio)

for result in response.results:
    print(result.alternatives[0].transcript)
```

### AWS Transcribe

```python
import boto3

transcribe = boto3.client('transcribe')

# Iniciar job de transcricao
transcribe.start_transcription_job(
    TranscriptionJobName='meu-job',
    Media={'MediaFileUri': 's3://bucket/audio.mp3'},
    MediaFormat='mp3',
    LanguageCode='pt-BR'
)
```

## Whisper Local (Open Source)

```python
import whisper

# Carregar modelo
model = whisper.load_model("base")  # tiny, base, small, medium, large

# Transcrever
result = model.transcribe("audio.mp3")
print(result["text"])

# Com deteccao de idioma
result = model.transcribe("audio.mp3", task="transcribe")
print(f"Idioma detectado: {result['language']}")
print(f"Texto: {result['text']}")
```

### Tamanhos de Modelo Whisper

| Modelo | Parametros | VRAM | Velocidade |
|--------|-----------|------|------------|
| tiny   | 39M       | ~1GB | Muito rapido |
| base   | 74M       | ~1GB | Rapido |
| small  | 244M      | ~2GB | Moderado |
| medium | 769M      | ~5GB | Lento |
| large  | 1550M     | ~10GB| Muito lento |

## Integracao Multimodal

### Transcricao de Video

```python
import moviepy.editor as mp
import whisper

# Extrair audio do video
video = mp.VideoFileClip("video.mp4")
video.audio.write_audiofile("audio.wav")

# Transcrever
model = whisper.load_model("base")
result = model.transcribe("audio.wav")

# Combinar com analise visual
# ... analise de frames do video
```

### Assistente de Voz Multimodal

```python
async def process_voice_with_context(audio_file, image_file=None):
    # 1. Transcrever audio
    transcript = await transcribe(audio_file)

    # 2. Se houver imagem, incluir na analise
    if image_file:
        response = await multimodal_analysis(
            text=transcript,
            image=image_file
        )
    else:
        response = await text_analysis(transcript)

    return response
```

## Casos de Uso

### 1. Legendagem Automatica
```python
def generate_srt(audio_path):
    result = model.transcribe(audio_path, word_timestamps=True)

    srt_content = ""
    for i, segment in enumerate(result["segments"]):
        start = format_timestamp(segment["start"])
        end = format_timestamp(segment["end"])
        text = segment["text"]
        srt_content += f"{i+1}\n{start} --> {end}\n{text}\n\n"

    return srt_content
```

### 2. Resumo de Reunioes
```python
def summarize_meeting(audio_path):
    # Transcrever
    transcript = transcribe(audio_path)

    # Resumir com LLM
    summary = llm.generate(f"""
    Resuma os pontos principais desta reuniao:

    {transcript}

    Inclua: decisoes tomadas, acoes definidas, proximos passos.
    """)

    return summary
```

### 3. Analise de Call Center
```python
def analyze_call(audio_path):
    transcript = transcribe(audio_path)

    analysis = llm.generate(f"""
    Analise esta ligacao de atendimento:

    {transcript}

    Identifique:
    - Sentimento do cliente
    - Problema reportado
    - Solucao oferecida
    - Satisfacao final
    """)

    return analysis
```

## Desafios e Solucoes

### Ruido de Fundo
- Pre-processar audio com reducao de ruido
- Usar modelos mais robustos (Whisper large)

### Sotaques e Dialetos
- Treinar modelos especializados
- Usar modelos multilingues

### Audio de Baixa Qualidade
- Melhorar taxa de amostragem quando possivel
- Usar modelos tolerantes a qualidade

### Multiplos Falantes
- Usar diarizacao (speaker diarization)
- Modelos que identificam troca de falante

---

## Resources

- [What is Speech to Text? - AWS](https://aws.amazon.com/what-is/speech-to-text/)
- [Turn Speech into Text using Google AI](https://cloud.google.com/speech-to-text)
- [How is Speech to Text Used? - H2O.ai](https://h2o.ai/wiki/speech-to-text/)
- [Whisper - OpenAI](https://openai.com/research/whisper)

---

## Checklist

- [ ] Entender o pipeline de Speech-to-Text (captura, processamento, transcricao)
- [ ] Implementar transcricao usando OpenAI Whisper API
- [ ] Experimentar com Whisper local para entender trade-offs de modelo
- [ ] Criar um caso de uso pratico (legendagem, resumo de reuniao, ou analise de audio)
- [ ] Integrar STT com outras modalidades (texto/imagem) para aplicacao multimodal
