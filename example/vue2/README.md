# Vite ⚡ - Vue 2 starter template

Create a Vue 2 application bundled by the lightning fast build tool <a href="https://github.com/vitejs/vite">Vite</a>

> [!WARNING]
> Vue 2 has reached EOL and is no longer actively maintained. [Upgrade to Vue 3](https://vuejs.org/) 
> or learn more about [Vue 2 EOL](https://v2.vuejs.org/eol/).

## Features

* ⚡️ [Vite](https://github.com/vitejs/vite), [Vue 2](https://github.com/vuejs/vue) - lightning fast
* 📦 [Components auto importing](https://github.com/antfu/unplugin-vue-components)
* 📥 [APIs auto importing](https://github.com/antfu/unplugin-auto-import) - use Composition API and others directly
* 🚦 [Vue-Router](https://github.com/vuejs/vue-router)
* 🎨 [TailwindCSS](https://tailwindcss.com/)
* 😃 [Use icons from any icon sets, with no compromise](https://github.com/antfu/unplugin-icons)
* 🧰 [VueUse](https://github.com/vueuse/vueuse) - Collection of essential Vue Composition Utilities
* 🦾 Typescript, of course

## Vite plugins

* [`@vitejs/plugin-vue2`](https://github.com/vitejs/vite-plugin-vue2) -
  Vue 2 support for Vite
* [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) -
  importing Vue components on-demand
* [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) -
  importing APIs like CompositionAPI on-demand
* [`unplugin-icons`](https://github.com/antfu/unplugin-icons) -
  importing icons as Vue components on-demand


## Try it now!

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/lstoeferle/vite-vue2-starter/generate)

### Clone

If you prefer to do it manually with a cleaner git history

```bash
npx degit lstoeferle/vite-vue2-starter my-vite-vue2-app
cd my-vite-vue2-app
pnpm install
```

## Usage

### Development

Just run and visit [http://localhost:3333](http://localhost:3333)

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

And you will see the generated files in `dist`, which are ready to be served.

## Why

Vue 3 is awesome, but we should not forget about supporting Vue 2 ♥️

### Credits

This project is inspired by [Vitesse](https://github.com/antfu/vitesse), an opinionated Vite starter template for Vue 3.

Big thanks to [Anthony Fu](https://github.com/antfu) for the inspiration and all the amazing tools you create.
