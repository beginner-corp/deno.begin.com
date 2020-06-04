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
    //if (json.content) return atob(json.content);
    //else return json
    return { 
      statusCode: 200,
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
        "content-type": `${ json.content? 'text/plain' : 'application/json' }; charset=utf8`,
      },
      body: json.content? atob(json.content) : json
    };
    /*
    } else {
      //console.log('branch called with path', path, json)
      let files = json.map((f) => ({
        name: f.name,
        path: f.path,
        type: f.type,
        raw: f.download_url,
      }));
      let link = (f) => `<li><a href=${path}/${f.path}>${f.path}</a></li>`;
      let html = files.map(link).join("\n");
      return html;
    }*/
  }

  if (!ledger[path]) {
    ledger[path] = await memo(path);
  }
  return ledger[path];
}
