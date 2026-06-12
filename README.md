# Wiki.js MCP Server

**Read-only Model Context Protocol server for Wiki.js** - Search, list, browse, and retrieve published Wiki.js knowledge base pages from your AI assistant.

## v2.0.0 - Major Refactoring

This version includes a complete rewrite following MCP Best Practices:

- **TypeScript** - Full type safety with strict mode
- **Modern SDK** - Uses MCP SDK v1.24+ with `McpServer.tool()` API
- **Zod Validation** - Runtime input validation for all tools
- **Service-Prefixed Tools** - All tools use `wikijs_` prefix for namespace clarity
- **Tool Annotations** - Proper `readOnlyHint`, `destructiveHint`, etc.
- **Pagination Support** - List operations return `has_more`, `next_offset`, `total_count`
- **Character Limits** - Large content is truncated with clear notices

## Quick Start

```bash
# 1. Install package
npm install -g @hsayed21/wikijs-mcp

# 2. Configure your MCP client with WIKIJS_API_URL and WIKIJS_API_TOKEN
```

## Requirements

- **Node.js 18+**
- **Wiki.js instance** (v2.x or v3.x)
- **Wiki.js API Token** with read permissions

## Available Tools

| Tool | Description | Annotations |
|------|-------------|-------------|
| `wikijs_get_page` | Retrieve full page content and metadata | `readOnlyHint: true` |
| `wikijs_list_pages` | List pages with pagination and filtering | `readOnlyHint: true` |
| `wikijs_get_tree` | Retrieve the hierarchical Wiki.js page tree | `readOnlyHint: true` |
| `wikijs_search_pages` | Full-text search across wiki pages | `readOnlyHint: true` |

## Development

```bash
# Development with hot-reload
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Project Structure

```
wikijs-mcp/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── constants.ts       # Shared constants (CHARACTER_LIMIT, etc.)
│   ├── types.ts           # TypeScript type definitions
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # API client and error handling
│   └── tools/             # Tool implementations
├── dist/                  # Compiled JavaScript
├── evaluation.xml         # MCP evaluation test questions
└── package.json
```

## License

MIT License - See [LICENSE](./LICENSE) for details

## Author
**Markus Michalski**
- Website: [markus-michalski.net](https://markus-michalski.net)
- GitHub: [@markus-michalski](https://github.com/markus-michalski)

## Attribution

Originally authored by [@markus-michalski](https://github.com/markus-michalski). This package was updated by **hsayed21** to fit a read-only Wiki.js MCP workflow for AI support agents.

## Links

- **[Full Documentation](https://faq.markus-michalski.net/en/mcp/wikijs)** (English)
- **[Vollstaendige Dokumentation](https://faq.markus-michalski.net/de/mcp/wikijs)** (Deutsch)
- [Changelog](./CHANGELOG.md)
