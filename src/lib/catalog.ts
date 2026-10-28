import { PluginCatalogItem } from "@/types";

const LOCAL_STORAGE_KEY = "kraken_repository_custom_plugins";

// Load plugins from public/index.json + any locally added ones
export async function loadCatalogPlugins(): Promise<PluginCatalogItem[]> {
  let basePlugins: PluginCatalogItem[] = [];

  try {
    const res = await fetch("./index.json");
    if (res.ok) {
      const data = await res.json();
      basePlugins = data.plugins || [];
    }
  } catch (err) {
    console.warn("Could not load public/index.json, falling back to local store", err);
  }

  // Merge with locally stored plugins (session/browser database)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const custom: PluginCatalogItem[] = JSON.parse(stored);
        const map = new Map<string, PluginCatalogItem>();
        basePlugins.forEach((p) => map.set(p.id, p));
        custom.forEach((p) => map.set(p.id, p));
        return Array.from(map.values());
      }
    } catch (e) {
      console.error("Failed to read local storage plugins", e);
    }
  }

  return basePlugins;
}

// Save a newly submitted plugin to the browser local database
export function saveCustomPlugin(plugin: PluginCatalogItem): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: PluginCatalogItem[] = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((p) => p.id === plugin.id);
    if (index >= 0) {
      list[index] = plugin;
    } else {
      list.push(plugin);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save custom plugin", e);
  }
}
