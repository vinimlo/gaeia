import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { VAULT_ROOT, UNIVERSE_DIR, CHECKBOX_PATTERN_GLOBAL } from '../../../utils/constants';

// In static mode (GitHub Pages), this route is not used
// The frontend uses localStorage directly instead
const isStaticMode = import.meta.env.PUBLIC_MODE === 'static';
export const prerender = isStaticMode;

// In static mode, provide empty paths (route won't be generated)
// In hybrid mode, this is not called because prerender = false
export const getStaticPaths: GetStaticPaths = () => {
  return [];
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { topicoId } = params;

  if (!topicoId) {
    return new Response(JSON.stringify({ error: 'topicoId required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { itemIndex: number; checked: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { itemIndex, checked } = body;

  if (typeof itemIndex !== 'number' || typeof checked !== 'boolean') {
    return new Response(JSON.stringify({ error: 'itemIndex (number) and checked (boolean) required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filePath = join(VAULT_ROOT, UNIVERSE_DIR, 'topicos', `${topicoId}.md`);

  try {
    const content = await readFile(filePath, 'utf-8');

    let currentIndex = 0;
    const updatedContent = content.replace(CHECKBOX_PATTERN_GLOBAL, (match, prefix, _checkChar, suffix) => {
      if (currentIndex === itemIndex) {
        currentIndex++;
        return `${prefix}${checked ? 'x' : ' '}${suffix}`;
      }
      currentIndex++;
      return match;
    });

    await writeFile(filePath, updatedContent, 'utf-8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update checklist:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
