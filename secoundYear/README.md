# Warmup-11ty

A tiny Eleventy (11ty) starter site — a simple blog-style example that demonstrates:

- Nunjucks templates and includes
- Eleventy data files (including an async data file that fetches an image URL)
- A small custom filter used by templates

This project is meant for learning and experimenting with Eleventy. It keeps things minimal so you can focus on templates, data, and build behavior.

## Quick overview

- Source files: `src/`
- Build output: `public/` (configured in `.eleventy.js`)
- Key files:
  - `src/_data/catpic.js` — example data file that fetches a remote image URL using `axios`
  - `src/_data/facts.json` — an array of short facts used in templates
  - `src/_includes/post.njk` — post template that uses the `randomItem` filter
  - `.eleventy.js` — Eleventy configuration (also registers the `randomItem` filter)
- `netlify.toml` is included and set to publish the `public` directory for Netlify deployments.

## Requirements

- Node.js (v16+ recommended)
- npm
- Internet access during the build if you keep `catpic.js` fetching remote data

## Install

Clone the repository and install dependencies:

```bash
npm install
```

## Development (live preview)

Start the Eleventy development server with live reload:

```bash
npm start
```

That runs `npx @11ty/eleventy --serve --port=8088` and serves the site at http://localhost:8088 by default.

## Build (production)

To build the static site into `public/`:

```bash
npm run build
```

## How the `randomItem` filter works

In `src/_includes/post.njk` the template uses the filter like this:

```nunjucks
{% for fact in facts | randomItem %}
  <p>{{ fact }}</p>
{% endfor %}
```

`.eleventy.js` registers a `randomItem` filter. The current implementation returns a single random element wrapped in an array so the `{% for %}` loop prints one random fact. If you'd prefer different behavior (for example returning N random items), the filter can be updated to accept an argument.

## About `src/_data/catpic.js`

This example data file uses `axios` to fetch from `https://placegoat.com/` and return a value from the response. Because Eleventy executes data files at build time, network failures will break the build. If you want offline-friendly builds, either:

- Replace `catpic.js` with a static JSON or string file, or
- Add a fallback inside `catpic.js` that returns a local placeholder when the request fails.

Example fallback pattern:

```js
try {
  const result = await axios.get("https://placegoat.com/");
  return result.data.file;
} catch (e) {
  return "/img/placeholder.jpg"; // local fallback
}
```

## Deployment (Netlify)

`netlify.toml` is set to publish the `public` directory and use `npm run build` as the build command. When you connect this repo to Netlify it should work with the default settings.



## Ideas for next steps

- Make `randomItem` accept an argument (e.g., `randomItem(3)`) to return multiple random facts.
- Add a local image fallback in `catpic.js`.
- Add more posts or enhance the layout and styling in `src/css/`.

If you want, I can implement any of those improvements — tell me which one and I'll make the change.