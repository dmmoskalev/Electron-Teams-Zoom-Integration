/*
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Локальная конференция 2 группы разработчиков в Zoom","organizer":"Дмитрий Москалев",
"start": "2023-03-28T17:00:00.000Z","end":"2023-03-28T17:30:00.000Z",
"vcsLocation":"https://zoom.us/j/96022247347?pwd=STNEc0pibjlSMGIzTUY3Zm9mQ0dsQT09"}
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Большая конференция с длинным названием в Teams","organizer":"Дмитрий Москалев",
"start": "2023-03-28T20:00:00.000Z","end":"2023-03-28T20:30:00.000Z",
"vcsLocation":"https://teams.live.com/meet/9439360345253"}
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Локальная конференция 2 группы разработчиков в Zoom","organizer":"Дмитрий Москалев",
"start": "2023-03-27T17:00:00.000Z","end":"2023-03-27T17:30:00.000Z",
"vcsLocation":"https://us05web.zoom.us/wc/82604234154/start"}
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Локальная конференция 2 группы разработчиков в Zoom","organizer":"Дмитрий Москалев",
"start": "2023-03-27T17:00:00.000Z","end":"2023-03-27T17:30:00.000Z",
"vcsLocation":"https://us05web.zoom.us/wc/96022247347/start"}  <-- link on sync zoom

test zoom link
https://us05web.zoom.us/j/88311536671?pwd=cHdTelJ6YStTTlVwSkJmK1RKVHU5Zz09

{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Локальная конференция 2 группы разработчиков в Zoom","organizer":"Дмитрий Москалев",
"start": "2023-03-27T17:00:00.000Z","end":"2023-03-27T17:30:00.000Z",
"vcsLocation":"https://zoom.us/wc/99267474904/join?wpk=wcpk%7B0%7D%26%26%26%26wcpk6a43a312110b358316a2924c2bc54595"}

https://zoom.us/wc/99267474904/join?wpk=wcpk%7B0%7D%26%26%26%26wcpk6a43a312110b358316a2924c2bc54595
*/
import fetch from 'node-fetch';

export type NewBooking = {
  message: string;
  status: string;
};

export async function postNewBooking(
  uri: string,
  date: string,
  hour: string,
  vid: string,
  subj: string,
  vcsUri: string,
  authToken: string,
  userId: string
) {
  try {
    const api = '/api/v1/bookings/add';
    const reqstr = uri + api;
    const reqbody = JSON.stringify({
      venueId: vid,
      subject: subj,
      organizer: 'Дмитрий Москалев',
      start: `${date}T${hour}:00:00.000Z`,
      end: `${date}T${hour}:15:00.000Z`,
      vcsLocation: vcsUri,
    });
    const response = await fetch(reqstr, {
      method: 'POST',
      body: JSON.stringify({
        venueId: vid,
        subject: subj,
        organizer: 'Дмитрий Москалев',
        start: `${date}T${hour}:00:00.000Z`,
        end: `${date}T${hour}:15:00.000Z`,
        vcsLocation: vcsUri,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error! POST status: ${response.status}`);
    }

    const result = (await response.json()) as NewBooking;

    // console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
