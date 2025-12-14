SinzTools is a lightweight, tool-based website focused on SIMPLE, FAST, and FREE web utilities.

Core idea:

- Build a collection of small, single-purpose tools
- Each tool solves one common problem quickly
- Tools must be easy to use, mobile-friendly, and beginner-friendly
- The site is designed for traffic first, monetization later (Adsense)

Target users:

- Students
- Creators
- Small business users
- Everyday internet users

Tech philosophy:

- Frontend-only whenever possible
- Pure HTML, CSS, and Vanilla JavaScript
- No frameworks, no heavy libraries
- No backend, no auth, no databases (initial phase)
- All tools should work fully in the browser

Hosting & deployment:

- Static hosting (Vercel / Netlify / GitHub Pages)
- Fast load time and low maintenance

Tool design principles:

- One tool = one page
- Clean UI, minimal distractions
- Clear title, description, and usage
- Mobile-first design
- SEO-friendly structure

Initial tool roadmap:

1. Image Converter (PNG ↔ JPG ↔ WEBP)
2. Image Compressor
3. PDF tools (later)
4. Simple calculators (later)
5. Utility tools with high search demand

Monetization plan:

- Google Adsense
- Focus on traffic and usability first
- No forced login or paywalls

Long-term vision:

- Grow SinzTools into a trusted utility site
- Add more tools gradually
- Possibly introduce advanced tools later
- Keep the brand simple, fast, and reliable

Important constraints:

- Avoid overengineering
- Avoid backend unless absolutely needed
- Prioritize speed, clarity, and usability

SinzTools is a real project, not a demo.
Code quality and reliability matter.

SEO is a core priority for SinzTools.

URL & page structure:

- Clean, simple, keyword-based URLs
- Each tool lives under:
  /tools/<tool-name>/

Examples:

- /tools/image-converter/
- /tools/image-compressor/
- /tools/png-to-jpg/
- /tools/jpg-to-webp/

Each tool page must:

- Target ONE primary keyword
- Have a clear H1 with the main keyword
- Include a short intro paragraph (SEO + user clarity)
- Be fast-loading and mobile-friendly

Homepage (index.html):

- Acts as a tools directory
- Lists all available tools
- Internal links to each /tools/ page
- Simple descriptions for crawlability

On-page SEO requirements (per tool):

- <title> optimized for keyword + brand
  Example:
  "Image Converter – PNG to JPG & WEBP | SinzTools"
- <meta name="description"> written for CTR
- Semantic HTML:
  - h1 → tool name
  - h2 → usage / features
- Accessible form elements (labels, alt text)

Technical SEO principles:

- No JavaScript-heavy routing
- No SPA routing
- Direct HTML file per tool
- Works without JS for basic structure (content visible)

Content strategy:

- One page = one tool = one intent
- No clutter, no multiple tools on one page
- Simple explanatory text (2–3 short paragraphs)

Scaling strategy:

- Start with core tools
- Later add keyword-variant tools:
  - png-to-jpg
  - jpg-to-png
  - webp-to-jpg
- Reuse logic, change SEO copy

Important constraints:

- Avoid duplicate content
- Avoid over-optimization
- Avoid dynamic URLs or query-based tools

Goal:
Build a long-term SEO-friendly tools website
that Google can crawl, index, and rank easily.
