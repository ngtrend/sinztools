import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://www.sinztools.app',
	trailingSlash: 'always',
	integrations: [sitemap()],
	output: 'static',
});
