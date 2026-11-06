---

title: "portwait"
description: "CLI en Go que espera a que los puertos TCP acepten conexiones, sin sleeps frágiles en CI ni en docker-compose."
tags: ["Go", "CLI", "Docker", "CI"]
status: completed
repoUrl: "https://github.com/melinoeluna4/portwait"
featured: true
startDate: 2026-11-02
endDate: 2026-11-06
order: 2
---

## Qué resuelve

`depends_on` arranca el contenedor, no el servicio que vive dentro. Un `sleep 10` es una apuesta: a veces sobra y a veces no llega. `portwait` sondea el puerto real y termina en cuanto todos los endpoints están listos.

## Uso

```text
$ portwait localhost:5432 localhost:6379
waiting for 2 endpoint(s), timeout 30s
  localhost:5432 ready (8ms)
  localhost:6379 ready (12ms)
all endpoints ready in 12ms
```

- `-timeout` controla el presupuesto total.
- `-interval` controla la frecuencia de sondeo.
- Cada endpoint se imprime una sola vez, en cuanto responde.

## Decisiones

- El dial timeout se limita a un segundo para que una dirección que no responde no consuma todo el presupuesto en un solo intento.
- Las direcciones se validan con `net.SplitHostPort`; un `host:port` incompleto falla con código `2`.
- La lógica de espera recibe un `context` y una función de dial, así los tests pueden simular reintentos sin abrir puertos reales.

## Tests

Los tests cubren un listener real, el timeout, los reintentos y una dirección inválida. CI ejecuta `go vet`, `go test` y `go build`.
