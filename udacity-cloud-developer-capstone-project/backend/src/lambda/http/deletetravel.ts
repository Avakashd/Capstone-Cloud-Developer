import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { deletetravel } from '../../businessLogic/travels'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete-travel')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const travelId = event.pathParameters.travelId
    const jwtToken: string = getToken(event.headers.Authorization)

    try {
      await deletetravel(travelId, jwtToken)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ''
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
