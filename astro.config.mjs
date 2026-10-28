import { defineConfig } from 'astro/config';
import developmentLanguageRouting from './scripts/dev-language.ts';

export default defineConfig({
  site: 'https://doubletree.world',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [developmentLanguageRouting()],
});
