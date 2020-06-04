@app
deno-mods

@http
get /

@begin
lint "deno fmt && deno --version"
test "deno test -A --unstable test"

@aws
runtime deno
