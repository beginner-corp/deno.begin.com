import { layout } from "./_layout.js";

export function home() {
  let html = layout({
    title: "Begin.com Deno modules",
    body: `
      <li><a href=/begin-data>begin-data</a>
      <li><a href=/hashids>hashids</a>
    `,
  });
  return {
    statusCode: 200,
    headers: {
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      "content-type": "text/html; charset=utf8",
    },
    body: html,
  };
}
