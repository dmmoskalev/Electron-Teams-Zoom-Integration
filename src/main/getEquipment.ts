/* eslint-disable import/prefer-default-export */
import fetch from 'node-fetch';

type EqData = {
  _id: string;
  name: string;
  host: string;
  driver: string;
  venueId: string;
  pingTimeout: string;
  autoDisconnectTimeout?: number;
  connectiontype?: string;
  description?: string;
  drivertype?: string;
  filename?: string;
  logLevel?: any;
  port?: number;
  reconnectOnErrorTimeout?: number;
  reconnectTimeout?: any;
  testMode?: any;
  version?: number;
};

export type Equipment = {
  status: string;
  data: Array<EqData>;
};

export async function getEquipment(
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
    const result = (await response.json()) as Equipment;

    // console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
