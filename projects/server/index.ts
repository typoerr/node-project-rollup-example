import express from 'express'
import html from 'html-template-tag'
import fetch from 'node-fetch'
import cookie from 'cookie-parser'

const POCKET_CONSUMER_KEY = process.env.POCKET_CONSUMER_KEY
const REDIRECT_URL = 'http://localhost:3000/auth/callback'

async function getRequestToken(): Promise<{ code: string }> {
  const res = await fetch('https://getpocket.com/v3/oauth/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: POCKET_CONSUMER_KEY,
      redirect_uri: REDIRECT_URL,
    }),
  })

  if (!res.ok) {
    throw new Error('request tokenの取得に失敗')
  }
  return res.json()
}

async function getAccessToken(
  requestToken: string,
): Promise<{ access_token: string; username: string }> {
  const res = await fetch('https://getpocket.com/v3/oauth/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: POCKET_CONSUMER_KEY,
      code: requestToken,
    }),
  })
  if (!res.ok) {
    throw new Error('acccess tokenの取得に失敗')
  }
  return res.json()
}

function isLogin(req: express.Request) {
  return Boolean(req.cookies['access_token'])
}

const router = express.Router()

router.get('/', async (req, res, next) => {
  if (isLogin(req)) {
    return next()
  }

  const { code } = await getRequestToken()
  const url = `https://getpocket.com/auth/authorize?request_token=${code}&redirect_uri=${REDIRECT_URL}`
  const view = html`
    <div>
      <h1>Login Page</h1>
      <a href="${url}">login</a>
    </div>
  `

  return res.cookie('request_token', code, { httpOnly: true, sameSite: 'lax' }).send(view)
})

router.get('/', async (req, res) => {
  return res.send(html`
    <div>
      <h1>hello loggin user</h1>
      <pre><code>${JSON.stringify(req.cookies)}</code></pre>
    </div>
  `)
})

router.get('/auth/callback', async (req, res) => {
  const request_token = req.cookies['request_token']
  const tokens = await getAccessToken(request_token)
  return res //
    .cookie('access_token', tokens.access_token, { httpOnly: true, sameSite: 'lax' })
    .cookie('username', tokens.username, { httpOnly: true, sameSite: 'lax' })
    .clearCookie('request_token')
    .redirect('/')
})

const server = express()
server.use(cookie())
server.use(router)
server.listen(3000)
