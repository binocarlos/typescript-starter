import harness from '../harness'

harness('auth:login', async (t, {
  controllers,
  getClient,
}) => {

  const username = 'bob@bob.com'
  const password = 'password'

  // initial status with no login
  const noLoginStatusRes = await getClient({}).get('/auth/status')
  t.equal(noLoginStatusRes.status, 200, `200 status`)
  t.notOk(noLoginStatusRes.data, `no current login`)

  // bad login
  const badLoginRes = await getClient({}).post('/auth/login', {
    username,
    password,
  })
  t.equal(badLoginRes.status, 401, `401 status`)
  t.equal(badLoginRes.data.error, `incorrect details`, `correct error`)

  // register
  const registerRes = await getClient({}).post('/auth/register', {
    username,
    password,
  })
  t.equal(registerRes.status, 201, `201 status`)
  t.ok(registerRes.data.token, `there is a token in the register response`)

  // login
  const loginRes = await getClient({}).post('/auth/login', {
    username,
    password,
  })
  t.equal(loginRes.status, 200, `200 status`)
  t.ok(loginRes.data.token, `there is a token in the login response`)

  // status with token
  const loginStatusRes = await getClient({
    token: loginRes.data.token,
  }).get('/auth/status')
  t.equal(loginStatusRes.status, 200, `200 status`)
  t.ok(loginStatusRes.data, `have current login`)
  t.equal(loginStatusRes.data.email, username, `the user record was returned`)

  // re-generate token - logged in
  const tokenRes = await getClient({
    token: loginRes.data.token,
  }).post('/auth/token')
  t.equal(tokenRes.status, 201, `201 status`)
  t.ok(tokenRes.data.token, `have current login`)

  // re-generate token - not logged in
  const noTokenRes = await getClient({}).post('/auth/token')
  t.equal(noTokenRes.status, 401, `403 status`)

  // new token status
  const newTokenStatusRes = await getClient({
    token: tokenRes.data.token,
  }).get('/auth/status')
  t.equal(newTokenStatusRes.status, 200, `200 status`)
  t.ok(newTokenStatusRes.data, `have current login`)
  t.equal(newTokenStatusRes.data.email, username, `the user record was returned`)

}, {
  web: true,
})
