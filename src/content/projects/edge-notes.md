---

title: "Edge Notes"
description: "Este portfolio y cuaderno técnico: Astro estático, content collections, tema Constructivista y despliegue en GitHub Pages."
tags: ["Astro", "TypeScript", "Tailwind CSS", "GitHub Pages"]
status: in_progress
repoUrl: "https://github.com/melinoeluna4/melinoeluna4.github.io"
demoUrl: "https://melinoeluna4.github.io"
featured: true
startDate: 2026-06-01
order: 3
---

El sitio que estás leyendo. Un proyecto deliberadamente estático: HTML generado en el build, contenido validado con Zod y JavaScript solo para el tema y el filtro del blog.

## Decisiones

- Sin framework de UI en el cliente; el filtro es una mejora progresiva.
- Tokens de diseño en `@theme` y un tema Constructivista claro/oscuro.
- Contenido en Markdown con schemas que fallan el build si el frontmatter está mal.
- Deploy automático a GitHub Pages desde `main`.
