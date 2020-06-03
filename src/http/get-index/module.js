export async function mod(req) {
  let parts = req.path.split('/').filter(Boolean)
  let rep = req.path.split('/').slice(0).filter(Boolean).shift()
  let file = req.path.split('/').slice(0).pop()
  if (parts.length > 1) {
    // list file contents
    let repo = `smallwins/deno-${ rep }`
    let files = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`)
    let json = await files.json()
    return '<pre>'+atob(json.content)
  }
  else {
    // listing repo contents
    let repo = `smallwins/deno-${ rep }`
    let files = await fetch(`https://api.github.com/repos/${repo}/contents/`)
    let json = await files.json()
    let html = json.map(i=> i.name).map(i=> `<li><a href=${req.path}/${i}>${ i }</a>`)
    return html.join('')
  }
}
