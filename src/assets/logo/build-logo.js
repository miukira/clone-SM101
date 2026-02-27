const fs = require('fs');
const path = require('path');

// Read the horse SVG
const horseSvg = fs.readFileSync(path.join(__dirname, 'horse.svg'), 'utf8');

// Extract path data
const startIdx = horseSvg.indexOf('d="', horseSvg.indexOf('<path id="_x23_fe0000ff"'));
const dStart = startIdx + 3;
const dEnd = horseSvg.indexOf('"/>', dStart);
let pathD = horseSvg.substring(dStart, dEnd);

if (!pathD || pathD.length < 100) {
  const lines = horseSvg.split('\n');
  let collecting = false;
  let pathLines = [];
  for (const line of lines) {
    if (line.includes('<path id="_x23_fe0000ff"')) {
      collecting = true;
      const dIdx = line.indexOf('d="');
      if (dIdx >= 0) pathLines.push(line.substring(dIdx + 3));
      continue;
    }
    if (collecting) {
      if (line.includes('"/>')) {
        pathLines.push(line.replace('"/>', '').replace('/>', ''));
        collecting = false;
      } else {
        pathLines.push(line);
      }
    }
  }
  pathD = pathLines.join('\n').trim();
  if (pathD.endsWith('"')) pathD = pathD.slice(0, -1);
}

console.log('Path data length:', pathD.length);

// ========== SHARED DEFS ==========
const sharedDefs = `
    <!-- Silver gradient for text -->
    <linearGradient id="chromeTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="12%" stop-color="#F0F0F0"/>
      <stop offset="25%" stop-color="#E0E0E0"/>
      <stop offset="38%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#A8A8A8"/>
      <stop offset="55%" stop-color="#C0C0C0"/>
      <stop offset="68%" stop-color="#B0B0B0"/>
      <stop offset="80%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <linearGradient id="chrome88Grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="15%" stop-color="#E8E8E8"/>
      <stop offset="35%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#B0B0B0"/>
      <stop offset="65%" stop-color="#C8C8C8"/>
      <stop offset="80%" stop-color="#A0A0A0"/>
      <stop offset="100%" stop-color="#808080"/>
    </linearGradient>
    <linearGradient id="chromeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#303030"/>
      <stop offset="15%" stop-color="#808080"/>
      <stop offset="30%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="85%" stop-color="#808080"/>
      <stop offset="100%" stop-color="#303030"/>
    </linearGradient>
    <linearGradient id="chromeDivider" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#202020"/>
      <stop offset="30%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#B0B0B0"/>
      <stop offset="70%" stop-color="#808080"/>
      <stop offset="100%" stop-color="#202020"/>
    </linearGradient>
    <linearGradient id="silverHorseFill" gradientUnits="userSpaceOnUse" x1="635" y1="200" x2="1925" y2="1400">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="12%" stop-color="#D0D0D0"/>
      <stop offset="25%" stop-color="#F0F0F0"/>
      <stop offset="35%" stop-color="#FFFFFF"/>
      <stop offset="45%" stop-color="#E0E0E0"/>
      <stop offset="55%" stop-color="#C0C0C0"/>
      <stop offset="65%" stop-color="#A8A8A8"/>
      <stop offset="72%" stop-color="#D0D0D0"/>
      <stop offset="80%" stop-color="#B8B8B8"/>
      <stop offset="88%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <radialGradient id="silverHorseStroke" cx="1280" cy="800" r="700" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="20%" stop-color="#E0E0E0"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="60%" stop-color="#909090"/>
      <stop offset="80%" stop-color="#606060"/>
      <stop offset="100%" stop-color="#404040"/>
    </radialGradient>
    <filter id="textShadow" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="horseShadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
    </filter>`;

const horsePath = `<path fill="url(#silverHorseFill)" stroke="url(#silverHorseStroke)" stroke-width="3" d="${pathD}"/>`;
const horseViewBox = `viewBox="479.9 -0.05 1600.1 1600.1"`;

const cornerAccents = `
  <path d="M 25 15 L 15 15 L 15 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 975 15 L 985 15 L 985 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 25 285 L 15 285 L 15 275" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 975 285 L 985 285 L 985 275" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>`;

// ============================================================
// OPTION 1: Horizontal - Kuda kiri, teks kanan (tanpa tagline)
// ============================================================
const option1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">
  <defs>${sharedDefs}</defs>
  <rect width="1000" height="300" fill="#000000" rx="15" ry="15"/>
  <rect x="1" y="1" width="998" height="298" rx="14" ry="14" fill="none" stroke="#303030" stroke-width="1"/>
  
  <!-- Horse Left -->
  <svg x="10" y="5" width="270" height="290" ${horseViewBox} overflow="hidden">
    ${horsePath}
  </svg>
  
  <!-- Divider -->
  <line x1="300" y1="50" x2="300" y2="250" stroke="url(#chromeDivider)" stroke-width="1.5" opacity="0.6"/>
  
  <!-- Text mimi88 - centered vertically -->
  <g filter="url(#textShadow)">
    <text x="650" y="175" font-family="'Georgia','Times New Roman',serif" font-size="110" font-weight="bold" font-style="italic" fill="url(#chromeTextGrad)" letter-spacing="3" text-anchor="middle">
      mimi<tspan font-family="'Arial Black','Impact',sans-serif" font-style="normal" font-size="118" letter-spacing="-2" fill="url(#chrome88Grad)">88</tspan>
    </text>
  </g>
  
  <!-- Chrome Underline -->
  <line x1="370" y1="200" x2="930" y2="200" stroke="url(#chromeLineGrad)" stroke-width="2.5" stroke-linecap="round"/>
  
  <!-- Top accent -->
  <line x1="420" y1="90" x2="880" y2="90" stroke="url(#chromeLineGrad)" stroke-width="0.8" opacity="0.3"/>
  
  ${cornerAccents}
</svg>`;

// ============================================================
// OPTION 2: Stacked - Kuda di atas, teks di bawah (vertikal)
// ============================================================
const option2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600">
  <defs>${sharedDefs}</defs>
  <rect width="500" height="600" fill="#000000" rx="15" ry="15"/>
  <rect x="1" y="1" width="498" height="598" rx="14" ry="14" fill="none" stroke="#303030" stroke-width="1"/>
  
  <!-- Horse centered top -->
  <svg x="100" y="20" width="300" height="320" ${horseViewBox} overflow="hidden">
    ${horsePath}
  </svg>
  
  <!-- Horizontal divider -->
  <line x1="80" y1="360" x2="420" y2="360" stroke="url(#chromeLineGrad)" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Text mimi88 centered -->
  <g filter="url(#textShadow)">
    <text x="250" y="460" font-family="'Georgia','Times New Roman',serif" font-size="90" font-weight="bold" font-style="italic" fill="url(#chromeTextGrad)" letter-spacing="3" text-anchor="middle">
      mimi<tspan font-family="'Arial Black','Impact',sans-serif" font-style="normal" font-size="96" letter-spacing="-2" fill="url(#chrome88Grad)">88</tspan>
    </text>
  </g>
  
  <!-- Underline -->
  <line x1="80" y1="485" x2="420" y2="485" stroke="url(#chromeLineGrad)" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Corner accents -->
  <path d="M 25 15 L 15 15 L 15 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 475 15 L 485 15 L 485 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 25 585 L 15 585 L 15 575" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 475 585 L 485 585 L 485 575" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

// ============================================================
// OPTION 3: Compact Square - untuk icon/favicon/avatar
// ============================================================
const option3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>${sharedDefs}</defs>
  <rect width="400" height="400" fill="#000000" rx="20" ry="20"/>
  <rect x="1.5" y="1.5" width="397" height="397" rx="19" ry="19" fill="none" stroke="#303030" stroke-width="1"/>
  
  <!-- Horse centered, slightly top -->
  <svg x="60" y="10" width="280" height="260" ${horseViewBox} overflow="hidden">
    ${horsePath}
  </svg>
  
  <!-- Text mimi88 below horse -->
  <g filter="url(#textShadow)">
    <text x="200" y="340" font-family="'Georgia','Times New Roman',serif" font-size="72" font-weight="bold" font-style="italic" fill="url(#chromeTextGrad)" letter-spacing="2" text-anchor="middle">
      mimi<tspan font-family="'Arial Black','Impact',sans-serif" font-style="normal" font-size="78" letter-spacing="-2" fill="url(#chrome88Grad)">88</tspan>
    </text>
  </g>
  
  <!-- Chrome line above text -->
  <line x1="60" y1="278" x2="340" y2="278" stroke="url(#chromeLineGrad)" stroke-width="1.5" stroke-linecap="round"/>
  
  <!-- Chrome line below text -->
  <line x1="100" y1="360" x2="300" y2="360" stroke="url(#chromeLineGrad)" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
  
  <!-- Corner accents -->
  <path d="M 25 15 L 15 15 L 15 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 375 15 L 385 15 L 385 25" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 25 385 L 15 385 L 15 375" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 375 385 L 385 385 L 385 375" fill="none" stroke="#505050" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

// ============================================================
// OPTION 4: Kuda di kanan teks, layout terbalik
// ============================================================
const option4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">
  <defs>${sharedDefs}</defs>
  <rect width="1000" height="300" fill="#000000" rx="15" ry="15"/>
  <rect x="1" y="1" width="998" height="298" rx="14" ry="14" fill="none" stroke="#303030" stroke-width="1"/>
  
  <!-- Top accent -->
  <line x1="120" y1="90" x2="580" y2="90" stroke="url(#chromeLineGrad)" stroke-width="0.8" opacity="0.3"/>
  
  <!-- Text mimi88 on the left -->
  <g filter="url(#textShadow)">
    <text x="350" y="175" font-family="'Georgia','Times New Roman',serif" font-size="110" font-weight="bold" font-style="italic" fill="url(#chromeTextGrad)" letter-spacing="3" text-anchor="middle">
      mimi<tspan font-family="'Arial Black','Impact',sans-serif" font-style="normal" font-size="118" letter-spacing="-2" fill="url(#chrome88Grad)">88</tspan>
    </text>
  </g>
  
  <!-- Chrome Underline -->
  <line x1="70" y1="200" x2="630" y2="200" stroke="url(#chromeLineGrad)" stroke-width="2.5" stroke-linecap="round"/>
  
  <!-- Divider -->
  <line x1="700" y1="50" x2="700" y2="250" stroke="url(#chromeDivider)" stroke-width="1.5" opacity="0.6"/>
  
  <!-- Horse Right (flipped) -->
  <svg x="720" y="5" width="270" height="290" ${horseViewBox} overflow="hidden">
    <g transform="translate(2080, 0) scale(-1, 1)">
      ${horsePath}
    </g>
  </svg>
  
  ${cornerAccents}
</svg>`;

// ============================================================
// Write all files
// ============================================================
const files = {
  'mimi88-option1-horizontal.svg': option1,
  'mimi88-option2-stacked.svg': option2,
  'mimi88-option3-square.svg': option3,
  'mimi88-option4-reversed.svg': option4,
};

Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  const size = fs.statSync(filePath).size;
  console.log(`✓ ${filename} (${size} bytes)`);
});

console.log('\nDone! 4 logo options generated.');
