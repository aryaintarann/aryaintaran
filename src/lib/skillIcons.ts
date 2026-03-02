const BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// Map: lowercase key → devicons URL
const ICON_MAP: Record<string, string> = {
  // Web Frameworks & Libraries
  "react": `${BASE}/react/react-original.svg`,
  "next.js": `${BASE}/nextjs/nextjs-original.svg`,
  "nextjs": `${BASE}/nextjs/nextjs-original.svg`,
  "next js": `${BASE}/nextjs/nextjs-original.svg`,
  "vue": `${BASE}/vuejs/vuejs-original.svg`,
  "vue.js": `${BASE}/vuejs/vuejs-original.svg`,
  "vuejs": `${BASE}/vuejs/vuejs-original.svg`,
  "nuxt": `${BASE}/nuxtjs/nuxtjs-original.svg`,
  "nuxt.js": `${BASE}/nuxtjs/nuxtjs-original.svg`,
  "angular": `${BASE}/angularjs/angularjs-original.svg`,
  "svelte": `${BASE}/svelte/svelte-original.svg`,
  "remix": `${BASE}/remix/remix-original.svg`,
  "astro": `${BASE}/astro/astro-original.svg`,
  "gatsby": `${BASE}/gatsby/gatsby-original.svg`,

  // Languages
  "javascript": `${BASE}/javascript/javascript-original.svg`,
  "js": `${BASE}/javascript/javascript-original.svg`,
  "typescript": `${BASE}/typescript/typescript-original.svg`,
  "ts": `${BASE}/typescript/typescript-original.svg`,
  "python": `${BASE}/python/python-original.svg`,
  "php": `${BASE}/php/php-original.svg`,
  "java": `${BASE}/java/java-original.svg`,
  "c#": `${BASE}/csharp/csharp-original.svg`,
  "csharp": `${BASE}/csharp/csharp-original.svg`,
  "c++": `${BASE}/cplusplus/cplusplus-original.svg`,
  "cplusplus": `${BASE}/cplusplus/cplusplus-original.svg`,
  "go": `${BASE}/go/go-original.svg`,
  "golang": `${BASE}/go/go-original.svg`,
  "rust": `${BASE}/rust/rust-original.svg`,
  "ruby": `${BASE}/ruby/ruby-original.svg`,
  "kotlin": `${BASE}/kotlin/kotlin-original.svg`,
  "swift": `${BASE}/swift/swift-original.svg`,
  "dart": `${BASE}/dart/dart-original.svg`,
  "lua": `${BASE}/lua/lua-original.svg`,

  // Backend / Runtime
  "node.js": `${BASE}/nodejs/nodejs-original.svg`,
  "nodejs": `${BASE}/nodejs/nodejs-original.svg`,
  "node js": `${BASE}/nodejs/nodejs-original.svg`,
  "express": `${BASE}/express/express-original.svg`,
  "express.js": `${BASE}/express/express-original.svg`,
  "nestjs": `${BASE}/nestjs/nestjs-original.svg`,
  "nest.js": `${BASE}/nestjs/nestjs-original.svg`,
  "fastapi": `${BASE}/fastapi/fastapi-original.svg`,
  "django": `${BASE}/django/django-plain.svg`,
  "flask": `${BASE}/flask/flask-original.svg`,
  "laravel": `${BASE}/laravel/laravel-original.svg`,
  "rails": `${BASE}/rails/rails-original-wordmark.svg`,
  "ruby on rails": `${BASE}/rails/rails-original-wordmark.svg`,
  "spring": `${BASE}/spring/spring-original.svg`,
  "spring boot": `${BASE}/spring/spring-original.svg`,

  // Database
  "postgresql": `${BASE}/postgresql/postgresql-original.svg`,
  "postgres": `${BASE}/postgresql/postgresql-original.svg`,
  "mysql": `${BASE}/mysql/mysql-original.svg`,
  "mongodb": `${BASE}/mongodb/mongodb-original.svg`,
  "mongo": `${BASE}/mongodb/mongodb-original.svg`,
  "redis": `${BASE}/redis/redis-original.svg`,
  "sqlite": `${BASE}/sqlite/sqlite-original.svg`,
  "mariadb": `${BASE}/mariadb/mariadb-original.svg`,
  "oracle": `${BASE}/oracle/oracle-original.svg`,
  "supabase": `${BASE}/supabase/supabase-original.svg`,
  "firebase": `${BASE}/firebase/firebase-original.svg`,
  "prisma": `${BASE}/prisma/prisma-original.svg`,

  // CSS / Styling
  "css": `${BASE}/css3/css3-original.svg`,
  "css3": `${BASE}/css3/css3-original.svg`,
  "tailwind": `${BASE}/tailwindcss/tailwindcss-original.svg`,
  "tailwind css": `${BASE}/tailwindcss/tailwindcss-original.svg`,
  "tailwindcss": `${BASE}/tailwindcss/tailwindcss-original.svg`,
  "sass": `${BASE}/sass/sass-original.svg`,
  "scss": `${BASE}/sass/sass-original.svg`,
  "bootstrap": `${BASE}/bootstrap/bootstrap-original.svg`,
  "html": `${BASE}/html5/html5-original.svg`,
  "html5": `${BASE}/html5/html5-original.svg`,

  // DevOps / Cloud / Tools
  "docker": `${BASE}/docker/docker-original.svg`,
  "kubernetes": `${BASE}/kubernetes/kubernetes-original.svg`,
  "k8s": `${BASE}/kubernetes/kubernetes-original.svg`,
  "aws": `${BASE}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  "amazon web services": `${BASE}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  "gcp": `${BASE}/googlecloud/googlecloud-original.svg`,
  "google cloud": `${BASE}/googlecloud/googlecloud-original.svg`,
  "azure": `${BASE}/azure/azure-original.svg`,
  "nginx": `${BASE}/nginx/nginx-original.svg`,
  "linux": `${BASE}/linux/linux-original.svg`,
  "ubuntu": `${BASE}/ubuntu/ubuntu-original.svg`,
  "bash": `${BASE}/bash/bash-original.svg`,
  "vercel": `${BASE}/vercel/vercel-original.svg`,

  // Version Control / CI
  "git": `${BASE}/git/git-original.svg`,
  "github": `${BASE}/github/github-original.svg`,
  "gitlab": `${BASE}/gitlab/gitlab-original.svg`,
  "bitbucket": `${BASE}/bitbucket/bitbucket-original.svg`,

  // Design & Other
  "figma": `${BASE}/figma/figma-original.svg`,
  "photoshop": `${BASE}/photoshop/photoshop-original.svg`,
  "illustrator": `${BASE}/illustrator/illustrator-original.svg`,
  "xd": `${BASE}/xd/xd-original.svg`,
  "blender": `${BASE}/blender/blender-original.svg`,
  "vscode": `${BASE}/vscode/vscode-original.svg`,
  "vs code": `${BASE}/vscode/vscode-original.svg`,
  "graphql": `${BASE}/graphql/graphql-plain.svg`,
  "webpack": `${BASE}/webpack/webpack-original.svg`,
  "vite": `${BASE}/vite/vite-original.svg`,
  "flutter": `${BASE}/flutter/flutter-original.svg`,
  "android": `${BASE}/android/android-original.svg`,
  "arduino": `${BASE}/arduino/arduino-original.svg`,
  "jupyter": `${BASE}/jupyter/jupyter-original.svg`,
  "terraform": `${BASE}/terraform/terraform-original.svg`,
  "ansible": `${BASE}/ansible/ansible-original.svg`,
};

/**
 * Returns the devicons URL for a given skill name, or empty string if not found.
 */
export function getSkillIcon(name: string): string {
  return ICON_MAP[name.toLowerCase().trim()] ?? "";
}

/**
 * Returns true if an icon is available for the given skill name.
 */
export function hasSkillIcon(name: string): boolean {
  return !!ICON_MAP[name.toLowerCase().trim()];
}

export { ICON_MAP };
