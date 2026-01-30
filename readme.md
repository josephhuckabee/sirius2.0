# Sirius

A space‑themed Eleventy site with Sass styling, responsive layouts, and a live news feed page.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm start
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/` — site content, templates, Sass, and client JS
- `src/_includes/` — layout and navigation templates
- `src/sass/` — Sass source files
- `src/js/` — client-side scripts
- `netlify/functions/` — serverless functions (live news)
- `public/` — build output

## Notes

- The Space News page fetches RSS feeds via a Netlify function, with a browser fallback.
- Update page ordering in front matter using `navOrder`.
