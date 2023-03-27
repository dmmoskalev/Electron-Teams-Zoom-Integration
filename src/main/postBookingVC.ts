/*
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Локальная конференция 2 группы разработчиков в Zoom","organizer":"Дмитрий Москалев",
"start": "2023-03-27T17:00:00.000Z","end":"2023-03-27T17:30:00.000Z",
"vcsLocation":"https://us05web.zoom.us/wc/82604234154/start"}
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Большая конференция с длинным названием в Teams","organizer":"Дмитрий Москалев",
"start": "2023-03-27T20:00:00.000Z","end":"2023-03-25T20:30:00.000Z",
"vcsLocation":"https://teams.live.com/meet/9439360345253"}
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
  vcsUri: string,
  authToken: string,
  userId: string
) {
  try {
    const api = '/api/v1/bookings/add';
    const reqstr = uri + api;
    let testreq = JSON.stringify({
      venueId: vid,
      subject: 'Тестовая конференция',
      organizer: 'Дмитрий Москалев',
      start: `${date}T${hour}:00:00.000Z`,
      end: `${date}T${hour}:15:00.000Z`,
      vcsLocation: vcsUri,
    });
    testreq = '{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Local conference Zoom","organizer":"Dmitriy Moskalev", "start": "2023-03-27T13:30:00.000Z","end":"2023-03-27T13:45:00.000Z", "vcsLocation":"https://us05web.zoom.us/wc/82604234154/start"}';
    /*
    const response = await fetch(reqstr, {
      method: 'POST',
      body: JSON.stringify({
        venueId: vid,
        subject: 'Тестовая конференция',
        organizer: 'Дмитрий Москалев',
        start: `${date}T${hour}:00:00.000Z`,
        end: `${date}T${hour}:15:00.000Z`,
        vcsLocation: vcsUri,
      }),
      headers: {
        Accept: 'application/json',
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
      },
    });
*/
    const response = await fetch(reqstr, {
      method: 'POST',
      body: testreq,
      headers: {
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
