// ==UserScript==
// @name        Gather Town
// @namespace   https://github.com/MateusZ36
// @icon        https://gather.town/favicon.ico
// @grant       GM_addStyle
// @match       https://gather.town/app/*/*
// @match       https://app.gather.town/app/*/*
// @author      MateusZ3
// @version     2.0.1
// @run-at document-idle
// @require https://github.com/MateusZ36/GatherUS/raw/main/gathertown.user.js
// ==/UserScript==


insertCustomStatus(`
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L7 17M7 7l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  "Clear",
  setStatus
)

insertCustomStatus(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Coffee Time</title>
    <path data-name="layer2" d="M52 9v24.9C52 43.3 42.4 51 33 51h-2c-9.5 0-19-7.7-19-17.1V9zm0 4h1a9 9 0 0 1 9 9 9 9 0 0 1-9 9h-1" fill="currentColor" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="4"/>
    <path data-name="layer1" d="M62 53a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h56a2 2 0 0 1 2 2z" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="1"/>
  </svg>`,
  "Coffee",
  ()=>{setStatus("","☕","Fazendo café")}
)

insertCustomStatus(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink" color="#e0e0e0">
    <desc>A line styled icon from Orion Icon Library.</desc>
    <circle data-name="layer2" cx="32.7" cy="33" r="19" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <circle data-name="layer2" cx="32.7" cy="33" r="11" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path data-name="layer1" d="M61.7 34.2V48a2 2 0 0 1-2 2 2 2 0 0 1-2-2V34.1M6.7 12v9.5" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path data-name="layer1" d="M61.7 34.2V12a6.3 6.3 0 0 0-6.3 6.3V31a3.2 3.2 0 0 0 3.2 3.2zm-50.5-9.5L10.5 12H2.9l-.6 12.7a3.5 3.5 0 0 0 2.4 3.5V48a2 2 0 1 0 4 0V28.1a3.5 3.5 0 0 0 2.5-3.4z" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </svg>`,
  "Lunch",
  ()=>{setStatus("","🍔","Almoçando")}
);



insertCustomButton(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Set Desk</title>
    <desc>A solid styled icon from Orion Icon Library.</desc>
    <path data-name="layer2" d="M50 2H34v16h16zm-4 11a2 2 0 1 1-4 0V9a2 2 0 1 1 4 0z" fill="currentColor"/>
    <path data-name="layer2" d="M55.3 2H54v16.3a3.7 3.7 0 0 1-3.7 3.7H33.7a3.7 3.7 0 0 1-3.7-3.7V2H12v50h8V28h34v24h8V8.7z" fill="#202020"/>
    <path data-name="layer1" fill="#202020" d="M8 12H2v50h52v-6H8V12z"/>
  </svg>`,
  setDesk
);

insertCustomButton(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Go to Desk</title>
    <desc>A solid styled icon from Orion Icon Library.</desc>
    <path data-name="layer1" d="M32 2a30 30 0 1 0 30 30A30 30 0 0 0 32 2zm-2 50l-1.2-16.8L12 34l34-16z" fill="currentColor"/>
  </svg>`,
  desk
);
