import { marked, type Renderer, type Tokens } from 'marked';
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki';
import { neuralTheme } from './shiki-neural-theme';
import { createLogger } from './logger';

const log = createLogger('markdown');

// Singleton highlighter instance
let highlighterInstance: Highlighter | null = null;

// Supported languages for syntax highlighting
const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'python',
  'javascript',
  'typescript',
  'bash',
  'shell',
  'json',
  'yaml',
  'html',
  'css',
  'sql',
  'go',
  'rust',
  'markdown',
  'tsx',
  'jsx',
  'diff',
  'toml',
  'dockerfile',
  'graphql',
];

/**
 * Initialize or get the Shiki highlighter singleton
 */
async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [neuralTheme],
      langs: SUPPORTED_LANGUAGES,
    });
  }
  return highlighterInstance;
}

/**
 * Generate a slug from heading text for anchor links
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escape HTML entities for safe insertion
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Get display name for language
 */
function getLanguageDisplay(lang: string): string {
  const displayNames: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    py: 'Python',
    python: 'Python',
    bash: 'Bash',
    shell: 'Shell',
    sh: 'Shell',
    zsh: 'Shell',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    html: 'HTML',
    css: 'CSS',
    sql: 'SQL',
    go: 'Go',
    rust: 'Rust',
    rs: 'Rust',
    md: 'Markdown',
    markdown: 'Markdown',
    tsx: 'TSX',
    jsx: 'JSX',
    diff: 'Diff',
    toml: 'TOML',
    dockerfile: 'Dockerfile',
    docker: 'Dockerfile',
    graphql: 'GraphQL',
    gql: 'GraphQL',
    plaintext: 'Text',
    text: 'Text',
    txt: 'Text',
  };
  return displayNames[lang.toLowerCase()] || lang.toUpperCase();
}

/**
 * Map language aliases to Shiki-supported languages
 * Returns null if the language is not supported (for plain text fallback)
 */
function normalizeLanguage(lang: string): BundledLanguage | null {
  const aliases: Record<string, BundledLanguage> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    rs: 'rust',
    md: 'markdown',
    docker: 'dockerfile',
    gql: 'graphql',
  };
  const normalized = aliases[lang.toLowerCase()] || lang.toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(normalized as BundledLanguage)) {
    return normalized as BundledLanguage;
  }
  // Return null for unsupported languages - they'll be handled as plain text in the renderer
  return null;
}

/**
 * Map Obsidian wiki link targets to URLs
 * Converts wiki links like [[topic-name]] to proper URLs
 */
function mapObsidianLinkToUrl(target: string): string {
  // Special case: _INDEX -> /trilhas
  if (target === '_INDEX') {
    return '/trilhas';
  }

  // Trilhas: trilha-name -> /trilhas/trilha-name
  if (target.startsWith('trilhas/')) {
    return `/${target}`;
  }

  // Topicos: topic-name -> /topicos/topic-name
  // Convert to lowercase slug
  const slug = target
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return `/topicos/${slug}`;
}

/**
 * Preprocess Obsidian wiki links [[target|label]] to standard markdown links
 * Supports formats:
 * - [[target]] -> [target](url)
 * - [[target|label]] -> [label](url)
 */
function preprocessObsidianLinks(content: string): string {
  // Match [[target]] or [[target|label]]
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  return content.replace(wikiLinkRegex, (_match, target, label) => {
    const url = mapObsidianLinkToUrl(target.trim());
    const linkText = label?.trim() || target.trim();
    return `[${linkText}](${url})`;
  });
}

/**
 * Extract YouTube video ID from a URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Detect link type from URL for CSS class
 */
function detectLinkType(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes('arxiv.org')) return 'arxiv';
  if (lower.includes('github.com') || lower.includes('gitlab.com')) return 'github';
  if (lower.includes('colab.research.google.com') || lower.includes('kaggle.com')) return 'interactive';
  if (lower.includes('docs.') || lower.includes('/docs/') || lower.includes('/documentation')) return 'docs';
  if (lower.includes('huggingface.co')) return 'huggingface';
  return 'external';
}

/**
 * Create custom renderer for marked with neural styling
 */
function createNeuralRenderer(highlighter?: Highlighter): Partial<Renderer> {
  return {
    // Code blocks with syntax highlighting
    code(token: Tokens.Code): string {
      const lang = token.lang || '';
      const code = token.text;
      const displayLang = getLanguageDisplay(lang);
      const normalizedLang = normalizeLanguage(lang);

      let highlightedCode: string;

      if (highlighter && normalizedLang) {
        try {
          highlightedCode = highlighter.codeToHtml(code, {
            lang: normalizedLang,
            theme: 'neural',
          });
          // Extract just the code content from Shiki's output
          highlightedCode = highlightedCode
            .replace(/<pre[^>]*>/, '')
            .replace(/<\/pre>/, '')
            .replace(/<code[^>]*>/, '')
            .replace(/<\/code>/, '');
        } catch (error) {
          log.warn(`Syntax highlighting failed for language "${lang}", falling back to plain text`);
          highlightedCode = escapeHtml(code);
        }
      } else {
        highlightedCode = escapeHtml(code);
      }

      const langClass = normalizedLang ? `language-${escapeHtml(normalizedLang)}` : '';
      return `
<div class="code-block-wrapper" data-language="${escapeHtml(lang)}">
  <div class="code-block-header">
    <span class="code-block-language">${escapeHtml(displayLang)}</span>
    <button class="code-copy-btn" aria-label="Copy code">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <svg class="check-icon" style="display:none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="copy-text">Copy</span>
    </button>
  </div>
  <pre><code class="${langClass}">${highlightedCode}</code></pre>
</div>`;
    },

    // Headings with anchor links
    heading(token: Tokens.Heading): string {
      const text = this.parser!.parseInline(token.tokens);
      const level = token.depth;
      const slug = slugify(token.text);

      // Only add anchors to h2, h3, h4
      const anchor =
        level >= 2 && level <= 4
          ? `<a href="#${slug}" class="heading-anchor" aria-label="Link to this section">#</a>`
          : '';

      return `<h${level} id="${slug}">${text}${anchor}</h${level}>\n`;
    },

    // Blockquotes with neural styling
    blockquote(token: Tokens.Blockquote): string {
      const body = this.parser!.parse(token.tokens);
      return `<blockquote>\n${body}</blockquote>\n`;
    },

    // Horizontal rules with neural node
    hr(): string {
      return '<hr />\n';
    },

    // Images with glass wrapper
    image(token: Tokens.Image): string {
      const src = token.href;
      const alt = token.text || '';
      const title = token.title;

      let html = `<div class="image-wrapper">
  <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${title ? ` title="${escapeHtml(title)}"` : ''} loading="lazy" />`;

      // Add caption if title is provided
      if (title) {
        html += `\n  <div class="image-caption">${escapeHtml(title)}</div>`;
      }

      html += '\n</div>';
      return html;
    },

    // Tables with wrapper for overflow
    table(token: Tokens.Table): string {
      let header = '';
      let body = '';

      // Build header
      let headerRow = '';
      for (let j = 0; j < token.header.length; j++) {
        const cell = token.header[j];
        const align = token.align[j];
        const alignAttr = align ? ` style="text-align:${align}"` : '';
        headerRow += `<th${alignAttr}>${this.parser!.parseInline(cell.tokens)}</th>`;
      }
      header = `<thead><tr>${headerRow}</tr></thead>`;

      // Build body
      let bodyRows = '';
      for (let i = 0; i < token.rows.length; i++) {
        const row = token.rows[i];
        let rowHtml = '';
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          const align = token.align[j];
          const alignAttr = align ? ` style="text-align:${align}"` : '';
          rowHtml += `<td${alignAttr}>${this.parser!.parseInline(cell.tokens)}</td>`;
        }
        bodyRows += `<tr>${rowHtml}</tr>`;
      }
      body = `<tbody>${bodyRows}</tbody>`;

      return `<div class="table-wrapper">
  <table>${header}${body}</table>
</div>\n`;
    },

    // List items - handle task lists (only for non-task items now)
    listitem(token: Tokens.ListItem): string {
      const itemBody = this.parser!.parse(token.tokens);
      return `<li>${itemBody}</li>\n`;
    },

    // Lists - detect task lists and insert interactive container
    list(token: Tokens.List): string {
      // Check if this is a task list
      const isTaskList = token.items.some((item) => item.task);

      if (isTaskList) {
        // Extract checklist items for client-side hydration
        const checklistItems = token.items
          .filter((item) => item.task)
          .map((item) => {
            // Get the text content from the item tokens
            const textContent = item.tokens
              .map((t) => {
                if (t.type === 'text') return (t as Tokens.Text).text;
                if (t.type === 'paragraph') {
                  return (t as Tokens.Paragraph).tokens
                    .map((pt) => ('text' in pt ? pt.text : ''))
                    .join('');
                }
                return '';
              })
              .join('')
              .trim();

            return {
              text: textContent,
              checked: item.checked || false,
              indent: 0,
            };
          });

        // Serialize for client-side hydration (escape for HTML attribute)
        const itemsJson = JSON.stringify(checklistItems).replace(/'/g, '&#39;');

        return `<div class="inline-checklist-container" data-checklist-items='${itemsJson}'></div>\n`;
      }

      // Regular lists continue with standard rendering
      const body = token.items.map((item) => this.listitem!(item)).join('');

      if (token.ordered) {
        const start = token.start !== 1 ? ` start="${token.start}"` : '';
        return `<ol${start}>\n${body}</ol>\n`;
      }
      return `<ul>\n${body}</ul>\n`;
    },

    // Links with proper styling and accessibility
    link(token: Tokens.Link): string {
      const href = token.href;
      const text = this.parser!.parseInline(token.tokens);
      const title = token.title;

      // Determine if link is external
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      // YouTube embed: render click-to-play placeholder
      if (isExternal) {
        const videoId = extractYouTubeId(href);
        if (videoId) {
          return `<div class="youtube-embed" data-video-id="${escapeHtml(videoId)}">
  <button class="youtube-embed-play" aria-label="Assistir vídeo">
    <img src="https://img.youtube.com/vi/${escapeHtml(videoId)}/mqdefault.jpg" alt="" loading="lazy" />
    <svg class="youtube-play-icon" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24L27 14v20" fill="white"/></svg>
  </button>
  <span class="youtube-embed-title">${text}</span>
</div>`;
        }
      }

      // External links: add resource type class
      if (isExternal) {
        const linkType = detectLinkType(href);
        const typeClass = linkType ? ` resource-link resource-link--${linkType}` : '';

        const attrs = [
          `href="${escapeHtml(href)}"`,
          `class="${typeClass.trim()}"`,
          title ? `title="${escapeHtml(title)}"` : '',
          'target="_blank" rel="noopener noreferrer"',
        ].filter(Boolean).join(' ');

        return `<a ${attrs}>${text}</a>`;
      }

      const attrs = [
        `href="${escapeHtml(href)}"`,
        title ? `title="${escapeHtml(title)}"` : '',
      ].filter(Boolean).join(' ');

      return `<a ${attrs}>${text}</a>`;
    },
  };
}

/**
 * Configure marked with options
 */
function configureMarked(): void {
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
}

/**
 * Render markdown asynchronously with full syntax highlighting
 * Preferred for SSG/SSR contexts where async is available
 */
export async function renderMarkdownAsync(markdown: string): Promise<string> {
  if (!markdown) return '';

  // Preprocess Obsidian wiki links
  const preprocessed = preprocessObsidianLinks(markdown);

  configureMarked();

  // Initialize highlighter
  const highlighter = await getHighlighter();

  const renderer = createNeuralRenderer(highlighter);
  marked.use({ renderer });

  const result = marked.parse(preprocessed);
  return typeof result === 'string' ? result : '';
}

