import { compare } from "https://deno.land/x/semver/mod.ts";

/** get tags for given module */
export async function getTags(first) {
  let ledger = {};
  async function memo() {
    let repo = first.split("@")[0];
    let tags = await (await fetch(
      `https://api.github.com/repos/smallwins/deno-${repo}/tags`,
      {
        headers: {
          Link: '<https://api.github.com/resource?page=2>; rel="next"',
        },
      },
    )).json();
    return tags.map((t) => t.name).sort(compare);
  }
  if (!ledger[first]) {
    ledger[first] = await memo();
  }
  return ledger[first];
}
