
  let raw = await fetch('https://api.github.com/orgs/smallwins/repos?per_page=15', {
    headers: {
      Link: `<https://api.github.com/resource?page=2>; rel="next"`
    }
  })

  if (raw.status === 403) {
    let rl = raw.headers.get('X-RateLimit-Reset')
    console.log('RATE LIMIT RESET', new Date(rl* 1000))
  }

  let json = await raw.json()
  let next = raw.headers.get('Link').match(/^\<(\S*)\>/g)[0].replace(/\<|\>/g, '')
  let raw2 = await fetch(next)
  let json2 = await raw2.json()
  let leading = 'smallwins/deno-'
  let result = json.concat(json2).map(o=> o.full_name).filter(o=> o.startsWith(leading) || o === 'deno.town')
  let html = result.map(i=> `<li><a href=/${i.replace(leading, '')}>${i.replace(leading, '')}</a>`)


