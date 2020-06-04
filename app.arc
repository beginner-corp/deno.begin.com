@app
deno-mods

@http
get /

@begin
lint "deno fmt"
test "deno test -A --unstable test"

@aws
runtime deno
