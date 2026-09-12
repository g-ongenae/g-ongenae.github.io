# Guillaume Ongenae

Small static personal landing page built with semantic HTML, CSS, and browser JavaScript. It does not use React.

## Development

```sh
npm install
npm start
```

Vite prints both the local URL and the LAN URL. Use the LAN URL to open the page from another device on the same network.

## Production build

```sh
npm run build
npm run preview
```

The deployable static files are written to `build/`. They can also be served by any static web server, for example:

```sh
python3 -m http.server 8000 --directory build --bind 0.0.0.0
```
