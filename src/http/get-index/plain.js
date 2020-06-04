export async function plain(path) {
  let ledger = {};

  async function memo(path) {
    let bits = path.split("/").filter(Boolean);
    let [mod, version] = bits.shift().split("@");
    let base = "https://api.github.com/repos";
    let repo = `smallwins/deno-${mod}`;
    let files = await fetch(
      `${base}/${repo}/contents/${bits.join("/")}?ref=${version}`,
    );
    let json = await files.json();
    return {
      statusCode: 200,
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
        "content-type": `${
          json.content ? "text/plain" : "text/html"
        }; charset=utf8`,
      },
      body: json.content ? atob(json.content) : render(json),
    };
  }

  function render(json) {
    let html = `<ul><li><a href=/>home</a></li>`;
    html +=
      json.map((v) =>
        `<li><a href=${path.split("@")}/${v.path}>${v.path}</a></li>`
      ).join("");
    return html + "</ul>"
  }

  if (!ledger[path]) {
    ledger[path] = await memo(path);
  }
  return ledger[path];
}
