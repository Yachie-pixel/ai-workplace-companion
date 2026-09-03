export type SavedKind = "email" | "research" | "chat";

export type SavedItem = {
  id: string;
  kind: SavedKind;
  title: string;
  content: string;
  createdAt: number;
};

const KEY = "awpa.saved-work.v1";

function read(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: SavedItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("awpa:saved-work"));
}

export function listSaved(): SavedItem[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveItem(kind: SavedKind, title: string, content: string): SavedItem {
  const item: SavedItem = {
    id: crypto.randomUUID(),
    kind,
    title: title.trim() || "Untitled",
    content,
    createdAt: Date.now(),
  };
  write([item, ...read()]);
  return item;
}

export function updateItem(id: string, content: string) {
  write(read().map((i) => (i.id === id ? { ...i, content } : i)));
}

export function deleteItem(id: string) {
  write(read().filter((i) => i.id !== id));
}
