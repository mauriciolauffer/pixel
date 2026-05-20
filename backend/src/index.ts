import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/pixels', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, color, link FROM pixels').all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/pixels', async (c) => {
  try {
    const { id, color, link } = await c.req.json();
    if (id < 0 || id >= 1000000) {
      return c.json({ error: 'Invalid pixel ID' }, 400);
    }
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
