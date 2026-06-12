/**
 * Zod Schemas for Wiki.js MCP Server Tools
 *
 * All input validation schemas with proper constraints and descriptions
 */

import { z } from 'zod';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '../constants.js';

// Common schemas
const localeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Locale must be a valid language code (e.g., "en", "de", "en-US")')
  .default('en')
  .describe('Page locale (e.g., "en", "de")');

const pageIdSchema = z
  .number()
  .int()
  .positive()
  .describe('Page ID (positive integer)');

const pagePathSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9\-_/]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/,
    'Path must contain only alphanumeric characters, hyphens, underscores, and forward slashes'
  )
  .refine(
    (path) => !path.includes('..') && !path.includes('//'),
    'Path must not contain ".." or "//"'
  )
  .describe('Page path without leading slash (e.g., "osticket/plugin-name" or "home")');

const pathFilterSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9\-_/]*$/,
    'Path must contain only alphanumeric characters, hyphens, underscores, and forward slashes'
  )
  .refine(
    (path) => !path.includes('..') && !path.includes('//'),
    'Path must not contain ".." or "//"'
  )
  .describe('Only return pages where the path starts with this value (e.g., "osticket/" or "support")');

// Get Page Schema
export const getPageSchema = z.object({
  id: pageIdSchema.optional().describe('Page ID (optional if path is provided)'),
  path: pagePathSchema.optional().describe('Page path (optional if id is provided)'),
  locale: localeSchema,
});

export type GetPageInput = z.infer<typeof getPageSchema>;

// List Pages Schema
export const listPagesSchema = z.object({
  locale: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Locale must be a valid language code')
    .optional()
    .describe('Filter by locale (optional, e.g., "en", "de")'),
  path: pathFilterSchema.optional(),
  limit: z
    .number()
    .int()
    .min(-1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT)
    .describe(`Maximum number of pages to return (default: ${DEFAULT_PAGE_LIMIT}, max: ${MAX_PAGE_LIMIT}). Use -1 to return all matching pages.`),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('Number of pages to skip for pagination (default: 0)'),
});

export type ListPagesInput = z.infer<typeof listPagesSchema>;

// Search Pages Schema
export const searchPagesSchema = z.object({
  query: z
    .string()
    .min(2)
    .max(200)
    .describe('Search query string (minimum 2 characters)'),
  locale: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Locale must be a valid language code')
    .optional()
    .describe('Filter results by locale (optional)'),
  path: pathFilterSchema.optional(),
});

export type SearchPagesInput = z.infer<typeof searchPagesSchema>;

// Get Page Tree Schema
export const getTreeSchema = z.object({
  parent_path: z
    .string()
    .max(500)
    .optional()
    .describe('Optional parent path to start the tree from. Use empty/omit for the wiki root.'),
  parent_id: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Optional parent tree node ID to start from. Usually path is easier for agents.'),
  mode: z
    .enum(['ALL', 'FOLDERS', 'PAGES'])
    .default('ALL')
    .describe('Tree mode: ALL returns folders and pages, FOLDERS returns folders only, PAGES returns pages only.'),
  locale: localeSchema,
  includeAncestors: z
    .boolean()
    .default(false)
    .describe('Whether to include ancestor nodes for the selected path/parent.'),
});

export type GetTreeInput = z.infer<typeof getTreeSchema>;
