---

title: "mdtoc"
description: "CLI en Go que genera una tabla de contenidos desde los headings de un archivo Markdown e ignora los bloques de código."
tags: ["Go", "CLI", "Markdown", "Documentación"]
status: completed
repoUrl: "https://github.com/melinoeluna4/mdtoc"
demoUrl: "https://melinoeluna4.github.io/mdtoc/"
featured: false
startDate: 2026-11-05
endDate: 2026-11-06
order: 5
---

## Qué resuelve

Un README largo sin índice es un muro de texto. `mdtoc` lee los headings, ignora los bloques de código y genera una tabla de contenidos anidada con anchors al estilo GitHub.

## Uso

```text
$ mdtoc README.md

- [mdtoc](#mdtoc)
  - [Why this exists](#why-this-exists)
  - [Install](#install)
  - [Usage](#usage)
```

- `-max-depth` limita la profundidad de 1 a 6.
- `-bullet` cambia el marcador de la lista.
- Sin archivo, lee desde `stdin`.

## Decisiones

- Los bloques cercados con ``` o ~~~ se ignoran: un `#` dentro de un ejemplo no es un heading.
- Los slugs añaden `-0`, `-1` cuando dos headings se repiten.
- El parser es deliberadamente pequeño: headings ATX, no un motor Markdown completo.

## Tests

Los tests cubren el parser, los bloques de código, los slugs duplicados, la lectura desde archivo/stdin y la validación de flags. CI ejecuta `go vet`, `go test` y `go build`.
