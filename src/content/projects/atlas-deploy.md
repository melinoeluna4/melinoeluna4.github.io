---

title: "Atlas Deploy"
description: "CLI en Go que empaqueta, versiona y despliega servicios pequeños en Cloudflare con un solo comando reproducible."
tags: ["Go", "Cloudflare", "Docker", "GitHub Actions"]
status: completed
repoUrl: "https://github.com/melinoeluna4/atlas-deploy"
featured: true
startDate: 2025-09-01
endDate: 2026-02-15
order: 1
---

Atlas Deploy nació de una fricción concreta: cada proyecto pequeño acababa con su propio script de despliegue, sus variables copiadas a mano y una lista distinta de pasos.

La CLI lee un archivo de configuración, construye la imagen, etiqueta la versión con el commit y ejecuta el despliegue. Si un paso falla, el anterior se revierte y el comando termina con un código distinto de cero.

## Lo que aprendí

- Un despliegue reproducible necesita una versión inmutable, no una etiqueta `latest`.
- Los mensajes de error son parte de la interfaz: si el comando falla, debe decir qué archivo o variable revisar.
- GitHub Actions es más útil cuando el mismo comando se puede ejecutar en local.
