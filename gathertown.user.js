// ==UserScript==
// @name        Gather Town
// @namespace   https://github.com/MateusZ36
// @icon        https://gather.town/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://github.com/MateusZ36/GatherUS/raw/main/gathertown.user.js
// @match       https://gather.town/app/*/*
// @match       https://app.gather.town/app/*/*
// @author      MateusZ3
// @version     1.3.5
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

unsafeWindow.ring = ring;
function ring(name) {
  const player = findPlayer(name)
  gameSpace.ringUser(player.id)
}

GM_addStyle(`
  .dropdownButtonContainer {
    position: relative;
  }
  .dropdownButtonContainer .hiddenButtons {
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }
  .dropdownButtonContainer:hover .hiddenButtons {
    filter:brightness(0.8);
  }
  .teleportButton {
    background-color: #00A000;
  }
  
  .setDeskButton {
    background-color:#A00000;
  }
  .deskButton {
    background-color: #0000A0;
    width: 100%;
  }

  .dropdownButtonContainer .dropdownContent {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    left: 100%;
    top: 0;
  }
  .dropdownButtonContainer .dropdownContent a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  .dropdownButtonContainer .dropdownContent a:hover {
    background-color: #f1f1f1
  }
  .dropdownButtonContainer:hover .dropdownContent {
    display: block;
  }
`)

hiddenButtonsContainer = document.createElement("div");
hiddenButtonsContainer.hidden=true;

teleportContainer = document.createElement("div");
teleportContainer.className = "dropdownButtonContainer";

dropdownButton = document.createElement("button");
dropdownButton.className = "hiddenButtons teleportButton";
dropdownButton.textContent="Teleport"
dropdownButton.onmouseover = updatePlayersList;
teleportContainer.appendChild(dropdownButton);

teleportDropdownContainerContent = document.createElement("div");
teleportDropdownContainerContent.className = "dropdownContent";
teleportContainer.appendChild(teleportDropdownContainerContent);


setDeskContainer = document.createElement("div");
setDeskContainer.className = "dropdownButtonContainer";

setDeskButton = document.createElement("button");
setDeskButton.className = "hiddenButtons setDeskButton";
setDeskButton.textContent="Set Desk"
setDeskButton.onclick = setDesk;
setDeskContainer.appendChild(setDeskButton);


deskContainer = document.createElement("div");
deskContainer.className = "dropdownButtonContainer";

deskButton = document.createElement("button");
deskButton.className = "hiddenButtons deskButton";
deskButton.textContent="Desk"
deskButton.onclick = desk;
deskContainer.appendChild(deskButton);


hiddenButtonsContainer.appendChild(teleportContainer);
hiddenButtonsContainer.appendChild(setDeskContainer);
hiddenButtonsContainer.appendChild(deskContainer);

function updatePlayersList(){
  teleportDropdownContainerContent.replaceChildren([]);
  var players = getPlayers().sort((a, b) => {return a.name.localeCompare(b.name)});
  players.forEach(
    (player)=>{
      if(player.name != getPlayer().name){
        var playerElement = document.createElement("a");
        playerElement.text = player.name;
        playerElement.setAttribute("playerID", player.id);
        playerElement.onclick = function(event) {
          teleportToPlayer(event.target.getAttribute("playerID"));
        }
        teleportDropdownContainerContent.appendChild(playerElement);
      }
    }
)
}

function insertDropdown(){
  console.log("Trying to insert dropdown.");
  root = document.querySelector("#root > div > div > div > div:nth-child(1) > div.Layout >div.Tooltip"); 
  if(root){
    root = root.parentElement.parentElement;
    root.children[0].style.marginBottom = "auto";
    root.insertBefore(hiddenButtonsContainer, root.firstChild);
    clearInterval(DropdownIntervalID);
    document.querySelector(
      "[data-testid=\"action-bar-emote-item\"]"
    ).addEventListener("click",(e) => {
      hiddenButtonsContainer.hidden=!hiddenButtonsContainer.hidden
    });
    console.log("dropdown successfully inserted.")
  } else {
    console.log("unable to insert dropdown.")
  }
}

DropdownIntervalID = setInterval(insertDropdown,10000)
