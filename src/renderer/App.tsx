import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import teamsico from '../../assets/teams.svg';
import zoomico from '../../assets/zoom.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <button
          id="btnTeams"
          type="button"
          onClick={() => {
            const siteURL = 'https://teams.live.com/meet/9565454927353';
            window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
          }}
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
            const siteURL =
              'https://us05web.zoom.us/j/86909229890?pwd=bjZmSXd0a1dyTkpUbCtSbmc3MTFWdz09';
            window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
          }}
        >
          <span role="img" aria-label="folded hands">
            <img width="40" alt="icon" src={zoomico} />
          </span>
          Connect Zoom
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
