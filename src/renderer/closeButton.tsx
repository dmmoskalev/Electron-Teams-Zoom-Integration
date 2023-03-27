/* eslint-disable import/prefer-default-export */
import { createContext, useContext, useState, useEffect } from 'react';
import closeico from '../../assets/close.png';


import { CurrentStateContext } from './App';

export function CloseButton(){

  const {state,setState} = useContext(CurrentStateContext);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const initWithDelay = async () => {
    setState('closing');
    await delay(3000);
    setState('init');
  };

  return (
    <button
      id="btnClose"
      type="button"
      onClick={() => {
        const siteURL = 'CLOSE';
        window.electron.ipcRenderer.sendMessage('open-site', [siteURL]);
        initWithDelay();
      }}
      className={state === 'close' ? 'control-button' : 'hidden'}
    >
      <span role="img" aria-label="folded hands">
        <img width="24" alt="icon" src={closeico} />
      </span>
      Закрыть
    </button>
  );
}
