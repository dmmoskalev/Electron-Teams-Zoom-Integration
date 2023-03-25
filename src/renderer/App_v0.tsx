/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser } from 'main/postAuth';
import { BkngData, Booking, getBookings } from 'main/getBookingsToday';
import { Meeting } from './meeting';
import teamsico from '../../assets/teams.svg';
import zoomico from '../../assets/zoom.svg';
import closeico from '../../assets/close.svg';
import './App.css';

export const CurrentUserContext = createContext('init');

export default function App() {

  const bd:BkngData =
    {
      _id: '',
      createdAt: new Date(),
      venueId: '',
      venueType: '',
      venueName: '',
      start: new Date(),
      end: new Date(),
      subject: '',
      organizer: '',
      userId: undefined,
      sync: undefined,
      repeat: undefined,
      organizerName: '',
      data: undefined,
      status: undefined,
      vcsLocation: 'preloaded value'
    };

  let bi ={
    status: '',
    data: [bd]
  };

  const [state, setState] = useState("init");
  const [show, setShow] = useState(false);


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

  interface ApiMeta {
    uri: string,
    api: string,
    name: string,
    pass: string
  };

  const am: ApiMeta = {
    uri: 'https://demo.booco.ru',
    api: '/api/v1/login',
    name: 'D.Moskalev',
    pass: '[{coolBrain}]'
  };


  const getBkng = async (arg:ApiMeta) =>{
    console.log("api request here");
    setShow(false);
    const user: User = await loginUser(arg.uri, arg.api, arg.name, arg.pass) as User;
    try
      {
      if(user.status === "success" && user.data.authToken === null) {
          console.log("ERROR: user authorization failed");
          return -1;
          }

          console.log("User authToken: %s\nUser ID: %s",
          user.data.authToken, user.data.userId);

          const todayBookingApi = '/api/v1/bookings/today';
          bi = await getBookings(
            arg.uri,
            todayBookingApi,
            user.data.authToken,
            user.data.userId) as Booking
          return bi;

      }
      catch(e){
        if (e instanceof Error) {
          console.log("ERROR: connection failed: {0}", e.message);
          return -1;
        }

      }
    return 0;
 };


function error(){
  console.log("ERROR: connection failed");
};

const [bkng, setBkng] = useState(bi.data);

useEffect(()=>{
  let ignore = false;
  if(!ignore)
    {
    getBkng(am).then(()=>{
    setBkng(bi.data);

    return 0;
    }).catch(error);
    }
  return () => {
    ignore = true;
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[show]);




  return (
    <CurrentUserContext.Provider value = {{
      state,
      setState
    }}
  >
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <div className="Hello">
            <hr />
              {bkng.map(bookitem =>
                <Meeting key={bookitem._id} booking={bookitem} onClick={() => {
                  const siteURL = {};
                  window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
                  changeStateWithDelay();
                }} state={state}/>
              )}
            <hr />
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
                  // window.electron.ipcRenderer.sendPOSTreq('open-site', ['https://demo.booco.ru', '/api/v1/login', 'D.Moskalev', '[{coolBrain}]']);
                setShow(!show);
                }}
                className="buttonGray"
              > get Today Schedule
              </button>

              <button
                id="btnNewBook"
                type="button"
                onClick={() => {
                  window.electron.ipcRenderer.postNewBooking('open-site', ['https://demo.booco.ru', '/api/v1/login', 'D.Moskalev', '[{coolBrain}]']);

                }}
                className="buttonGray"
              > generate new booking
              </button>



            </div>
        </div>
        } />
      </Routes>
    </Router>
    </CurrentUserContext.Provider>
  );
}
