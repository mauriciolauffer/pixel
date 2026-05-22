import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { BILLBOARD_WIDTH, BILLBOARD_HEIGHT } from '@pixel/shared';

type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', secureHeaders());
app.use('*', cors());

const pixelSchema = z.object({
  id: z.number().int().min(0).max(BILLBOARD_WIDTH * BILLBOARD_HEIGHT - 1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color format'),
  link: z.string().max(255).and(z.string().url().or(z.string().length(0))),
});

app.get('/pixels', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, color, link FROM pixels').all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/pixels', zValidator('json', pixelSchema), async (c) => {
  try {
    const { id, color, link } = c.req.valid('json');
    await c.env.DB.prepare(
      'INSERT INTO pixels (id, color, link) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET color = EXCLUDED.color, link = EXCLUDED.link, updated_at = CURRENT_TIMESTAMP'
    )
      .bind(id, color, link)
      .run();
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
