---

title: "Ownership en Rust: tres preguntas antes de pelear con el compilador"
description: "Una forma práctica de decidir si necesito mover, prestar o clonar, con ejemplos que el compilador acepta."
pubDate: 2026-09-30
tags: ["Rust", "Aprendizaje"]
---

Al principio, Rust parece un compilador que discute por todo. Con el tiempo, la mayoría de los errores de ownership se reducen a tres preguntas que puedo responder antes de escribir la firma de una función.

## 1. ¿La función necesita ser dueña del valor?

Si el valor debe sobrevivir a la llamada, la función necesita ownership. Si solo lo va a leer o modificar, un préstamo es suficiente.

```rust
fn normalize(input: &str) -> String {
    input.trim().to_lowercase()
}

fn main() {
    let raw = String::from("  Hola, Rust  ");
    let normalized = normalize(&raw);

    println!("{normalized}");
    println!("{raw}");
}
```

`normalize` recibe `&str` y devuelve un `String` nuevo. El `raw` sigue disponible porque solo se prestó.

## 2. ¿El préstamo puede vivir lo suficiente?

Un préstamo no puede sobrevivir al valor que presta. Si una estructura guarda una referencia, necesita un tiempo de vida explícito o debe guardar el valor completo.

```rust
struct Report<'a> {
    title: &'a str,
}

fn render(report: &Report<'_>) -> String {
    format!("# {}", report.title)
}
```

La alternativa es `String`, que simplifica la firma a cambio de una copia. Ninguna de las dos es “la correcta” sin contexto.

## 3. ¿El clon es parte del problema o de la solución?

Clonar no es un pecado. Es una decisión de diseño: pagas memoria y tiempo para evitar compartir estado. En un prototipo o en una ruta que no está en el camino caliente, puede ser la opción más clara.

Lo que intento evitar es clonar para silenciar un error que no entiendo. Si el compilador me dice que no puede prestar algo, quiero saber por qué antes de copiarlo.

## La rutina que me funciona

1. Escribo la firma con préstamos.
2. Si el valor debe persistir, cambio a ownership.
3. Si el compilador se queja de tiempos de vida, intento primero simplificar la estructura.
4. Solo clono cuando el perfil o la claridad lo justifican.

Rust no vuelve el código seguro por arte de magia. Vuelve explícitas las decisiones que en otros lenguajes quedan escondidas.
