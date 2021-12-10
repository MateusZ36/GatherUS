// ==UserScript==
// @name        Gather Town
// @namespace   Violentmonkey Scripts
// @match       https://gather.town/app/*
// @grant       none
// @version     1.0
// @author      -
// @run-at document-idle
// @description 17/11/2021 15:43:27
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
  gameSpace.teleport(x, y, space)
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

unsafeWindow.ghost = ghost;
function ghost() {
  gameSpace.setGhost(true)
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

unsafeWindow.setDesk = setDesk;
function setDesk() {
  const pos = position()
  window.localStorage.setItem("desk", JSON.stringify(pos))
}

unsafeWindow.findPlayer = findPlayer;
function findPlayer(filter) {
  const players = getPlayers()
  const selectedPlayer = players.find(p => {
    normalize = (w) => w.toLowerCase().replace(' ', '');
    return [p.id, p.name, `${p.name} ${p.emojiStatus}`].map(normalize).includes(normalize(filter));
  })
  if (!selectedPlayer) console.error(`Cannot find player ${filter}`)
  return selectedPlayer
}

unsafeWindow.ring = ring;
function ring(name) {
  const player = findPlayer(name)
  gameSpace.ringUser(player.id)
}

NodeList.prototype.find = Array.prototype.find;

document.body.addEventListener('click',() => {
  const TeleportButtonText = 'Teleport to';
  const SetDeskButtonText = 'Set Desk';
  const DeskButtonText = 'Teleport to Desk';
setTimeout(() => {
  var possibleRoots = [
    "#root > div > div > div.css-ubf26x > div:nth-child(2) > div.Layout.center-y > div",
    "#root > div > div > div.css-1a7865x > div:nth-child(2) > div.Layout.center-y > div"
  ];
  
  for(i=0;i<possibleRoots.length;i++){
    tmp = document.querySelector(possibleRoots[i]);
    if(tmp){
        var rootWindow = possibleRoots[i];
        break;
    }
  }
  
  if(!rootWindow) return;  
    
  var possiblePaths = [
    "div.Layout.css-1hg9omi > span",
    "div:nth-child(2) > div",
    "div.Layout:nth-child(3)"
  ]
  const doc = document.querySelector(rootWindow);
  const player = getPlayer();
  for(i=0;i<possiblePaths.length;i++){
    tmp = document.querySelector(`${rootWindow} > ${possiblePaths[i]}`)
    if(tmp){
        var name = tmp;
        break;
    }
  }
  if(!name) {
    console.debug("Could not find name")
    return;
  }
  
  name = name.innerText;
  if (doc && !doc.childNodes.find(cn => cn.innerText === TeleportButtonText)) {
    if (name !== player.name && name !== `${player.name} ${player.emojiStatus}`) {
      var statusDiv = document.querySelector(`${rootWindow} > div.Layout.css-1hg9omi > div > div:nth-child(2)`);
      //if(!statusDiv.innerText.includes("Online")) return;
      
      var teleportDiv = document.createElement("div");
      teleportDiv.innerHTML = `<div class="Layout css-1tjixaa" style="display: flex; align-items: center; width: 100%;"><div class="css-1etbslx"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16 fa-lg " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><<path fill="currentColor" d="m156.433594 167.203125h15v49.226563h-15zm0 0"/><path fill="currentColor" d="m156.433594 497h-22.933594l-6.082031-6.082031v-180.640625h-39.386719v180.640625l-6.082031 6.082031h-22.933594v-329.796875h-15v138.359375h-17.519531l-11.496094-11.5v-80.515625h-15v86.730469l20.285156 20.285156h23.730469v191.4375h44.148437l14.867188-14.871094v-171.851562h9.386719v171.851562l14.871093 14.871094h44.144532v-105.53125h-15zm0 0"/><path fill="currentColor" d="m143.515625 114.558594v-9.914063l14.820313-14.820312v-39.214844c0-27.90625-22.703126-50.609375-50.609376-50.609375s-50.613281 22.703125-50.613281 50.609375v6.105469h15v-6.105469c0-19.632813 15.976563-35.609375 35.613281-35.609375 19.636719 0 35.609376 15.976562 35.609376 35.609375v33l-22.679688 22.679687h-25.863281l-22.679688-22.679687v-6.894531h-15v13.109375l14.824219 14.820312v9.914063h-47.394531l-24.542969 24.539062v54.449219h15v-48.234375l15.753906-15.753906h56.183594v-9.914063l1.644531 1.644531h38.289063l1.644531-1.644531v9.914063h56.183594l15.753906 15.753906v148.75l-11.496094 11.5h-17.519531v-69.132812h-15v150.039062h15v-65.90625h23.730469l20.285156-20.285156v-161.179688l-24.542969-24.539062zm0 0"/><path fill="currentColor" d="m487.457031 114.558594h-47.394531v-9.914063l14.820312-14.820312v-39.214844c.003907-27.90625-22.703124-50.609375-50.609374-50.609375-22.59375 0-41.777344 14.882812-48.261719 35.355469h-103.867188v15h101.519531v.253906 38.03125h-53.796874v15h67.613281l1.003906 1.003906v9.910157h-47.394531l-24.542969 24.542968v2.832032h-50.691406v15h50.691406v38.285156h-26.691406v15h26.691406v38.285156h-44.40625v15h44.40625v36.777344l1.511719 1.507812h-23.105469v15h38.105469l3.773437 3.773438h23.734375v34.511718h-113.566406v15h113.566406v38.285157h-53.035156v15h53.035156v38.285156h-88.425781v15h88.425781v35.359375h44.144532l14.871093-14.871094v-171.851562h9.386719v171.851562l14.867188 14.871094h44.148437v-191.4375h23.730469l20.285156-20.285156v-161.179688zm-118.792969-63.949219c0-19.632813 15.976563-35.609375 35.609376-35.609375 19.636718 0 35.609374 15.976562 35.609374 35.609375v33l-22.679687 22.679687h-25.863281l-22.679688-22.679687v-33zm-57.117187 243.453125v-28.363281h29.019531v39.859375h-17.519531zm73.035156 196.855469-6.085937 6.082031h-22.929688v-41.644531h29.015625zm68.402344 6.082031h-22.933594l-6.082031-6.082031v-35.5625h29.015625zm44.015625-202.9375-11.496094 11.496094-17.519531.003906v-39.863281h29.015625zm-29.015625-43.363281v-83.496094h-15v273.152344h-29.019531v-130.078125h-39.386719v130.078125h-29.015625v-273.152344h-15v83.496094h-29.015625v-105.386719l15.753906-15.753906h56.183594v-9.914063l1.644531 1.644531h38.289063l1.644531-1.644531v9.914063h56.183594l15.753906 15.753906v105.386719zm0 0"/><path fill="currentColor" d="m368.066406 279.535156h72.417969v15h-72.417969zm0 0"/><path fill="currentColor" d="m368.066406 250.535156h72.417969v15h-72.417969zm0 0"/><path fill="currentColor" d="m365.960938 166.019531v44.242188l38.3125 22.125 38.316406-22.125v-44.242188l-38.316406-22.121093zm61.628906 35.585938-23.316406 13.460937-23.3125-13.460937v-26.921875l23.3125-13.460938 23.316406 13.460938zm0 0"/><path fill="currentColor" d="m415.261719 94.09375-10.605469-10.605469 10.230469-10.230469v-1.097656h1.097656l1.101563-1.101562 1.097656 1.101562h11.703125v7.308594zm14.625-31.9375h-15v-11.546875c0-.675781-.066407-1.351563-.191407-2.011719l14.730469-2.835937c.304688 1.589843.460938 3.222656.460938 4.847656zm-17.800781-18.714844c-2.039063-2.21875-4.8125-3.441406-7.8125-3.441406v-15c7.140624 0 14.015624 3.023438 18.859374 8.296875zm0 0"/><path fill="currentColor" d="m491 233.199219h-15v-30.640625h15zm0-40.636719h-15v-15h15zm0-25h-15v-15h15zm0 0"/><path fill="currentColor" d="m446.984375 415.855469h-15v-30.636719h15zm0-40.636719h-15v-15h15zm0-25h-15v-15h15zm0 0"/></svg></div><span font-weight="500" font-size="15" font-family="DM Sans, sans-serif" color="#ffffff" class="css-1pl00je">${TeleportButtonText}</span></div>`
      teleportDiv.addEventListener('click', ()=> teleportToPlayer(name))
      doc.append(teleportDiv);
      
      var spacedDiv = document.createElement("div");
      Object.assign(spacedDiv, {
        "class": "Layout",
        "style": "display: flex; height: 8px;"
      });
      doc.append(spacedDiv);
      
      var aloneDiv = document.createElement("div");
      aloneDiv.setAttribute("class","Layout");
      aloneDiv.setAttribute("style","display: flex;");
      
      var aloneSpan = document.createElement("span");
      aloneSpan.setAttribute("font-weight","500");
      aloneSpan.setAttribute("font-size","15");
      aloneSpan.setAttribute("font-family","DM Sans, sans-serif");
      aloneSpan.setAttribute("color","#ffffff");
      aloneSpan.setAttribute("class","css-1pl00je");
      aloneSpan.innerText = (findPlayer(name).isAlone?"Is Alone":"Is Not Alone");
      aloneDiv.append(aloneSpan);
      statusDiv.append(aloneDiv);
    }
  }
  if(doc && !doc.childNodes.find(cn => cn.innerText.includes(SetDeskButtonText))){
    if (name === player.name || name === `${player.name} ${player.emojiStatus}`) {
      var setDeskDiv = document.createElement("div");
      setDeskDiv.innerHTML = `<div class="Layout css-1tjixaa" style="display: flex; align-items: center; width: 100%;"><div class="css-1etbslx"><</div><span font-weight="500" font-size="15" font-family="DM Sans, sans-serif" color="#ffffff" class="css-1pl00je">${SetDeskButtonText}</span></div>`
      setDeskDiv.addEventListener('click', ()=> setDesk());
      doc.append(setDeskDiv);
      
      var deskDiv = document.createElement("div");
      deskDiv.innerHTML = `<div class="Layout css-1tjixaa" style="display: flex; align-items: center; width: 100%;"><div class="css-1etbslx"><</div><span font-weight="500" font-size="15" font-family="DM Sans, sans-serif" color="#ffffff" class="css-1pl00je">${DeskButtonText}</span></div>`
      deskDiv.addEventListener('click', ()=> desk());
      doc.append(deskDiv);
    }
  }
}, 100)
})
