/**
 * Extract and classify resources (links) from topic markdown
 */

import type { ExtractedResource, ResourceType } from '../types/trilhas';

const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const HEADING_REGEX = /^##\s+(.+)$/;

/**
 * Detect resource type from URL
 */
function detectTypeFromUrl(url: string): ResourceType | null {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('arxiv.org')) return 'arxiv';
  if (lower.includes('github.com') || lower.includes('gitlab.com')) return 'github';
  if (lower.includes('colab.research.google.com') || lower.includes('kaggle.com') || lower.includes('huggingface.co/spaces')) return 'interactive';
  if (lower.includes('docs.') || lower.includes('/docs/') || lower.includes('/documentation')) return 'documentation';
  return null;
}

/**
 * Boost type classification based on the section heading
 */
function detectTypeFromSection(section: string): ResourceType | null {
  const lower = section.toLowerCase();
  if (lower.includes('video') || lower.includes('vídeo')) return 'youtube';
  if (lower.includes('paper') || lower.includes('artigo científico') || lower.includes('artigos científicos')) return 'arxiv';
  if (lower.includes('ferramenta') || lower.includes('tool') || lower.includes('playground') || lower.includes('prática') || lower.includes('pratica')) return 'interactive';
  if (lower.includes('documentação') || lower.includes('documentacao') || lower.includes('doc')) return 'documentation';
  if (lower.includes('código') || lower.includes('codigo') || lower.includes('implementa') || lower.includes('reposit')) return 'github';
  if (lower.includes('artigo') || lower.includes('blog') || lower.includes('leitura') || lower.includes('referência') || lower.includes('recurso')) return 'article';
  return null;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Try to find a bold title from the line above the link
 */
function findBoldTitle(lines: string[], lineIndex: number): string | null {
  // Check previous lines for a bold pattern (parent bullet item)
  for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 3); i--) {
    const line = lines[i].trim();
    // Match **bold text** patterns in list items
    const boldMatch = line.match(/\*\*(.+?)\*\*/);
    if (boldMatch) return boldMatch[1];
    // Stop if we hit a heading or empty line
    if (line === '' || line.startsWith('#')) break;
  }
  return null;
}

/**
 * Check if a URL is an internal/anchor link
 */
function isInternalLink(url: string): boolean {
  return url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:');
}

/**
 * Extract resources from markdown content
 */
export function extractResources(markdown: string): ExtractedResource[] {
  const lines = markdown.split('\n');
  const resources: ExtractedResource[] = [];
  const seenUrls = new Set<string>();
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track current h2 section
    const headingMatch = line.match(HEADING_REGEX);
    if (headingMatch) {
      currentSection = headingMatch[1].trim();
      continue;
    }

    // Find all links in this line
    let linkMatch;
    LINK_REGEX.lastIndex = 0;
    while ((linkMatch = LINK_REGEX.exec(line)) !== null) {
      const [, linkText, url] = linkMatch;

      // Skip internal links and already-seen URLs
      if (isInternalLink(url) || seenUrls.has(url)) continue;
      seenUrls.add(url);

      // Classify type: URL-based detection takes priority, then section context
      const urlType = detectTypeFromUrl(url);
      const sectionType = detectTypeFromSection(currentSection);
      const type = urlType || sectionType || 'article';

      // Build title: prefer bold title from parent item, fallback to link text
      const boldTitle = findBoldTitle(lines, i);
      const title = boldTitle || linkText;

      resources.push({
        url,
        title,
        type,
        section: currentSection,
        domain: extractDomain(url),
      });
    }
  }

  return resources;
}

/**
 * Group resources by type for display
 */
export function groupResourcesByType(resources: ExtractedResource[]): Record<ResourceType, ExtractedResource[]> {
  const groups: Record<ResourceType, ExtractedResource[]> = {
    youtube: [],
    arxiv: [],
    github: [],
    documentation: [],
    interactive: [],
    article: [],
    other: [],
  };

  for (const resource of resources) {
    groups[resource.type].push(resource);
  }

  return groups;
}

/**
 * Format resources as text for NotebookLM export
 */
export function formatResourcesForExport(resources: ExtractedResource[], topicTitle: string): string {
  const groups = groupResourcesByType(resources);

  const typeLabels: Record<ResourceType, string> = {
    youtube: 'Videos',
    arxiv: 'Papers',
    github: 'Repositórios',
    documentation: 'Documentação',
    interactive: 'Ferramentas Interativas',
    article: 'Artigos',
    other: 'Outros',
  };

  let output = `# Recursos: ${topicTitle}\n`;

  for (const [type, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    output += `\n## ${typeLabels[type as ResourceType]}\n`;
    for (const item of items) {
      output += `- ${item.title}: ${item.url}\n`;
    }
  }

  return output;
}
