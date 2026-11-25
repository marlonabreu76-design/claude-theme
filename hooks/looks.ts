import type { ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { MARKS } from './marks'

// Colors taken from each company's live website on 2026-11-25:
// craquekits.com, pixeleffigy.com and sandpointadventist.org.

export type Company = 'craque' | 'pixel' | 'sandpoint'

export const COMPANIES: Record<Company, { name: string; alt: string }> = {
  craque: { name: 'Craque Kits', alt: 'Night-pitch glow in pink and lime with the Craque Q mark' },
  pixel: { name: 'PixelEffigy', alt: 'Blue-to-violet glow with the PixelEffigy P mark' },
  sandpoint: { name: 'Sandpoint Adventist', alt: 'Calm lake waves in navy and gold with the Adventist flame mark' },
}

const craque = makeColors({
  label: 'Marlon HQ - Craque Kits',
  roles: { accent: '#e0368f', danger: '#d23b3b', success: '#5fa818', warning: '#c98a14', pro: '#2fa89f' },
  light: { gray: { anchors: {
    'surface-0': '#e9eef2', 'surface-1': '#f4f7f9', 'surface-2': '#fafbfc',
    'text-primary': '#0b0d12', 'text-secondary': '#1a202c', 'text-muted': '#4a5363',
  } } },
  dark: { gray: { anchors: {
    'surface-0': '#07080b', 'surface-1': '#0d1016', 'surface-2': '#131720', 'surface-3': '#1a202c',
    'text-primary': '#f4f7f9', 'text-secondary': '#c9d2dc', 'text-muted': '#9aa5b3',
  } } },
})

const pixel = makeColors({
  label: 'Marlon HQ - PixelEffigy',
  roles: { accent: '#4804fc', danger: '#d0313d', success: '#2f9a55', warning: '#c48a10', pro: '#a600ff' },
  light: { gray: { anchors: {
    'surface-0': '#ecebf7', 'surface-1': '#f4f3fb', 'surface-2': '#fbfbfe',
    'text-primary': '#0f1430', 'text-secondary': '#1c244b', 'text-muted': '#4d5470',
  } } },
  dark: { gray: { anchors: {
    'surface-0': '#0e0b1f', 'surface-1': '#141029', 'surface-2': '#1a1533', 'surface-3': '#211b3d',
    'text-primary': '#f2f0fc', 'text-secondary': '#cdc8e6', 'text-muted': '#a39dc2',
  } } },
})

const sandpoint = makeColors({
  label: 'Marlon HQ - Sandpoint Adventist',
  roles: { accent: '#3c6fb0', danger: '#b8423a', success: '#3f8a5a', warning: '#c48a1c', pro: '#3c5386' },
  light: { gray: { anchors: {
    'surface-0': '#efe7d8', 'surface-1': '#f6efe3', 'surface-2': '#fbf7f0',
    'text-primary': '#131c2a', 'text-secondary': '#263854', 'text-muted': '#4f5d70',
  } } },
  dark: { gray: { anchors: {
    'surface-0': '#131c2a', 'surface-1': '#172234', 'surface-2': '#1c2a3f', 'surface-3': '#203047',
    'text-primary': '#f6efe3', 'text-secondary': '#d8cfbf', 'text-muted': '#aeb3ba',
  } } },
})

export const PROBLEMS: Record<Company, string[]> = {
  craque: craque.problems, pixel: pixel.problems, sandpoint: sandpoint.problems,
}

const square = { radius: 0 } as const

export const LOOKS: Record<Company, ThemeSetArgs> = {
  craque: {
    colors: craque.theme,
    backdrop: { scene: 'craque' },
    style: {
      Heading: { fontWeight: 'bold', letterSpacing: 0.5 },
      UserMessage: { ...square, backgroundColor: '#0b0d12', color: '#ffffff', borderColor: '#bcff4f', borderWidth: 2, paddingX: 14, paddingY: 10 },
      AssistantMessage: { ...square, backgroundColor: 'surface-1', paddingX: 14, paddingY: 10 },
      ToolUse: { ...square, backgroundColor: 'surface-1', paddingX: 8 },
    },
  },
  pixel: {
    colors: pixel.theme,
    backdrop: { scene: 'pixel' },
    style: {
      Heading: { fontWeight: 'bold' },
      UserMessage: {
        radius: 18, color: '#ffffff', backgroundColor: '#5b5cf7', paddingX: 16, paddingY: 10,
        fill: { gradient: { angle: 135, stops: ['#4f7ff7', '#6a3af7'] } },
      },
      AssistantMessage: { radius: 18, backgroundColor: 'surface-1', paddingX: 16, paddingY: 10 },
      ToolUse: { radius: 10, backgroundColor: 'surface-1', paddingX: 8 },
    },
  },
  sandpoint: {
    colors: sandpoint.theme,
    backdrop: { scene: 'sandpoint' },
    style: {
      Heading: { fontWeight: 'semibold' },
      UserMessage: { radius: 14, color: '#ffffff', backgroundColor: '#263854', borderColor: '#f7be45', borderWidth: 1, paddingX: 16, paddingY: 10 },
      AssistantMessage: { radius: 14, backgroundColor: 'surface-1', paddingX: 16, paddingY: 10 },
      ToolUse: { radius: 8, backgroundColor: 'surface-1', paddingX: 8 },
    },
  },
}

function mark(company: Company, light: string, dark: string): string {
  const m = MARKS[company]!
  return `<svg x="0" y="0" width="100%" height="100%" viewBox="0 0 ${m.viewBox.replace(' ', ' ')}" preserveAspectRatio="xMaxYMin meet" overflow="visible"><g transform="translate(-40 40)"><path class="mark" fill-rule="evenodd" d="${m.d}"/></g></svg>`
    .replace('class="mark"', `class="mark" fill="${light}"`)
    + `<style>@media (prefers-color-scheme: dark) { .mark { fill: ${dark}; } }</style>`
}

// Each scene: a soft two-tone glow that drifts slowly, and the company mark,
// faint, in the top right corner, away from the words and the message box.
function scene(c: Company, o: {
  lightBg: [string, string]; darkBg: [string, string]
  glowA: string; glowB: string; markLight: string; markDark: string; extra?: string
}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.bg0 { stop-color: ${o.lightBg[0]}; } .bg1 { stop-color: ${o.lightBg[1]}; }
@media (prefers-color-scheme: dark) { .bg0 { stop-color: ${o.darkBg[0]}; } .bg1 { stop-color: ${o.darkBg[1]}; } .glow { opacity: 0.30; } }
.glow { opacity: 0.22; }
.a { animation: driftA 48s ease-in-out infinite alternate; }
.b { animation: driftB 60s ease-in-out infinite alternate; }
@keyframes driftA { from { transform: translate(0px, 0px); } to { transform: translate(160px, 90px); } }
@keyframes driftB { from { transform: translate(0px, 0px); } to { transform: translate(-180px, -70px); } }
.mark { opacity: 0.07; }
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="bg0"/><stop offset="1" class="bg1"/></linearGradient>
<radialGradient id="ga"><stop offset="0" stop-color="${o.glowA}"/><stop offset="1" stop-color="${o.glowA}" stop-opacity="0"/></radialGradient>
<radialGradient id="gb"><stop offset="0" stop-color="${o.glowB}"/><stop offset="1" stop-color="${o.glowB}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<g class="glow"><circle class="a" cx="250" cy="820" r="520" fill="url(#ga)"/><circle class="b" cx="1350" cy="250" r="560" fill="url(#gb)"/></g>
${o.extra ?? ''}
<svg x="1150" y="0" width="450" height="380" viewBox="0 0 450 380" preserveAspectRatio="xMaxYMin meet">${mark(c, o.markLight, o.markDark)}</svg>
</svg>`
}

const waves = `<style>.w { fill: none; stroke: #8db8e8; stroke-width: 2; opacity: 0.18; animation: sway 40s ease-in-out infinite alternate; }
@keyframes sway { from { transform: translate(0px, 0px); } to { transform: translate(-120px, 8px); } }</style>
<path class="w" d="M-200 760 C 100 720, 300 800, 600 760 S 1100 720, 1400 760 S 1800 800, 1900 760"/>
<path class="w" d="M-200 820 C 100 780, 300 860, 600 820 S 1100 780, 1400 820 S 1800 860, 1900 820"/>
<path class="w" d="M-200 880 C 100 840, 300 920, 600 880 S 1100 840, 1400 880 S 1800 920, 1900 880"/>`

export const SCENES: Record<Company, string> = {
  craque: scene('craque', {
    lightBg: ['#f4f7f9', '#e6ecf1'], darkBg: ['#050b1f', '#07080b'],
    glowA: '#ff50b0', glowB: '#bcff4f', markLight: '#000000', markDark: '#ffffff',
  }),
  pixel: scene('pixel', {
    lightBg: ['#f6f5fd', '#e9e6fa'], darkBg: ['#120d2e', '#0b0819'],
    glowA: '#5a8cf7', glowB: '#a600ff', markLight: '#4804fc', markDark: '#8f6bff',
  }),
  sandpoint: scene('sandpoint', {
    lightBg: ['#f6efe3', '#ebe1cf'], darkBg: ['#1c2a3f', '#0f1724'],
    glowA: '#f7be45', glowB: '#8db8e8', markLight: '#263854', markDark: '#f6efe3', extra: waves,
  }),
}
