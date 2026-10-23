/**
 * Session persistence layer using LocalStorage
 * Saves wardrobe, plans, favorites, and skin tone across page refreshes
 */

const STORAGE_KEYS = {
  OWNED: "sangeetfit_owned",
  WEEK_PLAN: "sangeetfit_week_plan",
  FAVORITES: "sangeetfit_favorites",
  SKIN_COLOR: "sangeetfit_skin_color",
  SKIN_MODE: "sangeetfit_skin_mode",
  LOOKS: "sangeetfit_looks",
  ACCASION: "sangeetfit_occasion",
} as const;

interface WeekPlanEntry {
  occasion: string;
  outfitId: string;
  assignedTo?: string;
}

interface SerializableFavoriteSet {
  entries: string[];
}

/**
 * Save session data to LocalStorage
 */
export function persistSession(
  data: {
    owned?: unknown[];
    weekPlan?: WeekPlanEntry[];
    favorites?: Set<string>;
    skinColor?: string | null;
    skinMode?: string | null;
    looks?: unknown[];
    occasion?: string;
  }
): void {
  try {
    if (data.owned !== undefined) {
      localStorage.setItem(STORAGE_KEYS.OWNED, JSON.stringify(data.owned));
    }
    if (data.weekPlan !== undefined) {
      localStorage.setItem(STORAGE_KEYS.WEEK_PLAN, JSON.stringify(data.weekPlan));
    }
    if (data.favorites) {
      const favData: SerializableFavoriteSet = { entries: Array.from(data.favorites) };
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favData));
    }
    if (data.skinColor !== undefined) {
      if (data.skinColor === null) localStorage.removeItem(STORAGE_KEYS.SKIN_COLOR);
      else localStorage.setItem(STORAGE_KEYS.SKIN_COLOR, data.skinColor);
    }
    if (data.skinMode !== undefined) {
      if (data.skinMode === null) localStorage.removeItem(STORAGE_KEYS.SKIN_MODE);
      else localStorage.setItem(STORAGE_KEYS.SKIN_MODE, data.skinMode);
    }
    if (data.looks !== undefined) {
      localStorage.setItem(STORAGE_KEYS.LOOKS, JSON.stringify(data.looks));
    }
    if (data.occasion !== undefined) {
      localStorage.setItem(STORAGE_KEYS.ACCASION, data.occasion);
    }
  } catch (e) {
    // Storage unavailable - silently continue
    console.warn("Failed to persist session:", e);
  }
}

/**
 * Load session data from LocalStorage
 */
export function loadSession(): {
  owned: unknown[];
  weekPlan: WeekPlanEntry[];
  favorites: Set<string>;
  skinColor: string | null;
  skinMode: string | null;
  looks: unknown[];
  occasion: string;
} {
  try {
    const ownedJson = localStorage.getItem(STORAGE_KEYS.OWNED);
    const weekPlanJson = localStorage.getItem(STORAGE_KEYS.WEEK_PLAN);
    const favoritesJson = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const skinColor = localStorage.getItem(STORAGE_KEYS.SKIN_COLOR);
    const skinMode = localStorage.getItem(STORAGE_KEYS.SKIN_MODE);
    const looksJson = localStorage.getItem(STORAGE_KEYS.LOOKS);
    const occasion = localStorage.getItem(STORAGE_KEYS.ACCASION);

    return {
      owned: ownedJson ? JSON.parse(ownedJson) : [],
      weekPlan: weekPlanJson ? JSON.parse(weekPlanJson) : [],
      favorites: new Set(favoritesJson ? JSON.parse(favoritesJson).entries : []),
      skinColor: skinColor || null,
      skinMode: skinMode || null,
      looks: looksJson ? JSON.parse(looksJson) : [],
      occasion: occasion || "",
    };
  } catch (e) {
    // Return empty state on error
    return {
      owned: [],
      weekPlan: [],
      favorites: new Set(),
      skinColor: null,
      skinMode: null,
      looks: [],
      occasion: "",
    };
  }
}

/**
 * Clear all persisted session data
 */
export function clearSession(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.warn("Failed to clear session:", e);
  }
}
