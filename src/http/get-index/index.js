import { home } from "./home.js";
//import { getTags } from "./get_tags.js";
import { branch } from "./branch.js";
import { plain } from "./plain.js";

export async function handler (req) {
  return {
    body: JSON.stringify(req)
  }
}
// /modulename            -> modulename@master
// /modulename@latest     -> modulename@1.1.11
// /modulename@branchname -> modulename@branchname
// /modulename@v1.0.0
export async function handlers(req) {
  //
  // render home page
  if (req.path === "/") {
    return home();
  }

  // not home! maybe redirect; maybe render html
  let parts = req.path.split("/").filter(Boolean); // ['modulename@v1.0.8', 'mod.ts']
  let first = parts[0]; // modulename@v1.0.8
  let redirect = (b) => ({
    statusCode: 302,
    headers: { location: b.join("/") },
  });

  // redirect to @master if no branch or tag is specified
  if (first.includes("@") === false) {
    parts[0] = `/${parts[0]}@master`;
    return redirect(parts);
  }

  /*
  // render versions for the given module
  if (first.includes("@") && first.split("@")[1] === "versions") {
    let tags = await getTags(first);
    let html = `<ul><li><a href=/>home</a></li>`;
    html += tags.map((v) =>
      `<li><a href=${first.split("@")[0]}@${v}>${v}</a></li>`
    ).join("") + "</ul>";
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
  // redirect @latest to most recent semver tag
  if (first.includes("@") && first.split("@")[1] === "latest") {
    // get all tags
    let tags = await getTags(first);
    // get most recent tag
    let last = tags[0];
    parts[0] = `/${parts[0].replace("latest", last)}`;
    return redirect(parts);
  }
  */

  console.log(Object.keys(req.headers))

  let isHTML = (req.headers.accept && req.headers.accept.startsWith("text/html")) ||
    (req.headers.Accept && req.headers.Accept.startsWith("text/html"));
  if (isHTML) {
    let body = "failed";
    console.log('rendering html')
    try {
      console.log('before branch body', req)
      body = await branch(req.path);
    } catch (e) {
      console.log("meaningful error maybe", e);
    }
    return {
      statusCode: 200,
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
        "content-type": "text/html; charset=utf8",
      },
      body: await branch(req.path),
    };
  }

  return plain(req.path)
}
