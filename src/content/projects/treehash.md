---

title: "treehash"
description: "CLI en Go que calcula un SHA-256 determinista de un árbol de directorios para cache keys y manifiestos de despliegue."
tags: ["Go", "CLI", "SHA-256", "CI"]
status: completed
repoUrl: "https://github.com/melinoeluna4/treehash"
featured: true
startDate: 2026-11-04
endDate: 2026-11-06
order: 4
---

## Qué resuelve

Una marca de tiempo no es una cache key, y un commit no siempre basta cuando el build depende de archivos generados. `treehash` recorre el árbol, ordena los archivos y combina sus hashes con las rutas relativas para obtener una huella estable.

## Uso

```text
$ treehash
9c1d8f0e4b4f7c3b1f6a2d5e8c0b7a9d6e3f1c2b4a5d6e7f8a9b0c1d2e3f4a5b  .  (42 files)
```

- `-exclude` omite nombres como `.git`, `node_modules` o `dist`.
- `-json` devuelve `root`, `files` y `hash`.
- El mismo árbol produce el mismo hash en cualquier máquina.

## Decisiones

- El manifiesto incluye la ruta relativa de cada archivo: renombrar un archivo cambia el hash aunque su contenido no cambie.
- Solo se hashean archivos regulares; symlinks, sockets y dispositivos se omiten.
- Se ordena antes de combinar para que el orden de recorrido no afecte al resultado.

## Tests

Los tests cubren determinismo, cambio de contenido, exclusión, raíz inválida y salida JSON. CI ejecuta `go vet`, `go test` y `go build`.
