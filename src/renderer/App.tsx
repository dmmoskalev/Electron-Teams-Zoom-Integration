/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser } from 'main/postAuth';
import { BkngData, Booking, getBookings } from 'main/getBookingsToday';
import { Meeting } from './meeting';
import { CloseButton } from './closeButton';
import { RecordButton } from './recordButton';
import closeico from '../../assets/close.svg';
import boocoicon from '../../assets/booco_logo.svg';
import './App.css';

export const CurrentStateContext = createContext('init');

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
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('ru-RU', options);

  const delay = (ms:number) => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  /*
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
*/
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
    <CurrentStateContext.Provider value = {{
      state,
      setState
    }}
  >
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <div className="Hello">
            <div className={(state==="init") ? "schedule-header":"hidden"}>
                <img className="icon-booco"
                  src={boocoicon}
                  alt="icon" />
                <div className="text-shedule-header">
                  Переговорная с оригинальным названием
                </div>
                <div className="text-organizer">
                  {today}
                </div>
              </div>

              {bkng.map(bookitem =>
                <Meeting key={bookitem._id} booking={bookitem} />
              )}

              <div id="controlPanel" className="control-panel">
              <CloseButton />
              <RecordButton />
              </div>


              <div className={(state==="connecting")? "label":"hidden"}>
                <p>Connecting...</p>
              </div>
              <button
                id="btnNewBook"
                type="button"
                onClick={() => {
                  window.electron.ipcRenderer.postNewBooking('open-site', ['https://demo.booco.ru', '/api/v1/login', 'D.Moskalev', '[{coolBrain}]']);

                }}
                className="hidden"
              > generate new booking
              </button>



            </div>
        </div>
        } />
      </Routes>
    </Router>
    </CurrentStateContext.Provider>
  );
}
