import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { UpdatetravelRequest } from '../../requests/UpdatetravelRequest'
import { updatetravel } from '../../businessLogic/travels'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-travel')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const travelId: string = event.pathParameters.travelId
      const updatedtravel: UpdatetravelRequest = JSON.parse(event.body)

      const jwtToken: string = getToken(event.headers.Authorization)

      await updatetravel(travelId, updatedtravel, jwtToken)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ''
      }
    } catch (e) {
      logger.error('Error', { error: e.message })

      return {
        statusCode: 500,
        body: e.message
      }
    }
  }
)
