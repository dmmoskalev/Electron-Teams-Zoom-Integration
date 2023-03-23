/* eslint-disable import/prefer-default-export */
// api :
// bookings/today

import fetch from 'node-fetch';

type BkngData = {
  _id: string;
  createdAt?: Date;
  venueId: string;
  venueType: string;
  venueName: string;
  start: Date;
  end: Date;
  subject: string;
  organizer: string;
  userId?: string;
  sync?: any;
  repeat?: Repeat;
  organizerName: string;
  data?: any;
  status?: string;
  vcsLocation: string;
};

type Repeat = {
  type?: string;
  weekdays?: Weekdays;
  id?: string;
  start?: Date;
  end?: Date;
};

type Weekdays = {
  thursdays?: boolean;
  fridays?: boolean;
};

export type Booking = {
  status: string;
  data: Array<BkngData>;
};

export async function getBookings(
  uri: string,
  api: string,
  authToken: string,
  userId: string
) {
  try {
    const reqstr = uri + api;
    const response = await fetch(reqstr, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Auth-Token': authToken,
        'X-User-Id': userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = (await response.json()) as Booking;

    // console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
