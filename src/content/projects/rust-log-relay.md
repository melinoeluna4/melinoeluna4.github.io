---

title: "Rust Log Relay"
description: "Relay de logs con backpressure para no perder eventos cuando el destino es más lento que la aplicación."
tags: ["Rust", "Tokio", "Docker"]
status: in_progress
repoUrl: "https://github.com/melinoeluna4/rust-log-relay"
featured: true
startDate: 2026-03-10
order: 2
---

Un servicio pequeño que recibe líneas de log por TCP, las agrupa y las reenvía a un colector con límite de memoria.

El objetivo no es competir con una plataforma de observabilidad: es entender qué pasa cuando el productor no puede esperar y el consumidor se queda atrás.

## Estado actual

- Canal acotado con `tokio::sync::mpsc`.
- Política explícita de descarte cuando el buffer está lleno.
- Métricas básicas de eventos aceptados y descartados.
- Pendiente: pruebas de carga y reconexión del colector.
