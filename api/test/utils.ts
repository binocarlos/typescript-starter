import {
  AxiosResponse,
} from 'axios'

import {
  Test,
} from 'tape'

export const failHttp = async (t: Test, expectedCode: number, handler: () => Promise<AxiosResponse>) => {
  try {
    const res = await handler()
    t.fail(`expected http failure: ${expectedCode} got ${res.status}`)
  } catch(e) {
    if(!e.response) {
      t.fail(e)
    }
    else {
      t.equal(e.response.status, expectedCode, `http code was correct: ${expectedCode}`)
    }
  }
}