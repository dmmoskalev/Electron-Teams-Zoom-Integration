/* eslint-disable import/prefer-default-export */
/*
works only with follow node-fetch package:
npm install node-fetch@2.6.7
npm install --save-dev @types/node-fetch@2.x
*/
import fetch from 'node-fetch';

export type Data = {
  authToken: string;
  userId: string;
};

export type User = {
  status: string;
  data: Data;
};

export async function loginUser(
  uri: string,
  api: string,
  name: string,
  pass: string
) {
  try {
    // 👇️ const response: Response
    const reqstr = uri + api;
    const response = await fetch(reqstr, {
      method: 'POST',
      body: JSON.stringify({
        username: name,
        password: pass,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! POST status: ${response.status}`);
    }

    const result = (await response.json()) as User;

    // console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}
