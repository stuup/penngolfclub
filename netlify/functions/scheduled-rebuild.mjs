// Triggers a fresh deploy each morning (schedule set in netlify.toml) so that
// date-driven content — upcoming diary events — stays current.
// Create a build hook in Netlify (Site configuration → Build & deploy → Build hooks)
// and save its URL as the BUILD_HOOK_URL environment variable.
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.log("BUILD_HOOK_URL not set — skipping scheduled rebuild.");
    return new Response("skipped", { status: 200 });
  }
  const res = await fetch(hook, { method: "POST" });
  console.log(`Triggered rebuild: ${res.status}`);
  return new Response("ok", { status: 200 });
};
