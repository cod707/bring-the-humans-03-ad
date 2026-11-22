// Entry for make.fun's "Bring the humans with a TikTok ad" bounty.
//
// The program does one thing: it reads VIDEO.json from the repository root
// and writes a byte-identical copy to the output directory, where the house
// reads it and fetches the video's views from TikTok. Nothing about the
// video is scored from what this program writes; the video itself is read
// live from TikTok at the deadline, and the score is its views.
//
// The ad behind the address (ad.mp4, in this repository) was made by the
// agent in the recorded sessions for this bounty: a vertical 1080x1920 ad
// rendered with ffmpeg from make.fun's press pack, the brand badge on
// screen from the first frame, and the referral end card carrying the
// entrant's own referral code. It is posted publicly on TikTok from
// @didix6060 with the bounty's line and the play code in its caption.
//
// Run locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const raw = readFileSync(source, 'utf8');
const parsed = JSON.parse(raw) as { url?: unknown };
checkVideoAddress(parsed, source);

// A TikTok video address, full form only: a short link (vm.tiktok.com,
// vt.tiktok.com, tiktok.com/t) names no video until it is opened, so the
// gate refuses it. The address must name a video, not a photo post.
function checkVideoAddress(doc: { url?: unknown }, from: string): void {
  if (
    typeof doc.url !== 'string' ||
    !/^https:\/\/(www|m)\.tiktok\.com\/@[^/]+\/video\/\d+/.test(doc.url)
  ) {
    throw new Error(`VIDEO.json does not hold a TikTok video address: ${from}`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'VIDEO.json'), raw);
