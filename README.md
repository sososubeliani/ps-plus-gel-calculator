# PS Plus GEL Calculator

A tiny, dependency-free price calculator that converts **Turkish Lira (TRY)**
and **Ukrainian Hryvnia (UAH)** prices into **Georgian Lari (GEL)** using a
configurable exchange rate plus tiered profit ranges.

Originally extracted from the
[ps-plus-georgia](https://github.com/) admin CMS so you can use the same
pricing logic standalone — no backend, no database, no build step.

## Live demo

Deploy to GitHub Pages (see below) and the site lives at
`https://<your-user>.github.io/ps-plus-gel-calculator/`.

## How it works

For each currency you input a price. The calculator:

1. Looks up the **profit range** the price falls into (e.g. Lira 301–500 → +40%).
2. Applies the markup: `price + price × profit%`.
3. Converts to GEL using the exchange rate.
4. Rounds up with `Math.ceil`.

Formula:

```
finalGEL = ceil( (price + price × profit%) × rate )
```

If the price doesn't fall into any range, the base conversion is returned
(no markup), matching the production fallback.

## Editing rates and ranges

All defaults live in [`js/config.js`](js/config.js). To change them
permanently, edit that file and commit.

Need to experiment first? Open `settings.html`. Tweaks there are held in
`sessionStorage` (cleared when you close the tab) so they don't leak across
visitors. When you're happy, click **Copy config as code** and paste the
snippet into `js/config.js`.

## Running locally

ES modules require a static server (won't work via `file://`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or any equivalent: `npx serve`, `php -S localhost:8000`, etc.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: standalone GEL calculator"
gh repo create ps-plus-gel-calculator --public --source=. --push \
  --description "Standalone GEL price calculator for TRY/UAH with configurable profit ranges"
```

Then in the repo settings → **Pages** → set source to *Deploy from branch*,
branch `main`, folder `/ (root)`. The site goes live within a minute or two.

To ship a config change later: edit `js/config.js`, commit, push — Pages
auto-redeploys.

## Project layout

```
├── index.html          Calculator (two side-by-side panels)
├── settings.html       Editable rates + ranges
├── css/styles.css      Styling
├── js/
│   ├── config.js       DEFAULT_CONFIG — exchange rates & profit ranges
│   ├── calc.js         calcWithRanges() — pure pricing logic
│   ├── state.js        sessionStorage helpers
│   ├── calculator.js   Wires index.html
│   └── settings.js     Wires settings.html
└── README.md
```

## License

MIT — see [LICENSE](LICENSE).
