# exam-simulator

React/Vite exam simulator.

## Mathematical notation

Math and Physics questions are rendered through MathJax. The source JSON files remain unchanged: a display-only formatter recognises common notation lost during PDF text extraction (limits, roots, powers, fractions, trigonometric functions, subscripts and common symbols) and sends it to MathJax.

If MathJax cannot be loaded from its CDN, the application falls back to the original question text instead of blocking the simulator.

## Deploy

```sh
npm run build
sh deploy.sh
```

`deploy.sh` rebuilds `dist` from scratch and publishes it to the `gh-pages` branch.
