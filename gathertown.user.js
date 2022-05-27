// ==UserScript==
// @name        Gather Town
// @namespace   https://github.com/MateusZ36
// @icon        https://gather.town/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://github.com/MateusZ36/GatherUS/raw/main/gathertown.user.js
// @match       https://gather.town/app/*/*
// @match       https://app.gather.town/app/*/*
// @author      MateusZ3
// @version     2.0.2
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

unsafeWindow.setStatus = setStatus;
function clearStatus(emote="",emojiStatus="",textStatus=""){
  game.setEmote(emote);
  game.setEmojiStatus(emojiStatus);
  game.setTextStatus(textStatus);
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

function insertCustomButton(svg,onClick=null){
  customElementsDiv.appendChild(createButtonElement(svg,onClick))
}

function insertDropdown(){
  var rootElement = document.querySelector("#root > div > div > div > div.css-1i6p38t > div:nth-child(1) > div:nth-child(3)");
  if(!rootElement){
      console.log("Could not find root element");
      return;
  }
  rootElement.insertBefore(customElementsDiv, rootElement.children[1]);
  clearInterval(DropdownIntervalID);
  console.log("Finished inserting elements.");
}

DropdownIntervalID = setInterval(insertDropdown,10000);
