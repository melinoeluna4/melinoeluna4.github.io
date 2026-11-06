---

title: "Caché en Cloudflare Workers sin romper la semántica HTTP"
description: "Qué guardo, qué no y cómo evito servir una respuesta cacheada a quien no le corresponde."
pubDate: 2026-10-14
tags: ["Cloudflare", "DevOps", "Rendimiento"]
---

La caché es una de esas optimizaciones que parecen gratuitas hasta que alguien recibe la respuesta de otra persona. En un Worker la tentación es doble: el código está cerca del usuario y `caches.default` está a una llamada de distancia.

Antes de guardar nada, suelo responder tres preguntas.

## 1. ¿La respuesta depende de la identidad?

Si la respuesta cambia según una cookie, un token o una cabecera de autorización, no debe entrar en una caché compartida. No es una regla de estilo: es una fuga de datos.

```ts
const cache = caches.default;
const key = new Request(request.url, { method: "GET" });
const cached = await cache.match(key);

if (cached) {
  return cached;
}

const response = await fetch(request);
const headers = new Headers(response.headers);

headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
headers.set("Vary", "Accept-Encoding");

const cacheable = new Response(response.body, {
  status: response.status,
  headers,
});

if (response.ok) {
  await cache.put(key, cacheable.clone());
}

return cacheable;
```

La clave importa. Si la respuesta varía por idioma, la clave debe incluir el idioma; si varía por dispositivo, la clave debe incluirlo. `Vary` ayuda al navegador, pero no sustituye una clave bien construida en el edge.

## 2. ¿Cuánto tiempo puede estar obsoleta?

`max-age` no es “cuánto tarda en caducar”: es cuánto tiempo acepto servir el valor sin revalidar. `stale-while-revalidate` permite servir una copia antigua mientras se actualiza en segundo plano.

Para una página de contenido, 60 segundos suelen ser suficientes. Para un precio o un stock, probablemente no.

## 3. ¿Qué pasa cuando el origen falla?

Una caché no debe convertir un error en una respuesta vacía. Si el origen falla y hay una copia válida, sírvela; si no hay copia, devuelve el error con su estado original. Un `200` con un cuerpo de error es peor que un `503` honesto.

## Checklist antes de desplegar

- [ ] La respuesta no contiene datos de otra sesión.
- [ ] La clave incluye todo lo que cambia el contenido.
- [ ] `Cache-Control` y `Vary` están definidos explícitamente.
- [ ] Los errores no se cachean como si fueran éxitos.
- [ ] Hay una forma de invalidar o esperar a que caduque.

La caché no arregla un diseño lento. Solo hace que el siguiente visitante no pague el precio.
