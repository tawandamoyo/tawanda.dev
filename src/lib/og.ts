import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/**
 * Build-time Open Graph cards. One template, filled from frontmatter the post
 * already has: the title is the hero, the kicker carries kind + date. No photos,
 * no per-post art — every share reads as the same publication.
 *
 * Palette and type mirror "The Clearing" tokens in styles/global.css.
 */

const GROUND = '#F7F8F3';
const INK = '#20241E';
const MUTED = '#6E7268';
const ACCENT = '#2F6B45';
const RED = '#D95F5C';

// Read from the source tree at build time — cwd is the project root during `astro build`.
const fontFile = (name: string) => readFileSync(resolve('src/assets/fonts', name));

const FONTS = [
  { name: 'Source Serif 4', data: fontFile('source-serif-4-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Source Serif 4', data: fontFile('source-serif-4-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'JetBrains Mono', data: fontFile('jetbrains-mono-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
];

// The site mark — braces + red pulse, lifted from favicon.svg and cropped to the glyph.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 165 392 182">
<path fill="${INK}" d="M107.33 336.63 Q97.77 336.63 93.35 331.85 Q88.97 327.10 88.97 319.90 L88.97 310.00 Q88.97 305.33 89.87 301.73 Q90.77 298.13 92.28 295.35 Q93.83 292.53 95.63 290.40 Q97.43 288.23 99.03 286.23 Q102.10 282.63 103.25 280.05 Q104.43 277.43 104.43 274.53 Q104.43 262.83 81.93 262.83 L67.00 262.83 L67.00 248.80 L81.93 248.80 Q104.43 248.80 104.43 237.10 Q104.43 234.23 103.25 231.62 Q102.10 229.00 99.03 225.40 Q97.43 223.43 95.63 221.18 Q93.83 218.93 92.37 216.23 Q90.93 213.53 89.95 209.93 Q88.97 206.33 88.97 201.63 L88.97 191.73 Q88.97 184.53 93.35 179.78 Q97.77 175.00 107.33 175.00 L139.00 175.00 L139.00 189.03 L105.17 189.03 L105.17 200.57 Q105.17 204.17 105.70 206.78 Q106.23 209.37 107.22 211.53 Q108.23 213.70 109.58 215.50 Q110.93 217.30 112.37 219.10 Q115.43 222.87 118.13 227.20 Q120.83 231.53 120.83 237.27 Q120.83 244.83 115.52 249.45 Q110.20 254.03 100.47 255.27 L100.47 256.37 Q110.20 257.63 115.52 262.22 Q120.83 266.80 120.83 274.37 Q120.83 280.13 118.13 284.46 Q115.43 288.77 112.37 292.53 Q110.93 294.33 109.58 296.13 Q108.23 297.93 107.22 300.10 Q106.23 302.27 105.70 304.88 Q105.17 307.47 105.17 311.07 L105.17 322.60 L139.00 322.60 L139.00 336.63 L107.33 336.63 Z"/>
<path fill="none" stroke="${RED}" stroke-width="15.30" stroke-linejoin="miter" stroke-miterlimit="6" d="M173.20 256.00 L199.70 256.00 L233.48 194.80 L265.01 274.00 L283.03 256.00 L338.80 256.00"/>
<path fill="${INK}" d="M404.67 175.00 Q414.23 175.00 418.62 179.78 Q423.03 184.53 423.03 191.73 L423.03 201.63 Q423.03 206.33 422.05 209.93 Q421.07 213.53 419.60 216.23 Q418.17 218.93 416.37 221.18 Q414.57 223.43 412.97 225.40 Q409.90 229.00 408.72 231.62 Q407.57 234.23 407.57 237.10 Q407.57 248.80 430.07 248.80 L445.00 248.80 L445.00 262.83 L430.07 262.83 Q407.57 262.83 407.57 274.53 Q407.57 277.43 408.72 280.05 Q409.90 282.63 412.97 286.23 Q414.57 288.40 416.37 290.57 Q418.17 292.73 419.69 295.52 Q421.23 298.30 422.13 301.82 Q423.03 305.33 423.03 310.00 L423.03 319.90 Q423.03 327.10 418.62 331.85 Q414.23 336.63 404.67 336.63 L373.00 336.63 L373.00 322.60 L406.83 322.60 L406.83 311.07 Q406.83 303.87 404.67 300.02 Q402.53 296.13 399.63 292.53 Q396.57 288.77 393.87 284.46 Q391.17 280.13 391.17 274.37 Q391.17 266.80 396.48 262.22 Q401.80 257.63 411.53 256.37 L411.53 255.27 Q401.80 254.03 396.48 249.45 Q391.17 244.83 391.17 237.27 Q391.17 231.53 393.87 227.20 Q396.57 222.87 399.63 219.10 Q402.53 215.50 404.67 211.65 Q406.83 207.77 406.83 200.57 L406.83 189.03 L373.00 189.03 L373.00 175.00 L404.67 175.00 Z"/>
</svg>`;
const MARK_URI = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown>, ...kids: unknown[]): El => ({
  type,
  props: { ...props, children: kids.length === 0 ? undefined : kids.length === 1 ? kids[0] : kids },
});

/** Longer titles step down so a headline never runs past three lines. */
function titleSize(title: string): number {
  const n = title.length;
  if (n <= 22) return 94;
  if (n <= 38) return 80;
  if (n <= 58) return 66;
  return 54;
}

export interface OgCard {
  title: string;
  /** Small line above the title, e.g. "Essay · 7 Sep 2026". Rendered uppercase. */
  kicker: string;
}

export async function ogImage({ title, kicker }: OgCard): Promise<Uint8Array> {
  const tree = h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '68px 76px',
        background: GROUND,
        fontFamily: 'Source Serif 4',
      },
    },
    h('img', { src: MARK_URI, width: 138, height: 64 }),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            fontFamily: 'JetBrains Mono',
            fontWeight: 500,
            fontSize: '25px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: '22px',
          },
        },
        kicker,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontWeight: 600,
            fontSize: `${titleSize(title)}px`,
            lineHeight: 1.12,
            letterSpacing: '-0.012em',
            color: INK,
          },
        },
        title,
      ),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontFamily: 'JetBrains Mono',
          fontWeight: 500,
          fontSize: '22px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      },
      h('span', { style: { color: MUTED } }, 'tawanda.dev'),
      h('span', { style: { color: RED } }, 'moyo means heart'),
    ),
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });

  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
