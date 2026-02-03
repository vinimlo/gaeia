import type { ThemeRegistration } from 'shiki';

/**
 * Neural Theme for Shiki
 * A custom syntax highlighting theme that matches the GAEIA design system
 * Using the neural/deep space aesthetic with cyan, violet, amber, and green accents
 */
export const neuralTheme: ThemeRegistration = {
  name: 'neural',
  type: 'dark',
  colors: {
    // Editor colors
    'editor.background': '#0f1623',
    'editor.foreground': '#f1f5f9',
    'editor.lineHighlightBackground': '#1a233244',
    'editor.selectionBackground': '#00d4ff30',
    'editorCursor.foreground': '#00d4ff',
    'editorLineNumber.foreground': '#64748b',
    'editorLineNumber.activeForeground': '#94a3b8',

    // Sidebar and UI
    'sideBar.background': '#080c14',
    'sideBar.foreground': '#94a3b8',

    // Terminal
    'terminal.ansiBlack': '#080c14',
    'terminal.ansiBlue': '#00d4ff',
    'terminal.ansiCyan': '#00d4ff',
    'terminal.ansiGreen': '#22c55e',
    'terminal.ansiMagenta': '#a78bfa',
    'terminal.ansiRed': '#f87171',
    'terminal.ansiWhite': '#f1f5f9',
    'terminal.ansiYellow': '#ffb020',
    'terminal.ansiBrightBlack': '#64748b',
    'terminal.ansiBrightBlue': '#38bdf8',
    'terminal.ansiBrightCyan': '#22d3ee',
    'terminal.ansiBrightGreen': '#4ade80',
    'terminal.ansiBrightMagenta': '#c4b5fd',
    'terminal.ansiBrightRed': '#fca5a5',
    'terminal.ansiBrightWhite': '#ffffff',
    'terminal.ansiBrightYellow': '#fcd34d',
  },
  tokenColors: [
    // Comments - dim and subtle
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: '#64748b',
        fontStyle: 'italic',
      },
    },

    // Strings - complete-pulse green
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'punctuation.definition.string',
      ],
      settings: {
        foreground: '#22c55e',
      },
    },

    // Template literals - slightly different green
    {
      scope: ['string.template.expression'],
      settings: {
        foreground: '#4ade80',
      },
    },

    // Numbers - axon-amber
    {
      scope: ['constant.numeric', 'constant.numeric.integer', 'constant.numeric.float', 'constant.numeric.hex'],
      settings: {
        foreground: '#ffb020',
      },
    },

    // Constants and booleans - amber variant
    {
      scope: ['constant.language', 'constant.language.boolean', 'constant.language.null', 'constant.language.undefined'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // Keywords - dendrite-violet
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.logical',
        'storage.type',
        'storage.modifier',
      ],
      settings: {
        foreground: '#a78bfa',
      },
    },

    // Control flow keywords - brighter violet
    {
      scope: ['keyword.control.flow', 'keyword.control.return', 'keyword.control.import', 'keyword.control.export'],
      settings: {
        foreground: '#c4b5fd',
      },
    },

    // Functions - synapse-cyan
    {
      scope: [
        'entity.name.function',
        'meta.function-call',
        'support.function',
        'support.function.builtin',
      ],
      settings: {
        foreground: '#00d4ff',
      },
    },

    // Method calls
    {
      scope: ['meta.method-call', 'entity.name.function.member'],
      settings: {
        foreground: '#22d3ee',
      },
    },

    // Classes and types - bright cyan
    {
      scope: [
        'entity.name.class',
        'entity.name.type',
        'entity.other.inherited-class',
        'support.class',
        'support.type',
        'entity.name.type.class',
      ],
      settings: {
        foreground: '#38bdf8',
      },
    },

    // Type annotations (TypeScript)
    {
      scope: ['meta.type.annotation', 'entity.name.type.alias'],
      settings: {
        foreground: '#38bdf8',
      },
    },

    // Interfaces
    {
      scope: ['entity.name.type.interface'],
      settings: {
        foreground: '#67e8f9',
      },
    },

    // Variables and parameters
    {
      scope: ['variable', 'variable.other', 'variable.parameter'],
      settings: {
        foreground: '#f1f5f9',
      },
    },

    // Object properties
    {
      scope: ['variable.other.property', 'variable.other.object.property', 'meta.object-literal.key'],
      settings: {
        foreground: '#94a3b8',
      },
    },

    // Operators
    {
      scope: ['keyword.operator', 'punctuation.accessor'],
      settings: {
        foreground: '#a78bfa',
      },
    },

    // Assignment operators
    {
      scope: ['keyword.operator.assignment'],
      settings: {
        foreground: '#c4b5fd',
      },
    },

    // Punctuation - subtle
    {
      scope: ['punctuation', 'meta.brace', 'punctuation.definition.block'],
      settings: {
        foreground: '#64748b',
      },
    },

    // Brackets - slightly brighter
    {
      scope: ['punctuation.bracket', 'punctuation.section'],
      settings: {
        foreground: '#94a3b8',
      },
    },

    // HTML/JSX Tags
    {
      scope: ['entity.name.tag', 'punctuation.definition.tag'],
      settings: {
        foreground: '#f87171',
      },
    },

    // HTML/JSX Attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // CSS Selectors
    {
      scope: ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css'],
      settings: {
        foreground: '#ffb020',
      },
    },

    // CSS Properties
    {
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: '#00d4ff',
      },
    },

    // CSS Values
    {
      scope: ['support.constant.property-value.css'],
      settings: {
        foreground: '#22c55e',
      },
    },

    // CSS Units
    {
      scope: ['keyword.other.unit.css'],
      settings: {
        foreground: '#ffb020',
      },
    },

    // Regex
    {
      scope: ['string.regexp'],
      settings: {
        foreground: '#f87171',
      },
    },

    // Escape characters
    {
      scope: ['constant.character.escape'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // Markdown headings
    {
      scope: ['markup.heading', 'entity.name.section'],
      settings: {
        foreground: '#00d4ff',
        fontStyle: 'bold',
      },
    },

    // Markdown bold
    {
      scope: ['markup.bold'],
      settings: {
        foreground: '#f1f5f9',
        fontStyle: 'bold',
      },
    },

    // Markdown italic
    {
      scope: ['markup.italic'],
      settings: {
        foreground: '#c4b5fd',
        fontStyle: 'italic',
      },
    },

    // Markdown links
    {
      scope: ['markup.underline.link'],
      settings: {
        foreground: '#00d4ff',
      },
    },

    // Markdown code
    {
      scope: ['markup.inline.raw', 'markup.fenced_code'],
      settings: {
        foreground: '#22c55e',
      },
    },

    // JSON keys
    {
      scope: ['support.type.property-name.json'],
      settings: {
        foreground: '#00d4ff',
      },
    },

    // YAML keys
    {
      scope: ['entity.name.tag.yaml'],
      settings: {
        foreground: '#00d4ff',
      },
    },

    // Shell/Bash
    {
      scope: ['source.shell variable'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // SQL
    {
      scope: ['keyword.other.sql', 'keyword.other.DML.sql'],
      settings: {
        foreground: '#a78bfa',
      },
    },

    // Python decorators
    {
      scope: ['entity.name.function.decorator.python', 'meta.function.decorator.python'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // Python self/cls
    {
      scope: ['variable.parameter.function.language.special.self.python', 'variable.language.special.self.python'],
      settings: {
        foreground: '#f87171',
        fontStyle: 'italic',
      },
    },

    // Go package names
    {
      scope: ['entity.name.package.go'],
      settings: {
        foreground: '#38bdf8',
      },
    },

    // Rust lifetimes
    {
      scope: ['storage.modifier.lifetime.rust'],
      settings: {
        foreground: '#f87171',
      },
    },

    // Rust macros
    {
      scope: ['entity.name.function.macro.rust'],
      settings: {
        foreground: '#fbbf24',
      },
    },

    // Invalid/deprecated
    {
      scope: ['invalid', 'invalid.illegal'],
      settings: {
        foreground: '#f87171',
        fontStyle: 'strikethrough',
      },
    },

    // Deprecated
    {
      scope: ['invalid.deprecated'],
      settings: {
        foreground: '#fbbf24',
        fontStyle: 'strikethrough',
      },
    },
  ],
};

export default neuralTheme;
