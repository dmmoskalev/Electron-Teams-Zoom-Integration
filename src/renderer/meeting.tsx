/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
// import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { BkngData } from 'main/getBookingsToday';
import teamsico from '../../assets/teams.svg';
import zoomico from '../../assets/zoom.svg';
import personico from '../../assets/person_icon.svg';
import timeico from '../../assets/time_icon.svg';
import { CurrentStateContext } from './App';

interface BookData {
  booking: BkngData
};

export function Meeting ({booking}:BookData) {
  const position:number = booking.start.toString().search("T");
  const timeStart:string = booking.start.toString().slice(position+1,-8);
  const timeEnd:string = booking.end.toString().slice(position+1,-8);
  const isZoom:boolean = booking.vcsLocation.search("zoom")>0;

  const {state,setState} = useContext(CurrentStateContext);

  const delay = (ms:number) => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const changeStateWithDelay = async () => {
    setState("connecting");
    await delay(3000);
    setState("close");
  };

  return (
    <button
                id={booking._id}
                type="button"
                onClick={() => {
                  const siteURL = booking.vcsLocation;
                  window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
                  changeStateWithDelay();
                }}
                className={(state==="init") ? "button":"hidden"}
              >
                <span>
                  <div className="kartochka">
                    <div className="view-subject">
                      <img className="zoom-logo"
                      src={isZoom? zoomico:teamsico}
                      alt="Zoom Logo"/>
                      <h1 className="text-subject">{ booking.subject }</h1>
                    </div>
                    <div className="view-time-organizer">
                      <div className="view-time">
                        <img className="icon-time"
                        src={timeico}
                        alt="icon"/>
                        <div className="text-time">
                          {timeStart} - {timeEnd}
                        </div>
                      </div>
                      <div className="view-organizer">
                          <img className="icon-person"
                          src={personico}
                          alt="icon" />
                          <div className="text-organizer">
                            {booking.organizer}
                          </div>
                      </div>

                    </div>

                    <div className="meetingLink"> Meeting link: { booking.vcsLocation }</div>
                  </div>
                </span>

              </button>

  )

}
