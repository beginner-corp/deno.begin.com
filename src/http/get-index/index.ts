import { home } from './home.js'
import { mod } from './module.js'

export async function handler(req: {path: string}) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: req.path === '/' ? await home(req) : await mod(req)
  };
}
