// Fake session for the demo: no backend, everything lives in localStorage so
// the state survives a refresh mid-presentation. `clearAll` powers the
// "reset demo" control.

export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

export type ViewedItem = {
  paperSlug: string;
  paperTitle: string;
  topicId: string;
  topicLabel: string;
  at: number;
};

const USER_KEY = "myesomar.user";
const VIEWED_KEY = "myesomar.viewed";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getViewed(): ViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VIEWED_KEY);
    return raw ? (JSON.parse(raw) as ViewedItem[]) : [];
  } catch {
    return [];
  }
}

export function addViewed(item: Omit<ViewedItem, "at">) {
  // De-duplicate on paper slug, most recent first
  const rest = getViewed().filter((v) => v.paperSlug !== item.paperSlug);
  const next = [{ ...item, at: Date.now() }, ...rest].slice(0, 10);
  window.localStorage.setItem(VIEWED_KEY, JSON.stringify(next));
}

export function clearAll() {
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(VIEWED_KEY);
}
