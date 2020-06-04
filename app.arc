@app
deno-mods

@http
get /
get /headers

@begin
lint "deno fmt && deno --version"
test "deno test -A --unstable test"

@aws
runtime deno
