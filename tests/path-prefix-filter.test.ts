import { describe, expect, it, vi } from 'vitest';
import { WikiJsClient } from '../src/services/client.js';
import { handleGetTree } from '../src/tools/get-tree.js';
import { handleListPages } from '../src/tools/list-pages.js';
import { handleSearchPages } from '../src/tools/search-pages.js';

describe('path filtering', () => {
  it('passes path to wikijs_list_pages client call', async () => {
    const client = {
      listPages: vi.fn().mockResolvedValue({
        pages: [],
        total: 0,
      }),
    } as unknown as WikiJsClient;

    await handleListPages(client, {
      locale: 'en',
      path: 'osticket/',
      limit: 25,
      offset: 10,
    });

    expect(client.listPages).toHaveBeenCalledWith('en', 25, 10, 'osticket/');
  });

  it('passes path to wikijs_search_pages client call', async () => {
    const client = {
      searchPages: vi.fn().mockResolvedValue({
        results: [],
        suggestions: [],
        totalHits: 0,
      }),
    } as unknown as WikiJsClient;

    await handleSearchPages(client, {
      query: 'api',
      locale: 'en',
      path: 'osticket/',
    });

    expect(client.searchPages).toHaveBeenCalledWith('api', 'en', 'osticket/');
  });

  it('requests only published pages for wikijs_get_tree', async () => {
    const client = {
      getPageTree: vi.fn().mockResolvedValue([]),
    } as unknown as WikiJsClient;

    await handleGetTree(client, {
      parent_path: 'osticket',
      mode: 'ALL',
      locale: 'en',
    });

    expect(client.getPageTree).toHaveBeenCalledWith('osticket', null, 'ALL', 'en', false);
  });

  it('passes limit=-1 to wikijs_list_pages as an unpaginated request', async () => {
    const client = {
      listPages: vi.fn().mockResolvedValue({
        pages: [],
        total: 0,
      }),
    } as unknown as WikiJsClient;

    await handleListPages(client, {
      locale: 'en',
      limit: -1,
    });

    expect(client.listPages).toHaveBeenCalledWith('en', -1, 0, null);
  });
});
