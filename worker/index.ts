import { handleLanguageRequest } from '../src/lib/language-routing.ts';

export default {
  async fetch(request, env) {
    const response = handleLanguageRequest(request);
    return response ?? env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
