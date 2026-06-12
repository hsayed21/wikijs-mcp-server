/**
 * wikijs_get_tree Tool
 *
 * Retrieves the hierarchical Wiki.js page tree
 */

import { z } from 'zod';
import type { WikiJsClient } from '../services/client.js';
import { getTreeSchema, type GetTreeInput } from '../schemas/index.js';
import { handleToolError } from '../services/error-handler.js';

export const getTreeToolDefinition = {
  name: 'wikijs_get_tree',
  description: `Get the hierarchical Wiki.js page tree.

This read-only tool helps support agents understand the published knowledge base structure before retrieving individual pages.

Args:
  - parent_path (string, optional): Parent path to start from. Omit for wiki root.
  - parent_id (number, optional): Parent tree node ID to start from.
  - mode (string): ALL, FOLDERS, or PAGES. Default "ALL".
  - locale (string): Page locale, default "en".
  - includeAncestors (boolean): Include ancestor nodes, default false.

Returns:
  A readable depth-indented tree of published pages. Folders are shown only when they contain published pages.

Examples:
  - Get whole English tree: locale="en"
  - Get only folders: mode="FOLDERS", locale="en"
  - Get subtree: parent_path="osticket", locale="en"`,
  inputSchema: getTreeSchema,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
};

export async function handleGetTree(
  client: WikiJsClient,
  args: z.infer<typeof getTreeSchema>
): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> {
  try {
    const validated: GetTreeInput = getTreeSchema.parse(args);

    const tree = await client.getPageTree(
      validated.parent_path || null,
      validated.parent_id ?? null,
      validated.mode,
      validated.locale,
      validated.includeAncestors
    );

    if (tree.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No pages found in tree',
          },
        ],
      };
    }

    const parentLabel = validated.parent_path?.trim() || 'root';
    const lines = [
      `Wiki page tree from '${parentLabel}' (mode: ${validated.mode}, locale: ${validated.locale}):`,
      '',
    ];

    for (const item of tree) {
      const indent = '  '.repeat(Math.max(0, item.depth));
      if (item.isFolder) {
        lines.push(`${indent}📁 ${item.title}/`);
      } else {
        lines.push(`${indent}📄 ${item.title} (${item.path})`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: lines.join('\n'),
        },
      ],
    };
  } catch (error) {
    return handleToolError(error, 'wikijs_get_tree');
  }
}
