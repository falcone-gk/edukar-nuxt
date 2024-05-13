import type { RouteParams } from "vue-router";

export { generateDynamicPath, slugToTitle }

function generateDynamicPath(pathTemplate: string, params: RouteParams): string {
  let path = pathTemplate;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      path = path.replace(`:${key}()`, value as string);
    }
  }
  return path;
}

function slugToTitle(slug: string): string {
  const words = slug.split('-');
  const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return titleCaseWords.join(' ');
}
