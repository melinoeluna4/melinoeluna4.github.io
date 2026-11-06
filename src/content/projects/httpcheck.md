---

title: "httpcheck"
description: "CLI en Go para smoke tests HTTP con reintentos, timeout y código de estado esperado."
tags: ["Go", "CLI", "HTTP", "Observabilidad"]
status: completed
repoUrl: "https://github.com/melinoeluna4/httpcheck"
featured: true
startDate: 2026-11-03
endDate: 2026-11-06
order: 3
---

## Qué resuelve

Un despliegue no termina cuando el contenedor arranca: termina cuando `/health` responde con el código que esperas. `httpcheck` hace esa comprobación repetible y la convierte en el último paso de un pipeline.

## Uso

```text
$ httpcheck https://melinoeluna4.github.io/
httpcheck: 1 URL(s), expecting 200
  https://melinoeluna4.github.io/ 200 231ms
OK
```

- `-expect` cambia el código esperado.
- `-retries` y `-interval` absorben un arranque lento.
- `-json` devuelve un array de resultados para CI.

## Decisiones

- El cuerpo se lee y se cierra para que la conexión se pueda reutilizar.
- Un error de red y un código inesperado se reportan de forma distinta.
- Los reintentos solo se aplican a fallos o códigos que no coinciden; un `200` termina el bucle.

## Tests

Los tests usan `httptest` para cubrir éxito, reintento, código inesperado, error de red y salida JSON. CI ejecuta `go vet`, `go test` y `go build`.
