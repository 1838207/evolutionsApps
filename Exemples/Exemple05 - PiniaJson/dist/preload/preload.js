"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  send: (channel2, data) => electron.ipcRenderer.send(channel2, data),
  on: (channel2, callback) => {
    electron.ipcRenderer.on(channel2, callback);
  },
  chargerParticipants: () => electron.ipcRenderer.invoke("Canal-ChargerParticipants"),
  ajouterParticipant: (participant) => electron.ipcRenderer.invoke("Canal-AjouterParticipant", participant),
  showMessageBox: (options) => electron.ipcRenderer.invoke("show-message-box", options),
  // Exposer au main process le delete demandé par le renderer
  supprimerParticipant: (matricule) => electron.ipcRenderer.invoke("Canal-SupprimerParticipant", matricule),
  once: (channel2, callback) => {
    electron.ipcRenderer.once(channel2, callback);
  },
  modifierParticipant: (participant) => electron.ipcRenderer.invoke("Canal-ModifierParticipant", participant)
});
