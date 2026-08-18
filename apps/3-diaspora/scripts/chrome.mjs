/**
 * Waar Chrome staat.
 *
 * De scripts hiernaast openen een echte Chrome om de pagina te meten of te
 * fotograferen. Het pad daarheen stond in elk script apart, en dan nog in de
 * Windows-vorm waarin dit project begon. Nu op één plek, en op de drie
 * platforms waar iemand dit ooit draait.
 */
import {existsSync} from 'node:fs';

const KANDIDATEN = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium'],
};

/* CHROME_PAD in de omgeving wint, voor wie hem ergens anders heeft staan. */
export const CHROME =
  process.env.CHROME_PAD ||
  (KANDIDATEN[process.platform] ?? []).find((p) => existsSync(p)) ||
  'google-chrome';
