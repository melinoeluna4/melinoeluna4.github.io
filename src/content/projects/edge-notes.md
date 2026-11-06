---

title: "Edge Notes"
description: "Este portfolio y cuaderno técnico: Astro estático, content collections, tema Constructivista y fichas de las CLIs en Go."
tags: ["Astro", "TypeScript", "Tailwind CSS", "GitHub Pages"]
status: in_progress
repoUrl: "https://github.com/melinoeluna4/melinoeluna4.github.io"
demoUrl: "https://melinoeluna4.github.io"
featured: false
startDate: 2026-06-01
order: 6
---

## Qué incluye

El sitio que estás leyendo. Un proyecto deliberadamente estático: HTML generado en el build, contenido validado con Zod, tema Constructivista claro/oscuro y JavaScript solo para el tema y el filtro del blog.

## Decisiones

- Sin framework de UI en el cliente; el filtro es una mejora progresiva.
- Tokens de diseño en `@theme` y una ficha por proyecto generada desde la colección.
- Contenido en Markdown con schemas que fallan el build si el frontmatter está mal.
- Deploy automático a GitHub Pages desde `main`.

## Proyectos conectados

Las fichas de `envcheck`, `portwait`, `httpcheck` y `treehash` viven en este sitio y enlazan a sus repositorios públicos. El README de perfil de GitHub resume la colección.
