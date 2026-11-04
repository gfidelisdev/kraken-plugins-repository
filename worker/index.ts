interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Se for a rota /index.json, busca a versão mais recente em tempo real direto do GitHub
    // sem depender do tempo de build do Cloudflare
    if (url.pathname === "/index.json" && request.method === "GET") {
      try {
        const ghRes = await fetch(
          "https://raw.githubusercontent.com/gfidelisdev/kraken-plugins-repository/main/public/index.json",
          {
            headers: {
              "User-Agent": "Kraken-Plugins-Repository-Cloudflare-Worker",
            },
          }
        );

        if (ghRes.ok) {
          const body = await ghRes.text();
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
              "Cache-Control": "public, max-age=10, stale-while-revalidate=60",
            },
          });
        }
      } catch (err) {
        console.warn("Failed to fetch fresh index.json from GitHub, falling back to static asset", err);
      }
    }

    // Para qualquer outra rota (página principal, CSS, JS, etc.), entrega o asset estático
    return env.ASSETS.fetch(request);
  },
};
