# Contributing to Wiki.js MCP Server

## Development Setup

```bash
git clone https://github.com/markus-michalski/wikijs-mcp-server.git
cd wikijs-mcp-server
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Wiki.js API credentials

# Build TypeScript
npm run build
```

## Code Style

- **Language:** TypeScript (strict mode)
- **Indentation:** 2 spaces
- **Type checking:** `npm run typecheck`
- **Comments:** English

## Architecture

```
src/
  index.ts           # Entry point, MCP server setup
  tools/             # MCP tool implementations
  services/          # Wiki.js GraphQL API client
```

### Adding a New MCP Tool

1. Create the tool handler in `src/tools/`
2. Register it in `src/index.ts`
3. Add Zod validation schema for inputs
4. Use proper tool annotations (`readOnlyHint`, `destructiveHint`, etc.)
5. All tools must use the `wikijs_` prefix

## Development Commands

```bash
npm run build       # Compile TypeScript
npm run dev         # Watch mode with tsx
npm run typecheck   # TypeScript check without emit
npm test            # Run tests (Vitest)
npm run test:watch  # Watch mode
```

## Testing

Tests use [Vitest](https://vitest.dev/). Run with `npm test`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new MCP tool
fix: correct a bug
docs: update documentation
refactor: restructure code
test: add or modify tests
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run build` and `npm run typecheck` pass
4. Open a PR with a clear description
