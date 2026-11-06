---

title: "SQLite Queue"
description: "Cola de trabajos persistente sobre SQLite y D1, con reintentos, visibilidad y recuperación tras un reinicio."
tags: ["Go", "SQLite", "D1", "Cloudflare"]
status: completed
repoUrl: "https://github.com/melinoeluna4/sqlite-queue"
featured: true
startDate: 2025-11-01
endDate: 2026-01-20
order: 4
---

Una cola mínima para trabajos en segundo plano que no justifican un broker completo. El estado vive en una tabla, las transacciones hacen el trabajo pesado y los workers reclaman tareas con un lease.

## Lo que cubre

- Reintentos con backoff y límite de intentos.
- Visibilidad temporal para evitar dos workers en el mismo trabajo.
- Recuperación de leases vencidos.
- Pruebas de concurrencia con SQLite en memoria y D1.

La lección principal: la parte difícil no es encolar, es decidir qué hacer cuando el worker muere a mitad de la tarea.
