#!/usr/bin/env python3
"""
Scraper para o roadmap de AI Engineer do roadmap.sh
Extrai todo o conteúdo e organiza em pastas por seção.
"""

import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote

import requests

# Configurações
ROADMAP_JSON_URL = "https://roadmap.sh/ai-engineer.json"
GITHUB_API_URL = "https://api.github.com/repos/kamranahmedse/developer-roadmap/contents/src/data/roadmaps/ai-engineer/content"
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/ai-engineer/content"
OUTPUT_DIR = Path("ai-engineer-roadmap")
MAX_WORKERS = 5
REQUEST_DELAY = 0.2  # segundos entre requests


def fetch_json(url: str) -> dict:
    """Busca e retorna JSON de uma URL."""
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def fetch_text(url: str) -> str:
    """Busca e retorna texto de uma URL."""
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.text


def extract_sections_from_roadmap(roadmap_data: dict) -> list[dict]:
    """
    Extrai seções do roadmap JSON ordenadas por posição.
    Retorna lista de seções com seus tópicos.
    """
    nodes = roadmap_data.get("nodes", [])

    # Identificar nós por tipo
    topics = []

    for node in nodes:
        node_type = node.get("type", "")
        data = node.get("data", {})
        position = node.get("position", {})

        # Tópicos são "topic" ou "subtopic"
        if node_type in ("topic", "subtopic"):
            topics.append({
                "id": node.get("id"),
                "label": data.get("label", ""),
                "x": position.get("x", 0),
                "y": position.get("y", 0),
                "parent_ids": node.get("parentIds", [])
            })

    # Sempre criar seções baseado em agrupamentos visuais
    sections = create_sections_from_positions(topics)

    # Ordenar seções por posição Y
    sections.sort(key=lambda s: s["y"])

    return sections


def create_sections_from_positions(topics: list[dict]) -> list[dict]:
    """Cria seções baseado em agrupamentos de posição Y."""
    if not topics:
        return []

    # Ordenar por Y
    sorted_topics = sorted(topics, key=lambda t: t["y"])

    # Agrupar em seções (cada grupo de ~300px de altura)
    sections = []
    current_section = None
    section_threshold = 300

    for topic in sorted_topics:
        if current_section is None or topic["y"] - current_section["y"] > section_threshold:
            if current_section:
                sections.append(current_section)
            current_section = {
                "id": f"section_{len(sections)}",
                "label": topic["label"],  # Usa primeiro tópico como nome
                "x": topic["x"],
                "y": topic["y"],
                "topics": [topic]
            }
        else:
            current_section["topics"].append(topic)

    if current_section:
        sections.append(current_section)

    # Nomear seções baseado no primeiro tópico principal de cada grupo
    section_names = [
        "Introduction",
        "Common Terminology",
        "Prompt Engineering",
        "Pre-trained Models",
        "Open vs Closed Source",
        "AI Safety and Ethics",
        "Handling User Input",
        "Embeddings",
        "Vector Databases",
        "RAG Fundamentals",
        "RAG Implementation",
        "RAG Frameworks",
        "AI Agents",
        "Model Context Protocol",
        "MCP Architecture",
        "MCP Implementation",
        "Multimodal AI",
        "Development Tools"
    ]

    for i, section in enumerate(sections):
        if i < len(section_names):
            section["label"] = section_names[i]

    return sections


def associate_topics_to_sections(sections: list[dict], topics: list[dict]) -> list[dict]:
    """Associa tópicos às seções mais próximas."""
    for topic in topics:
        closest_section = None
        min_distance = float('inf')

        for section in sections:
            # Calcular distância simples (principalmente Y)
            distance = abs(topic["y"] - section["y"])
            if distance < min_distance:
                min_distance = distance
                closest_section = section

        if closest_section:
            closest_section["topics"].append(topic)

    return sections


def fetch_github_content_list() -> list[dict]:
    """Busca lista de arquivos de conteúdo do GitHub."""
    try:
        return fetch_json(GITHUB_API_URL)
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print("⚠️  Rate limit do GitHub API. Tentando método alternativo...")
            return []
        raise


def build_topic_to_file_map(files: list[dict]) -> dict[str, str]:
    """
    Mapeia nome do tópico para nome do arquivo.
    Arquivos têm formato: topic-name@unique-id.md
    """
    topic_map = {}

    for file_info in files:
        filename = file_info.get("name", "")
        if not filename.endswith(".md"):
            continue

        # Extrair nome do tópico (antes do @)
        match = re.match(r"^(.+)@.+\.md$", filename)
        if match:
            topic_name = match.group(1)
            topic_map[topic_name] = filename
        else:
            # Arquivo sem @, usar nome completo
            topic_name = filename.replace(".md", "")
            topic_map[topic_name] = filename

    return topic_map


def slugify(text: str) -> str:
    """Converte texto para slug (lowercase, hyphens)."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def download_topic_content(filename: str) -> tuple[str, str]:
    """Baixa conteúdo de um tópico. Retorna (filename, content)."""
    url = f"{GITHUB_RAW_BASE}/{quote(filename)}"
    try:
        content = fetch_text(url)
        time.sleep(REQUEST_DELAY)
        return filename, content
    except Exception as e:
        return filename, f"# Erro ao baixar\n\nNão foi possível baixar: {e}"


def download_all_content(filenames: list[str]) -> dict[str, str]:
    """Baixa conteúdo de todos os tópicos em paralelo."""
    content_map = {}
    total = len(filenames)

    print(f"\n📥 Baixando {total} arquivos de conteúdo...")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(download_topic_content, f): f for f in filenames}

        for i, future in enumerate(as_completed(futures), 1):
            filename, content = future.result()
            content_map[filename] = content
            print(f"  [{i}/{total}] {filename[:50]}...")

    return content_map


def create_output_structure(sections: list[dict], topic_to_file: dict[str, str],
                           content_map: dict[str, str]) -> None:
    """Cria estrutura de pastas e arquivos de output."""

    # Criar diretório principal
    OUTPUT_DIR.mkdir(exist_ok=True)

    readme_content = "# AI Engineer Roadmap\n\n"
    readme_content += "Conteúdo extraído do [roadmap.sh/ai-engineer](https://roadmap.sh/ai-engineer)\n\n"
    readme_content += "## Seções\n\n"

    # Processar cada seção
    for i, section in enumerate(sections, 1):
        section_name = section.get("label", f"Seção {i}")
        section_slug = f"{i:02d}-{slugify(section_name)}"
        section_dir = OUTPUT_DIR / section_slug
        section_dir.mkdir(exist_ok=True)

        readme_content += f"### [{section_name}](./{section_slug}/)\n\n"

        # Criar índice da seção
        section_index = f"# {section_name}\n\n"

        # Ordenar tópicos por posição X dentro da seção
        topics = sorted(section.get("topics", []), key=lambda t: (t["y"], t["x"]))

        for topic in topics:
            topic_label = topic.get("label", "")
            topic_slug = slugify(topic_label)

            # Encontrar arquivo correspondente
            filename = topic_to_file.get(topic_slug)

            if filename and filename in content_map:
                content = content_map[filename]

                # Salvar arquivo do tópico
                topic_file = section_dir / f"{topic_slug}.md"
                topic_file.write_text(content, encoding="utf-8")

                section_index += f"- [{topic_label}](./{topic_slug}.md)\n"
                readme_content += f"  - [{topic_label}](./{section_slug}/{topic_slug}.md)\n"

        # Salvar índice da seção
        (section_dir / "_index.md").write_text(section_index, encoding="utf-8")
        readme_content += "\n"

    # Adicionar arquivos não associados a seções
    used_files = set()
    for section in sections:
        for topic in section.get("topics", []):
            topic_slug = slugify(topic.get("label", ""))
            if topic_slug in topic_to_file:
                used_files.add(topic_to_file[topic_slug])

    unused_files = [f for f in content_map.keys() if f not in used_files]

    if unused_files:
        extras_dir = OUTPUT_DIR / "99-extras"
        extras_dir.mkdir(exist_ok=True)

        readme_content += "### [Conteúdo Adicional](./99-extras/)\n\n"
        extras_index = "# Conteúdo Adicional\n\nTópicos não associados a seções específicas.\n\n"

        for filename in sorted(unused_files):
            content = content_map[filename]
            # Extrair nome do tópico
            match = re.match(r"^(.+)@.+\.md$", filename)
            topic_slug = match.group(1) if match else filename.replace(".md", "")

            topic_file = extras_dir / f"{topic_slug}.md"
            topic_file.write_text(content, encoding="utf-8")

            extras_index += f"- [{topic_slug}](./{topic_slug}.md)\n"
            readme_content += f"  - [{topic_slug}](./99-extras/{topic_slug}.md)\n"

        (extras_dir / "_index.md").write_text(extras_index, encoding="utf-8")

    # Salvar README principal
    (OUTPUT_DIR / "README.md").write_text(readme_content, encoding="utf-8")


def main():
    print("🚀 Iniciando scraping do AI Engineer Roadmap...")

    # 1. Buscar estrutura do roadmap
    print("\n📊 Buscando estrutura do roadmap...")
    try:
        roadmap_data = fetch_json(ROADMAP_JSON_URL)
        print(f"  ✓ Roadmap carregado: {len(roadmap_data.get('nodes', []))} nós")
    except Exception as e:
        print(f"  ✗ Erro ao buscar roadmap: {e}")
        return

    # 2. Extrair seções
    print("\n🗂️  Extraindo seções...")
    sections = extract_sections_from_roadmap(roadmap_data)
    print(f"  ✓ {len(sections)} seções identificadas")

    # 3. Buscar lista de arquivos do GitHub
    print("\n📁 Buscando lista de arquivos de conteúdo...")
    files = fetch_github_content_list()

    if not files:
        # Fallback: usar os tópicos do roadmap para construir URLs
        print("  ⚠️  Usando fallback baseado no roadmap...")
        all_topics = []
        for section in sections:
            all_topics.extend(section.get("topics", []))

        # Tentar baixar baseado nos slugs dos tópicos
        topic_slugs = [slugify(t["label"]) for t in all_topics]
        topic_to_file = {s: f"{s}@unknown.md" for s in topic_slugs}
    else:
        topic_to_file = build_topic_to_file_map(files)
        print(f"  ✓ {len(topic_to_file)} arquivos mapeados")

    # 4. Baixar todo o conteúdo
    filenames = list(set(topic_to_file.values()))

    # Se temos a lista do GitHub, usar os nomes corretos
    if files:
        filenames = [f["name"] for f in files if f["name"].endswith(".md")]

    content_map = download_all_content(filenames)
    print(f"  ✓ {len(content_map)} arquivos baixados")

    # 5. Criar estrutura de output
    print("\n📝 Criando estrutura de pastas...")
    create_output_structure(sections, topic_to_file, content_map)

    # Contagem final
    total_files = sum(1 for _ in OUTPUT_DIR.rglob("*.md"))
    print(f"\n✅ Concluído! {total_files} arquivos criados em '{OUTPUT_DIR}/'")
    print(f"   Abra '{OUTPUT_DIR}/README.md' para começar.")


if __name__ == "__main__":
    main()
