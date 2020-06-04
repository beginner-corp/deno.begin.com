const repo = "deno-hashids";

Deno.test("get tags", async () => {
  let tags = await github(`${repo}/tags`);
  console.log(tags);
});

Deno.test("get branches", async () => {
  let branches = await github(`${repo}/branches`);
  console.log(branches);
});

async function github(path) {
  return await (await fetch(`https://api.github.com/repos/smallwins/${path}`, {
    headers: {
      Link: '<https://api.github.com/resource?page=2>; rel="next"',
    },
  })).json();
}
