/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import teamsico from '../../assets/teams.svg';
import zoomico from '../../assets/zoom.svg';
import closeico from '../../assets/close.svg';
import './App.css';


export default function App() {
  const [state, setState] = useState("init");


  const delay = (ms:number) => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  const changeStateWithDelay = async () => {
    setState("connecting");
    await delay(3000);
    setState("close");
  };

  const initWithDelay = async () => {
    setState("closing");
    await delay(3000);
    setState("init");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <div className="Hello">
              <button
                id="btnTeams"
                type="button"
                onClick={() => {
                  const siteURL = 'https://teams.live.com/meet/9565454927353';
                  window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
                  changeStateWithDelay();
                }}
                className={(state==="init") ? "button":"hidden"}
              >
                <span role="img" aria-label="books">
                  <img width="40" alt="icon" src={teamsico} />
                </span>
                Connect Teams
              </button>

              <button
                id="btnZoom"
                type="button"
                onClick={() => {
                  const siteURL = 'https://us05web.zoom.us/wc/89675141488/start';
                  window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
                  changeStateWithDelay();
                }}
                className={(state==="init") ? "button":"hidden"}
              >
                <span role="img" aria-label="folded hands">
                  <img width="40" alt="icon" src={zoomico} />
                </span>
                Connect Zoom
              </button>
              <button
                id="btnClose"
                type="button"
                onClick={() => {
                  const siteURL = 'CLOSE';
                  window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
                  initWithDelay();
                }}
                className={(state==="close") ? "button":"hidden"}
              >
                <span role="img" aria-label="folded hands">
                  <img width="40" alt="icon" src={closeico} />
                </span>
                Close
              </button>
              <div className={(state==="connecting")? "label":"hidden"}>
                <p>Connecting...</p>
              </div>
              <button
                id="btnApi"
                type="button"
                onClick={() => {
                  window.electron.ipcRenderer.sendPOSTreq('open-site', ['https://demo.booco.ru', '/api/v1/login', 'D.Moskalev', '[{coolBrain}]']);

                }}
                className="button"
              > HTTP Request
              </button>

            </div>
        </div>
        } />
      </Routes>
    </Router>
  );
}
