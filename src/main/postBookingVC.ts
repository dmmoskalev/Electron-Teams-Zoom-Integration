/*
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Zooming","organizer":"Дмитрий Москалев",
"start": "2023-03-25T19:00:00.000Z","end":"2023-03-25T19:30:00.000Z",
"vcsLocation":"https://us05web.zoom.us/wc/82604234154/start"}
{"venueId":"2fwKcjvxkbrJvtM7L","subject":"Большая конференция с длинным названием в Teams","organizer":"Дмитрий Москалев",
"start": "2023-03-25T17:00:00.000Z","end":"2023-03-25T17:30:00.000Z",
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
    const api = '/api/v1/bookings';
    const reqstr = uri + api;
    const testreq = JSON.stringify({
      venueId: vid,
      subject: 'Zooming',
      organizer: 'Дмитрий Москалев',
      start: `${date}T${hour}:00:00.000Z`,
      end: `${date}T${hour}:30:00.000Z`,
      vcsLocation: vcsUri,
    });
    const response = await fetch(reqstr, {
      method: 'POST',
      body: JSON.stringify({
        venueId: vid,
        subject: 'Zooming',
        organizer: 'Дмитрий Москалев',
        start: `${date}T${hour}:00:00.000Z`,
        end: `${date}T${hour}:30:00.000Z`,
        vcsLocation: vcsUri,
      }),
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
