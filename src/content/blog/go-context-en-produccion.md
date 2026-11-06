---

title: "Context en Go: cancelar antes de que duela"
description: "Cómo uso context para que una petición no siga viva cuando el cliente ya se fue, con un ejemplo pequeño y comprobable."
pubDate: 2026-10-28
updatedDate: 2026-11-02
tags: ["Go", "Backend", "Patrones"]
---

Una petición HTTP no es una promesa. El cliente puede cerrar la conexión, el proxy puede cortar y el presupuesto de tiempo puede agotarse. Si el servidor sigue trabajando como si nada, el trabajo se paga igual: en CPU, en memoria y en consultas que ya no le importan a nadie.

`context` es la forma que tiene Go de propagar esa señal. No es un logger ni un contenedor de dependencias: es un árbol de cancelación con una fecha límite.

## El handler que olvida cancelar

Este handler parece correcto y, sin embargo, sigue trabajando después de que el cliente se fue:

```go
func handler(w http.ResponseWriter, r *http.Request) {
	result, err := service.Lookup(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "lookup failed", http.StatusInternalServerError)
		return
	}

	_ = json.NewEncoder(w).Encode(result)
}
```

El arreglo es pequeño: pasar `r.Context()` y comprobarlo en cada operación que pueda bloquear.

```go
func handler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	result, err := service.Lookup(ctx, r.URL.Query().Get("id"))
	if err != nil {
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			return
		}

		http.Error(w, "lookup failed", http.StatusInternalServerError)
		return
	}

	_ = json.NewEncoder(w).Encode(result)
}
```

## Tres reglas que me ahorran ruido

1. **El contexto va primero y se llama `ctx`.** Si una función puede bloquear, recibe un `context.Context` como primer parámetro.
2. **Nunca guardes un contexto en una estructura.** Se pasa por llamada; el contexto de una petición no debe sobrevivir a la petición.
3. **Deriva, no sustituyas.** Si necesitas un límite propio, usa `context.WithTimeout` sobre el contexto recibido para no perder la cancelación del padre.

```go
ctx, cancel := context.WithTimeout(parent, 2*time.Second)
defer cancel()

return repo.Find(ctx, id)
```

El `defer cancel()` no es opcional: libera el temporizador y permite que el recolector haga su trabajo. Un contexto sin cancelar es una fuga silenciosa.

## Qué comprobar en una revisión

- ¿La función comprueba `ctx.Err()` antes de empezar?
- ¿Las llamadas a la base de datos, HTTP o disco reciben el contexto?
- ¿El error de cancelación se distingue de un fallo real?
- ¿Hay un `defer cancel()` por cada contexto derivado?

No hace falta instrumentar todo. Basta con que el camino crítico de una petición pueda detenerse cuando ya no hay nadie esperando.
