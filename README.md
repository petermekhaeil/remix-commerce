# remix-commerce

Performant e-commerce that runs on the edge. Built using [Remix](https://remix.run) running on [Cloudflare Workers](https://workers.cloudflare.com/). It supports different commerce providers to showcase the benefits of a headless commerce architecture.

Demo: [https://remix-commerce.petermekhaeil.workers.dev/](https://remix-commerce.petermekhaeil.workers.dev)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/petermekhaeil/remix-commerce])

## Technologies

- Framework: [Remix](https://remix.run)
- Network: [Cloudflare](https://www.cloudflare.com/en-gb/network/)
- Commerce backend: [Commerce.js](https://commercejs.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Testing: [Playwright](https://playwright.dev/)

## Features

- Performant
- Responsive
- Tested

## Integrations

Supported commerce providers:

- [Commerce.js](https://commercejs.com/)

## UI Components

The UI is a combination of custom components mixed with [HyperUI](https://www.hyperui.dev/) and [Tailwind UI](https://tailwindui.com/).

## Development

Copy `.env.template` to `.env` and configure the backend provider:

```
PROVIDER=commercejs
COMMERCEJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Run `npm run dev`.

## Work in progress

This project is WIP. Items still in development:

- Ability to integrate with other headless commerce platforms.
- SEO Ready
- Accessibility
- Theming
- Dark Mode
- 3rd party library support (eg Google Analytics)
