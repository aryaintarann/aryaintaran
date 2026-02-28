import { useState } from "react";
import type { ProjectData } from "./types";

interface ProjectsTabProps {
    title: string;
    projects: ProjectData[];
    emptyText: string;
}

const MODAL_TRANSITION_MS = 240;

const getSkillLogoText = (skill: string) => {
    const clean = skill.replace(/[^a-zA-Z0-9+.#]/g, " ").trim();
    if (!clean) return "SK";
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getTagIcon = (tag: string) => {
    const normalized = tag
        .toLowerCase()
        .trim()
        .replace(/[()]/g, "")
        .replace(/\./g, "")
        .replace(/\s+/g, " ");

    const iconByToken: Array<{ tokens: string[]; icon: string; invertOnDark?: boolean }> = [
        // ── Languages ──
        { tokens: ["html", "html5"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { tokens: ["css", "css3"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { tokens: ["javascript", "js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { tokens: ["typescript", "ts"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { tokens: ["python"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { tokens: ["java"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        { tokens: ["php"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
        { tokens: ["ruby"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
        { tokens: ["c#", "csharp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
        { tokens: ["c++", "cpp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
        { tokens: ["c lang", "c language"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
        { tokens: ["go", "golang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
        { tokens: ["rust"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg", invertOnDark: true },
        { tokens: ["kotlin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
        { tokens: ["swift"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
        { tokens: ["dart"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
        { tokens: ["scala"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" },
        { tokens: ["elixir"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg" },
        { tokens: ["haskell"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg" },
        { tokens: ["perl"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg" },
        { tokens: ["lua"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg" },
        { tokens: ["r lang", "r language", "rlang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
        { tokens: ["julia"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg" },
        { tokens: ["matlab"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
        { tokens: ["solidity"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg", invertOnDark: true },
        { tokens: ["objective-c", "objc"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg" },
        { tokens: ["bash", "shell"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg", invertOnDark: true },
        { tokens: ["powershell"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg" },
        { tokens: ["markdown", "md"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg", invertOnDark: true },

        // ── Frontend Frameworks & Libraries ──
        { tokens: ["react"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { tokens: ["next", "nextjs", "next js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-plain.svg", invertOnDark: true },
        { tokens: ["vue", "vuejs", "vue js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
        { tokens: ["nuxt", "nuxtjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
        { tokens: ["angular"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
        { tokens: ["svelte"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
        { tokens: ["gatsby"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-original.svg" },
        { tokens: ["ember"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ember/ember-original-wordmark.svg" },
        { tokens: ["jquery"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" },
        { tokens: ["redux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
        { tokens: ["threejs", "three js", "three"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", invertOnDark: true },
        { tokens: ["d3", "d3js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg" },
        { tokens: ["alpine", "alpinejs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/alpinejs/alpinejs-original.svg" },
        { tokens: ["solid", "solidjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidjs/solidjs-original.svg" },
        { tokens: ["htmx"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/htmx/htmx-original.svg" },
        { tokens: ["electron"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" },

        // ── CSS Frameworks & Preprocessors ──
        { tokens: ["tailwind", "tailwindcss"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
        { tokens: ["bootstrap"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
        { tokens: ["sass", "scss"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
        { tokens: ["less"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg", invertOnDark: true },
        { tokens: ["materialui", "material ui", "mui"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
        { tokens: ["bulma"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bulma/bulma-plain.svg" },
        { tokens: ["storybook"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg" },

        // ── Backend Frameworks ──
        { tokens: ["node", "nodejs", "node js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { tokens: ["express", "expressjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invertOnDark: true },
        { tokens: ["nestjs", "nest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
        { tokens: ["deno"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg", invertOnDark: true },
        { tokens: ["bun"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg" },
        { tokens: ["laravel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
        { tokens: ["codeigniter"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg" },
        { tokens: ["symfony"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg", invertOnDark: true },
        { tokens: ["django"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg", invertOnDark: true },
        { tokens: ["flask"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invertOnDark: true },
        { tokens: ["fastapi"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
        { tokens: ["spring"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { tokens: ["rails", "ruby on rails"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain.svg" },
        { tokens: ["phoenix"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/phoenix/phoenix-original.svg" },
        { tokens: ["dotnet", "net", "net core", "aspnet"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" },
        { tokens: ["gin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gin/gin-original.svg" },

        // ── Mobile Frameworks ──
        { tokens: ["flutter"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
        { tokens: ["react native"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { tokens: ["ionic"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" },
        { tokens: ["android"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
        { tokens: ["apple", "ios"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", invertOnDark: true },

        // ── Databases ──
        { tokens: ["mysql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { tokens: ["postgres", "postgresql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { tokens: ["sqlite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
        { tokens: ["mongodb", "mongo"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { tokens: ["redis"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { tokens: ["mariadb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg" },
        { tokens: ["oracle"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" },
        { tokens: ["cassandra"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg" },
        { tokens: ["dynamodb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dynamodb/dynamodb-original.svg" },
        { tokens: ["couchdb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchdb/couchdb-original.svg" },
        { tokens: ["neo4j"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg" },
        { tokens: ["prisma"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg", invertOnDark: true },
        { tokens: ["sequelize"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg" },
        { tokens: ["mongoose"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg" },

        // ── Cloud & Hosting ──
        { tokens: ["aws", "amazon"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { tokens: ["azure"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        { tokens: ["gcp", "google cloud"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
        { tokens: ["firebase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { tokens: ["supabase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
        { tokens: ["vercel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invertOnDark: true },
        { tokens: ["netlify"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg" },
        { tokens: ["heroku"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg" },
        { tokens: ["digitalocean"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg" },
        { tokens: ["cloudflare"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg" },

        // ── DevOps & Infrastructure ──
        { tokens: ["docker"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { tokens: ["kubernetes", "k8s"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
        { tokens: ["terraform"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
        { tokens: ["ansible"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg", invertOnDark: true },
        { tokens: ["jenkins"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
        { tokens: ["nginx"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
        { tokens: ["apache"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" },
        { tokens: ["kafka"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg", invertOnDark: true },
        { tokens: ["rabbitmq"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg" },
        { tokens: ["prometheus"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
        { tokens: ["grafana"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
        { tokens: ["circleci"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg", invertOnDark: true },

        // ── Version Control & Collaboration ──
        { tokens: ["git"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { tokens: ["github"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invertOnDark: true },
        { tokens: ["gitlab"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
        { tokens: ["bitbucket"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg" },
        { tokens: ["jira"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
        { tokens: ["confluence"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg" },
        { tokens: ["slack"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" },
        { tokens: ["trello"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg" },

        // ── Build Tools & Package Managers ──
        { tokens: ["npm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
        { tokens: ["yarn"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg" },
        { tokens: ["pnpm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pnpm/pnpm-original.svg" },
        { tokens: ["webpack"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
        { tokens: ["vite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
        { tokens: ["babel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg" },
        { tokens: ["gradle"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-original.svg" },
        { tokens: ["maven"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" },
        { tokens: ["composer"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg" },

        // ── APIs & Protocols ──
        { tokens: ["graphql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
        { tokens: ["socketio", "socket io", "websocket"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg", invertOnDark: true },
        { tokens: ["grpc"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grpc/grpc-original.svg" },

        // ── Testing ──
        { tokens: ["jest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
        { tokens: ["mocha"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mocha/mocha-plain.svg" },
        { tokens: ["pytest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytest/pytest-original.svg" },
        { tokens: ["selenium"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg" },
        { tokens: ["playwright"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg" },
        { tokens: ["cypress"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg" },
        { tokens: ["vitest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg" },

        // ── CMS & Platforms ──
        { tokens: ["wordpress"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
        { tokens: ["sanity"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sanity/sanity-original.svg" },

        // ── Design & Editors ──
        { tokens: ["figma"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
        { tokens: ["canva"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
        { tokens: ["photoshop"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
        { tokens: ["illustrator"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
        { tokens: ["xd", "adobe xd"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg" },
        { tokens: ["sketch"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" },
        { tokens: ["blender"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
        { tokens: ["vscode", "visual studio code", "vs code"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { tokens: ["intellij", "idea"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" },
        { tokens: ["vim", "neovim"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
        { tokens: ["postman"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },

        // ── OS & Environments ──
        { tokens: ["linux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { tokens: ["ubuntu"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg" },
        { tokens: ["debian"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg" },
        { tokens: ["centos"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/centos/centos-original.svg" },
        { tokens: ["windows"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg" },

        // ── Data Science & ML ──
        { tokens: ["tensorflow"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
        { tokens: ["pytorch"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { tokens: ["numpy"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
        { tokens: ["pandas"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", invertOnDark: true },
        { tokens: ["opencv"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
        { tokens: ["jupyter", "notebook"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
        { tokens: ["anaconda"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/anaconda/anaconda-original.svg" },

        // ── Game Engines ──
        { tokens: ["unity"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg", invertOnDark: true },
        { tokens: ["unreal", "ue4", "ue5"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg", invertOnDark: true },
        { tokens: ["godot"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg" },
    ];

    const matched = iconByToken.find(({ tokens }) =>
        tokens.some((token) => normalized === token || normalized.includes(token))
    );

    return matched ? { url: matched.icon, invertOnDark: matched.invertOnDark || false } : null;
};

const getDisplayTags = (project: ProjectData) =>
    (project.tags || []).filter((tag) => !/(featured|unggulan|personal)/i.test(tag));

const getPlainTextFromValue = (value: ProjectData["description"]): string => {
    if (!value) return "";
    if (typeof value === "string") return value.trim();

    if (!Array.isArray(value)) return "";

    return value
        .map((block) => {
            if (!block || typeof block !== "object" || !("children" in block)) return "";
            const children = (block as { children?: unknown }).children;
            if (!Array.isArray(children)) return "";

            return children
                .map((child) => {
                    if (!child || typeof child !== "object" || !("text" in child)) return "";
                    const text = (child as { text?: unknown }).text;
                    return typeof text === "string" ? text : "";
                })
                .join("");
        })
        .filter(Boolean)
        .join("\n")
        .trim();
};

const getProjectDescription = (project: ProjectData): string => {
    const richTextDescription = getPlainTextFromValue(project.description);
    if (richTextDescription) return richTextDescription;
    return project.shortDescription?.trim() || "";
};

const getImageUrl = (image: ProjectData["image"], width: number, height: number) => {
    void width;
    void height;
    if (!image) return "";
    if (typeof image === "string") return image;
    return "";
};

const getLogoUrl = (logo: ProjectData["logo"], width: number, height: number) => {
    void width;
    void height;
    if (!logo) return "";
    if (typeof logo === "string") return logo;
    return "";
};

const renderProjectCard = (project: ProjectData, onOpen: (item: ProjectData) => void) => (
    <article
        key={project._id}
        role="button"
        tabIndex={0}
        onClick={() => onOpen(project)}
        onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(project);
            }
        }}
        onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-primary/35 [--mouse-x:50%] [--mouse-y:50%]"
    >
        <div className="relative h-52 w-full bg-background">
            {project.image ? (
                <div
                    role="img"
                    aria-label={project.title || "Project preview"}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getImageUrl(project.image, 1200, 700)})` }}
                ></div>
            ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-secondary">No preview</div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/55 group-hover:opacity-100">
                <span className="translate-y-2 text-base font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View Project →
                </span>
            </div>

            {project.logo && (
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-background/90">
                    <div
                        role="img"
                        aria-label={`${project.title || "Project"} logo`}
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${getLogoUrl(project.logo, 64, 64)})` }}
                    ></div>
                </div>
            )}

            {(project.tags || []).some((tag) => /(featured|unggulan)/i.test(tag)) && (
                <span className="absolute right-3 top-3 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-background">
                    Featured
                </span>
            )}
        </div>

        <div className="relative flex grow flex-col border-t border-white/10 p-5">
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(520px circle at var(--mouse-x) var(--mouse-y), rgb(255 255 255 / 0.18), transparent 60%)",
                }}
            ></div>

            <div className="relative z-10">
                <h3 className="text-xl font-semibold text-text">{project.title}</h3>
                {project.shortDescription && (
                    <p className="mt-2 line-clamp-3 text-base leading-relaxed text-secondary">
                        {project.shortDescription}
                    </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {getDisplayTags(project).map((tag, index) => {
                        const icon = getTagIcon(tag);
                        return icon ? (
                            <div
                                key={`${project._id}-icon-${index}`}
                                role="img"
                                aria-label={tag}
                                className="h-7 w-7 bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${icon.url})`,
                                    ...(icon.invertOnDark ? { filter: "invert(1) brightness(2)" } : {}),
                                }}
                            ></div>
                        ) : index === 0 ? (
                            <div
                                key={`${project._id}-fallback-main-stack`}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-[10px] font-bold uppercase text-primary"
                                title={tag}
                            >
                                {getSkillLogoText(tag)}
                            </div>
                        ) : (
                            <span key={`${project._id}-tag-${index}`} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-secondary">
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    </article>
);

export default function ProjectsTab({ title, projects, emptyText }: ProjectsTabProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (project: ProjectData) => {
        setSelectedProject(project);
        requestAnimationFrame(() => {
            setIsModalOpen(true);
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.setTimeout(() => {
            setSelectedProject(null);
        }, MODAL_TRANSITION_MS);
    };

    const selectedProjectDescription = selectedProject ? getProjectDescription(selectedProject) : "";

    return (
        <>
            <div>
                <h2 className="text-3xl font-bold text-text">{title}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {projects.length > 0
                        ? projects.map((project) => renderProjectCard(project, openModal))
                        : <p className="text-secondary">{emptyText}</p>}
                </div>
            </div>

            {selectedProject && (
                <div
                    className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 transition-opacity duration-300 md:items-center md:p-6 no-scrollbar ${isModalOpen ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
                        }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedProject.title || "Project detail"}
                    onClick={closeModal}
                >
                    <div
                        className={`relative mt-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl transition-all duration-300 md:mt-0 ${isModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                            }`}
                        style={{ backgroundColor: "rgb(var(--color-background))" }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="bg-background md:mr-[38%]">
                            {selectedProject.image ? (
                                <img
                                    src={getImageUrl(selectedProject.image, 1600, 1000)}
                                    alt={selectedProject.title || "Project preview"}
                                    className="block max-h-[52vh] w-full object-contain object-top md:max-h-[92vh]"
                                />
                            ) : (
                                <div className="flex min-h-52 w-full items-center justify-center text-secondary md:min-h-[70vh]">No project preview</div>
                            )}
                        </div>

                        <div
                            className="relative max-h-[42vh] overflow-y-auto overflow-x-hidden bg-background p-5 md:absolute md:inset-y-0 md:right-0 md:w-[38%] md:max-h-none md:p-6 no-scrollbar"
                            style={{ backgroundColor: "rgb(var(--color-background))" }}
                        >
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <div className="pr-10">
                                <h3 className="text-2xl font-semibold text-text md:text-3xl">{selectedProject.title || "Project"}</h3>

                                {selectedProjectDescription && (
                                    <p className="mt-5 whitespace-pre-line text-base text-secondary">
                                        {selectedProjectDescription}
                                    </p>
                                )}

                                <div className="mt-6 space-y-5 text-base">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Type</p>
                                        <p className="mt-1 font-semibold text-text">{title}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Stack</p>
                                        <p className="mt-1 font-semibold text-text">{getDisplayTags(selectedProject).join(", ") || "Not specified"}</p>
                                    </div>
                                </div>


                                <div className="mt-8 flex flex-wrap gap-3">
                                    {selectedProject.githubLink && (
                                        <a
                                            href={selectedProject.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-background px-5 py-2.5 text-sm font-semibold text-text"
                                        >
                                            GitHub
                                            <span aria-hidden="true">→</span>
                                        </a>
                                    )}

                                    {selectedProject.link && (
                                        <a
                                            href={selectedProject.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background"
                                        >
                                            Visit Project
                                            <span aria-hidden="true">→</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
