---

title: "Content collections en Astro: el build que falla por ti"
description: "Cómo un schema Zod convierte un error de frontmatter en un build fallido con nombre de archivo y campo."
pubDate: 2026-09-12
tags: ["Astro", "TypeScript", "Aprendizaje"]
---

Un blog estático tiene una ventaja enorme: si el contenido está mal, el build puede fallar antes de que el error llegue al visitante. Astro lo hace posible con content collections y un schema de Zod.

## El schema

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

Si un post olvida `description` o escribe `pubDate: "pronto"`, el build falla y señala el archivo y el campo. Eso es mucho mejor que una página con un `<time>` vacío que nadie revisa.

## La consulta

```ts
import { getCollection } from "astro:content";

const posts = await getCollection("blog", ({ data }) => !data.draft);
const sorted = posts.sort(
  (left, right) => right.data.pubDate.getTime() - left.data.pubDate.getTime(),
);
```

Los borradores se filtran en la consulta, no en la página. Si mañana cambia la regla (por ejemplo, un borrador visible solo en desarrollo), hay un único lugar que modificar.

## La ruta

```ts
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

Astro genera una página por entrada. No hay registro manual de rutas ni una lista de slugs que se queda desactualizada.

## Lo que gané

- El frontmatter es código: se valida y se tipa.
- Un borrador no se construye, así que no puede filtrarse por accidente.
- El build es la primera persona que revisa el contenido.

No es magia. Es poner la validación donde ya se ejecuta el trabajo.
