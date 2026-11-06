---

title: "envcheck"
description: "CLI en Go que compara .env con .env.example y falla antes de que el servicio arranque por una variable ausente o vacía."
tags: ["Go", "CLI", "DevOps", "Configuración"]
status: completed
repoUrl: "https://github.com/melinoeluna4/envcheck"
featured: true
startDate: 2026-11-01
endDate: 2026-11-06
order: 1
---

## Qué resuelve

Un `.env.example` sin la variable que el servicio necesita es un fallo que aparece demasiado tarde: el proceso arranca, la primera petición falla y el stack trace apunta a otro sitio. `envcheck` convierte ese error en una comprobación de una línea antes del arranque.

## Uso

```text
$ envcheck
envcheck: .env against .env.example
missing (1): DATABASE_URL
empty (1): API_TOKEN
extra (1): DEBUG
FAIL
```

- `-strict` convierte las claves extra en un fallo.
- `-json` devuelve un informe para CI.
- Sin dependencias fuera de la biblioteca estándar.

## Decisiones

- El parser acepta `export KEY=VALUE` y valores entre comillas, pero no intenta ser un shell completo.
- Las claves extra son un aviso por defecto; `-strict` las convierte en error para entornos controlados.
- Los códigos de salida distinguen un fallo de validación (`1`) de un error de uso o I/O (`2`).

## Tests

La suite cubre el parser, la comparación, el modo JSON, `-strict` y los códigos de salida. CI ejecuta `go vet`, `go test` y `go build` en cada push.
