// ==UserScript==
// @name        Gather Town
// @namespace   https://github.com/MateusZ36
// @icon        https://gather.town/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://github.com/MateusZ36/GatherUS/raw/main/gathertown.user.js
// @match       https://gather.town/app/*/*
// @match       https://app.gather.town/app/*/*
// @author      MateusZ3
// @version     2.0.0
// @run-at document-idle
// ==/UserScript==

unsafeWindow.breakAnkles = breakAnkles;
function breakAnkles(n, delay) {
  let dim
  [x, y] = gameSpace.maps[gameSpace.mapId].dimensions
    dim = { x, y }
  for (let i = 0; i < n; i++) {
    setTimeout(() => teleport(Math.round(Math.random() * dim.x), Math.round(Math.random() * dim.y)), (delay ?? 690) * i)
  }
}

unsafeWindow.teleport = teleport;
function teleport(x, y, space) {
  if (!space)
    space = gameSpace.mapId || undefined;
  game.teleport(space, x, y)
}

unsafeWindow.desk = desk;
function desk() {
  const desk = window.localStorage.getItem("desk")
  if (!desk) {
    console.error("Desk not set use the setDesk() function")
    return
  }
  const { x, y, mapId } = JSON.parse(desk);
  teleport(x, y, mapId)
}

unsafeWindow.setDesk = setDesk;
function setDesk() {
  const pos = position()
  window.localStorage.setItem("desk", JSON.stringify(pos))
}

unsafeWindow.position = position;
function position() {
  let position
  const { x, y } = gameSpace.gameState[gameSpace.id]
  position = { x, y, mapId: gameSpace.mapId }
  return position
}

unsafeWindow.getMap = getMap;
function getMap() {
  let map
  map = gameSpace.mapId
  return map
}

unsafeWindow.getMaps = getMaps;
function getMaps() {
  let maps
  maps = gameSpace.maps
  maps = Object.values(maps)
    .map(m => ({ id: m.id, sizeX: m.dimensions[0], sizeY: m.dimensions[1] }))
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
  return maps
}

unsafeWindow.listMaps = listMaps;
function listMaps() {
  console.table(getMaps())
}

unsafeWindow.getPlayer = getPlayer;
function getPlayer() {
  let player
  const p = gameSpace.gameState[gameSpace.id]
  player = {
    id: gameSpace.id,
    name: p.name,
    emojiStatus: p.emojiStatus,
    map: p.map,
    x: p.x,
    y: p.y,
  }
  return player
}

unsafeWindow.getPlayers = getPlayers;
function getPlayers() {
  let players = []
  players = Object.keys(gameSpace.gameState)
    .map(id => {
      const p = gameSpace.gameState[id]
      return {
        id,
        name: p.name,
        emojiStatus: p.emojiStatus,
        map: p.map,
        x: p.x,
        y: p.y,
        isAlone: p.isAlone,
      }
    })
  return players
}

unsafeWindow.teleportToPlayer = teleportToPlayer;
function teleportToPlayer(name) {
  const selectedPlayer = findPlayer(name)
  teleport(selectedPlayer.x, selectedPlayer.y, selectedPlayer.map)
}

unsafeWindow.teleportToSpawn = teleportToSpawn;
function teleportToSpawn(mapId) {
  let maps = []
  maps = gameSpace.maps
  const selectedMap = maps[mapId]
  if (!selectedMap) {
    console.error(`Cannot find map with id ${mapId}`)
    return
  }
  const spawns = selectedMap.spawns
  teleport(spawns[0].x, spawns[0].y, mapId)
}

unsafeWindow.listPlayers = listPlayers;
function listPlayers() {
  console.table(getPlayers())
}

unsafeWindow.findPlayer = findPlayer;
function findPlayer(filter) {
  const players = getPlayers()
  const selectedPlayer = players.find(
    p => {
      normalize = (w) => w.toLowerCase().replace(' ', '');
      return [p.id, p.name, `${p.name} ${p.emojiStatus}`].map(normalize).includes(normalize(filter));
    }
  )
  if (!selectedPlayer) console.error(`Cannot find player ${filter}`)
  return selectedPlayer
}

unsafeWindow.clearStatus = clearStatus;
function clearStatus(){
  game.setEmote("");
  game.setEmojiStatus("");
  game.setTextStatus("");
}

function toggleCoffeeTime(){
  if(getPlayer().emojiStatus)
    clearStatus();
  else {
    //game.setEmote("☕");
    game.setEmojiStatus("☕");
    game.setTextStatus("Fazendo café");
  }
}

function toggleLunchTime(){
  if(getPlayer().emojiStatus)
    clearStatus();
  else {
    //game.setEmote("🍔");
    game.setEmojiStatus("🍔");
    game.setTextStatus("Almoçando");
  }
}

GM_addStyle(`
.css-1fs8e8n {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border: none;
    background-color: rgb(84, 92, 143);
    transition: background-color 200ms ease 0s;
    cursor: pointer;
}
`)

function createElementFromHTML(text){
	let tempDiv = document.createElement("dv");
	tempDiv.innerHTML = text;
	return tempDiv.children[0];
}

function createButtonElement(svgText, onClickEvent=null){
	let rootElement = createElementFromHTML(`<div class="Tooltip"/>`);
	let buttonElement = createElementFromHTML(`<button type="button" class="css-kiwal" onmouseover="this.className='css-1fs8e8n'" onmouseout="this.className='css-kiwal'"/>`);
	let spanElement = createElementFromHTML(`<span width="24px" color="#e0e0e0" class="css-ys7s04"/>`);
	let svgElement = createElementFromHTML(svgText);

	rootElement.appendChild(buttonElement);
	buttonElement.appendChild(spanElement);
	spanElement.appendChild(svgElement);

	if(onClickEvent)
		buttonElement.onclick=onClickEvent;

	return rootElement;
}

let customElementsDiv = createElementFromHTML(`<div class="Layout" style="display: flex; gap: 8px;">`);
customElementsDiv.appendChild(
		createElementFromHTML(`<div class="css-s4puqo"/>`)
);

customElementsDiv.appendChild(
	createButtonElement(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Set Desk</title>
      <desc>A solid styled icon from Orion Icon Library.</desc>
      <path data-name="layer2" d="M50 2H34v16h16zm-4 11a2 2 0 1 1-4 0V9a2 2 0 1 1 4 0z" fill="currentColor"/>
      <path data-name="layer2" d="M55.3 2H54v16.3a3.7 3.7 0 0 1-3.7 3.7H33.7a3.7 3.7 0 0 1-3.7-3.7V2H12v50h8V28h34v24h8V8.7z" fill="#202020"/>
      <path data-name="layer1" fill="#202020" d="M8 12H2v50h52v-6H8V12z"/>
    </svg>`,
		setDesk
	)
);

customElementsDiv.appendChild(
	createButtonElement(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Go to Desk</title>
      <desc>A solid styled icon from Orion Icon Library.</desc>
      <path data-name="layer1" d="M32 2a30 30 0 1 0 30 30A30 30 0 0 0 32 2zm-2 50l-1.2-16.8L12 34l34-16z" fill="currentColor"/>
    </svg>`,
		desk
	)
);

customElementsDiv.appendChild(
	createButtonElement(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
			<title>Coffee Time</title>
		  <path data-name="layer2" d="M52 9v24.9C52 43.3 42.4 51 33 51h-2c-9.5 0-19-7.7-19-17.1V9zm0 4h1a9 9 0 0 1 9 9 9 9 0 0 1-9 9h-1" fill="currentColor" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="4"/>
		  <path data-name="layer1" d="M62 53a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h56a2 2 0 0 1 2 2z" stroke="#000000" stroke-linecap="butt" stroke-linejoin="round" stroke-width="1"/>
		</svg>`,
		toggleCoffeeTime
	)
);

customElementsDiv.appendChild(
	createButtonElement(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink" color="#e0e0e0">
      <title>Lunch Time</title>
      <desc>A line styled icon from Orion Icon Library.</desc>
  <circle data-name="layer2" cx="32.7" cy="33" r="19" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  <circle data-name="layer2" cx="32.7" cy="33" r="11" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  <path data-name="layer1" d="M61.7 34.2V48a2 2 0 0 1-2 2 2 2 0 0 1-2-2V34.1M6.7 12v9.5" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  <path data-name="layer1" d="M61.7 34.2V12a6.3 6.3 0 0 0-6.3 6.3V31a3.2 3.2 0 0 0 3.2 3.2zm-50.5-9.5L10.5 12H2.9l-.6 12.7a3.5 3.5 0 0 0 2.4 3.5V48a2 2 0 1 0 4 0V28.1a3.5 3.5 0 0 0 2.5-3.4z" fill="currentColor" stroke="#202020" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
</svg>`,
		toggleLunchTime
	)
);



function insertDropdown(){
  var rootElement = document.querySelector("#root > div > div > div > div.css-1i6p38t > div:nth-child(1) > div:nth-child(3)");
  if(!rootElement){
      console.log("Could not find root element");
      return
  }
  rootElement.insertBefore(customElementsDiv, rootElement.children[1]);
  clearInterval(DropdownIntervalID);
  console.log("Finished inserting elements.")
}

DropdownIntervalID = setInterval(insertDropdown,10000)

