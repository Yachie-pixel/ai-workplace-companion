export type Preferences = {
  displayName: string;
  role: string;
  organization: string;
  defaultTone: string;
  signature: string;
};

const KEY = "awpa.preferences.v1";

export const defaultPreferences: Preferences = {
  displayName: "",
  role: "",
  organization: "",
  defaultTone: "Formal",
  signature: "",
};

export function loadPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultPreferences, ...(JSON.parse(raw) as Preferences) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(prefs: Preferences) {
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
}
