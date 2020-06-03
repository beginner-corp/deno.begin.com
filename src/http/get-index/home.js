import { layout } from './_layout.js'

export async function home(req) {
  let html = `
    <li><a href=/begin-data>begin-data</a>
    <li><a href=/hashids>hashids</a>
    <hr>
    <pre>${ JSON.stringify(req, null, 2) }</pre>
  `
  return layout({
    title: 'welcome home', 
    body: html
  })
}

