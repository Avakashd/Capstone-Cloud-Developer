import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { travelItem } from '../models/travelItem'

let XAWS
if (process.env.AWS_XRAY_CONTEXT_MISSING) {
  console.log('Serverless Offline detected; skipping AWS X-Ray setup')
  XAWS = AWS
} else {
  XAWS = AWSXRay.captureAWS(AWS)
}
const logger = createLogger('travel-access')

export class travelAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = createS3Client(),
    private readonly travelsTable = process.env.travel_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly indexName = process.env.travel_TABLE_IDX
  ) {
    //
  }

  async getAlltravels(userId: string): Promise<travelItem[]> {
    logger.info('Getting all travel items')

    const result = await this.docClient
      .query({
        TableName: this.travelsTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

    const items = result.Items

    return items as travelItem[]
  }

  async createtravel(travel: travelItem): Promise<travelItem> {
    logger.info(`Creating a travel with ID ${travel.travelId}`)

    const newItem = {
      ...travel,
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${travel.travelId}`
    }

    await this.docClient
      .put({
        TableName: this.travelsTable,
        Item: newItem
      })
      .promise()

    return travel
  }

  async updatetravel(travel: travelItem): Promise<travelItem> {
    logger.info(`Updating a travel with ID ${travel.travelId}`)

    const updateExpression = 'set #n = :name, dueDate = :dueDate, done = :done'

    await this.docClient
      .update({
        TableName: this.travelsTable,
        Key: {
          userId: travel.userId,
          travelId: travel.travelId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: 'travelId = :travelId',
        ExpressionAttributeValues: {
          ':name': travel.name,
          ':dueDate': travel.dueDate,
          ':done': travel.done,
          ':travelId': travel.travelId
        },
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return travel
  }

  async deletetravel(travelId: string, userId: string): Promise<string> {
    logger.info(`Deleting a travel with ID ${travelId}`)

    await this.docClient
      .delete({
        TableName: this.travelsTable,
        Key: {
          userId,
          travelId
        },
        ConditionExpression: 'travelId = :travelId',
        ExpressionAttributeValues: {
          ':travelId': travelId
        }
      })
      .promise()

    return userId
  }

  async generateUploadUrl(travelId: string): Promise<string> {
    logger.info('Generating upload Url')

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: travelId,
      Expires: this.urlExpiration
    })
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  } else {
    return new XAWS.DynamoDB.DocumentClient()
  }
}

const createS3Client = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local S3 instance')

    return new AWS.S3({
      s3ForcePathStyle: true,
      // endpoint: new AWS.Endpoint('http://localhost:8200'),
      endpoint: 'http://localhost:8200',
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    })
  } else {
    return new XAWS.S3({ signatureVersion: 'v4' })
  }
}
