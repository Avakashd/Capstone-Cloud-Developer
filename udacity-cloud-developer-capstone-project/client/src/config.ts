const apiId = '60je7acu95'
const region = 'us-east-1'
const devPort = '3050'

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`
export const devapiEndpoint = `http://localhost:${devPort}/dev`
export const subDirectory = 'travels'

export const authConfig = {
  domain: 'avakashd.us.auth0.com',
  clientId: 'yLnBaFGdN6IK99pjNBzumOCtHlOGVsuV',
  callbackUrl: 'http://localhost:3000/callback'
}
