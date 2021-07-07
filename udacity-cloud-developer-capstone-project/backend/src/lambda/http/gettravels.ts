import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { getAlltravels } from '../../businessLogic/travels'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get-travels')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event)

    try {
      const jwtToken: string = getToken(event.headers.Authorization)
      const travels = await getAlltravels(jwtToken)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          items: travels
        })
      }
    } catch (e) {
      logger.error('Error: ' + e.message)

      return {
        statusCode: 500,
        body: e.message
      }
    }
  }
)
