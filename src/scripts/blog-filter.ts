import {
  type FilterablePost,
  filterPosts,
  MAX_QUERY_LENGTH,
  resultCountLabel,
} from "../lib/filter-posts";

interface FilterElement extends FilterablePost {
  readonly element: HTMLElement;
}

function readItems(list: HTMLElement): FilterElement[] {
  return [...list.querySelectorAll<HTMLElement>("[data-post-item]")].map((element) => ({
    element,
    title: element.dataset.search ?? "",
    description: "",
    tags: (element.dataset.tags ?? "").split("|").filter(Boolean),
  }));
}

export function initBlogFilter(): void {
  const form = document.querySelector<HTMLFormElement>("#blog-filter");
  const list = document.querySelector<HTMLElement>("#post-list");
  const input = document.querySelector<HTMLInputElement>("#blog-query");
  const select = document.querySelector<HTMLSelectElement>("#blog-tag");
  const count = document.querySelector<HTMLElement>("#post-count");
  const empty = document.querySelector<HTMLElement>("#filter-empty");
  const clear = document.querySelector<HTMLAnchorElement>("#blog-clear");

  if (!form || !list || !input || !select || !count || !empty || !clear) {
    return;
  }

  const items = readItems(list);
  let timer: number | undefined;

  const updateUrl = (query: string, tag: string): void => {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim().slice(0, MAX_QUERY_LENGTH);

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    if (tag) {
      params.set("tag", tag);
    }

    const search = params.toString();
    history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  };

  const apply = (query: string, tag: string, syncUrl = true): void => {
    const visible = filterPosts(items, { query, tag });
    const visibleElements = new Set(visible.map((item) => item.element));

    for (const item of items) {
      item.element.hidden = !visibleElements.has(item.element);
    }

    count.textContent = resultCountLabel(visible.length);
    empty.hidden = visible.length !== 0;

    if (syncUrl) {
      updateUrl(query, tag);
    }
  };

  const initial = new URLSearchParams(window.location.search);
  const initialQuery = (initial.get("q") ?? "").slice(0, MAX_QUERY_LENGTH);
  const initialTag = initial.get("tag") ?? "";

  input.value = initialQuery;

  if (initialTag) {
    select.value = initialTag;
  }

  apply(input.value, select.value, false);

  input.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => apply(input.value, select.value), 120);
  });

  select.addEventListener("change", () => {
    apply(input.value, select.value);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    apply(input.value, select.value);
  });

  clear.addEventListener("click", (event) => {
    event.preventDefault();
    input.value = "";
    select.value = "";
    apply("", "");
    input.focus();
  });
}
