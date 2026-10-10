import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import icons from "./src/_data/icons.js";

export default function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Static files
  // ---------------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy({
    "src/assets/brand": "assets/brand",
    "src/assets/js": "assets/js",
    "src/assets/images": "assets/images",
    "src/documents": "documents",
    "src/admin/config.yml": "admin/config.yml",
    "src/_redirects": "_redirects",
    "src/assets/brand/favicon.svg": "favicon.svg",
  });

  // Tailwind writes straight into _site; reload the browser when it does.
  eleventyConfig.setServerOptions({ watch: ["_site/assets/css/**/*.css"] });
  eleventyConfig.addWatchTarget("src/assets/css/");

  // ---------------------------------------------------------------------------
  // Responsive images: every <img> in the output is converted to AVIF/WebP/JPEG
  // with srcset. Add `eleventy:ignore` to an <img> to opt out.
  // ---------------------------------------------------------------------------
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 960, 1600, "auto"],
    urlPath: "/assets/img/",
    outputDir: "./_site/assets/img/",
    failOnError: true,
    htmlOptions: {
      imgAttributes: { loading: process.env.EAGER_IMAGES ? "eager" : "lazy", decoding: "async" },
      pictureAttributes: {},
    },
  });

  // ---------------------------------------------------------------------------
  // News feed
  // ---------------------------------------------------------------------------
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/news/feed.xml",
    collection: { name: "news", limit: 20 },
    metadata: {
      language: "en-GB",
      title: "Penn Golf Club News",
      subtitle: "News, results and announcements from Penn Golf Club.",
      base: "https://www.penngolfclub.co.uk/",
      author: { name: "Penn Golf Club" },
    },
  });

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------
  eleventyConfig.addCollection("news", (api) =>
    api.getFilteredByGlob("src/news/posts/*.md").sort((a, b) => b.date - a.date),
  );

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------
  const toDate = (value) => (value instanceof Date ? value : new Date(value));
  const fmt = (opts) => (value) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", ...opts }).format(toDate(value));

  eleventyConfig.addFilter("dateLong", fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("dateMedium", fmt({ day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("dateShort", fmt({ day: "numeric", month: "short" }));
  eleventyConfig.addFilter("dayNum", fmt({ day: "numeric" }));
  eleventyConfig.addFilter("monthShort", fmt({ month: "short" }));
  eleventyConfig.addFilter("weekdayShort", fmt({ weekday: "short" }));
  eleventyConfig.addFilter("yearOf", fmt({ year: "numeric" }));
  eleventyConfig.addFilter("isoDate", (value) => toDate(value).toISOString());
  eleventyConfig.addFilter("isoDay", (value) => toDate(value).toISOString().slice(0, 10));

  eleventyConfig.addFilter("money", (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n),
  );
  eleventyConfig.addFilter("money2", (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n),
  );
  eleventyConfig.addFilter("number", (n) => new Intl.NumberFormat("en-GB").format(n));
  eleventyConfig.addFilter("telHref", (s) => "tel:+44" + String(s).replace(/\D/g, "").replace(/^0/, ""));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());
  eleventyConfig.addFilter("sumBy", (arr, key) => arr.reduce((t, x) => t + Number(x[key] || 0), 0));
  eleventyConfig.addFilter("sum", (arr) => arr.reduce((t, x) => t + Number(x), 0));
  eleventyConfig.addFilter("sectionFor", (nav, url) => nav.find((item) => item.children?.some((c) => c.url === url)) || null);
  eleventyConfig.addFilter("slice", (arr, start, end) => arr.slice(start, end));

  // Events split by the build date (Netlify rebuilds daily — see netlify.toml)
  const today = () => new Date(new Date().toISOString().slice(0, 10));
  eleventyConfig.addFilter("upcoming", (events) =>
    events.filter((e) => toDate(e.endDate || e.date) >= today()).sort((a, b) => toDate(a.date) - toDate(b.date)),
  );
  eleventyConfig.addFilter("past", (events) =>
    events.filter((e) => toDate(e.endDate || e.date) < today()).sort((a, b) => toDate(b.date) - toDate(a.date)),
  );

  // ---------------------------------------------------------------------------
  // Shortcodes
  // ---------------------------------------------------------------------------
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));
  eleventyConfig.addShortcode("icon", (name, cls = "size-5") => {
    const body = icons[name];
    if (!body) throw new Error(`Unknown icon "${name}"`);
    return `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
