---
titulo: "Model Context Protocol (MCP)"
tags: ["mcp", "protocolo", "agentes"]
prerequisitos: ["ai-agents", "apis"]
nivel: "avancado"
tempoEstimado: 50
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Model Context Protocol (MCP)

O Model Context Protocol (MCP) fornece uma forma padronizada para AI Agents gerenciarem e compartilharem informacoes contextuais. Ele define uma estrutura para representar o entendimento atual do agente sobre o ambiente, usuario e objetivos.

## O Que e MCP?

MCP e um protocolo aberto desenvolvido pela Anthropic que padroniza como aplicacoes de IA se conectam a fontes de dados e ferramentas externas. Pense nele como um "USB-C para IA" - uma interface universal que permite que qualquer modelo se conecte a qualquer ferramenta.

## Por Que MCP e Importante?

### Problema Atual
Cada integracao de IA requer codigo customizado:
```
App A + Tool 1 = Integracao customizada A1
App A + Tool 2 = Integracao customizada A2
App B + Tool 1 = Integracao customizada B1
...
```

### Solucao com MCP
Um protocolo padronizado:
```
App A ──┐
App B ──┼── MCP ──┼── Tool 1
App C ──┘         └── Tool 2
                  └── Tool 3
```

## Arquitetura MCP

```
┌──────────────────────────────────────────────────┐
│                   MCP Host                        │
│  (Claude Desktop, IDE, Aplicacao AI)             │
├──────────────────────────────────────────────────┤
│                   MCP Client                      │
│  (Gerencia conexoes com servidores)              │
├──────────────────────────────────────────────────┤
        │              │              │
        ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│MCP Server │  │MCP Server │  │MCP Server │
│(Database) │  │(API)      │  │(Files)    │
└───────────┘  └───────────┘  └───────────┘
```

## Componentes Principais

### 1. MCP Host
O aplicativo que hospeda o modelo de IA:
- Claude Desktop
- IDEs como Cursor ou VS Code
- Aplicacoes customizadas

### 2. MCP Client
Componente dentro do host que:
- Gerencia conexoes com servidores
- Roteia mensagens entre host e servers
- Mantem estado das conexoes

### 3. MCP Server
Servicos que expoe recursos ao modelo:
- **Resources**: Dados que o modelo pode ler (arquivos, DBs)
- **Tools**: Funcoes que o modelo pode chamar
- **Prompts**: Templates de prompts pre-definidos

## Criando um MCP Server

### Estrutura Basica (TypeScript)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "meu-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Definir uma ferramenta
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "buscar_dados",
        description: "Busca dados no banco de dados",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Consulta SQL" }
          },
          required: ["query"]
        }
      }
    ]
  };
});

// Implementar a ferramenta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "buscar_dados") {
    const result = await executeQuery(request.params.arguments.query);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
});

// Iniciar servidor
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Estrutura Basica (Python)

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

server = Server("meu-mcp-server")

@server.list_tools()
async def list_tools():
    return [
        {
            "name": "buscar_dados",
            "description": "Busca dados no banco de dados",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                }
            }
        }
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "buscar_dados":
        result = await execute_query(arguments["query"])
        return {"content": [{"type": "text", "text": str(result)}]}

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)
```

## Configurando MCP no Claude Desktop

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "meu-server": {
      "command": "node",
      "args": ["/caminho/para/meu-server/index.js"]
    },
    "database-server": {
      "command": "python",
      "args": ["-m", "database_mcp_server"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

## Recursos Disponiveis

### Resources
Dados estaticos ou dinamicos que o modelo pode acessar:
```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "file:///config/settings.json",
        name: "Configuracoes",
        mimeType: "application/json"
      }
    ]
  };
});
```

### Prompts
Templates reutilizaveis:
```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "analise-codigo",
        description: "Analisa codigo fonte",
        arguments: [
          { name: "linguagem", required: true }
        ]
      }
    ]
  };
});
```

## Casos de Uso

1. **Integracao com Banco de Dados**: Permitir que Claude consulte dados em tempo real
2. **Acesso a Arquivos**: Ler e escrever arquivos no sistema
3. **APIs Empresariais**: Conectar a sistemas internos (CRM, ERP)
4. **Ferramentas de Desenvolvimento**: Git, Docker, CI/CD

## Seguranca

- Sempre validar inputs antes de executar acoes
- Limitar escopo de acesso (principio do menor privilegio)
- Usar autenticacao para servidores remotos
- Logar todas as acoes para auditoria

---

## Resources

- [Model Context Protocol (MCP) Course - Hugging Face](https://huggingface.co/learn/mcp-course/en/unit0/introduction)
- [Model Context Protocol - Official](https://modelcontextprotocol.io/)
- [Model Context Protocol - GitHub](https://github.com/modelcontextprotocol)
- [Model Context Protocol (MCP): A Guide With Demo Project](https://www.datacamp.com/tutorial/mcp-model-context-protocol)
- [What is MCP? Integrate AI Agents with Databases & APIs](https://www.youtube.com/watch?v=eur8dUO9mvE)

---

## Checklist

- [ ] Entender a arquitetura Host/Client/Server do MCP
- [ ] Instalar e configurar um MCP Server existente no Claude Desktop
- [ ] Criar um MCP Server simples com uma ferramenta customizada
- [ ] Implementar Resources para expor dados ao modelo
- [ ] Aplicar boas praticas de seguranca em servidores MCP
