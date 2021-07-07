import * as uuid from 'uuid'

import { travelItem } from '../models/travelItem'
import { travelAccess } from '../dataLayer/travelAccess'
import { CreatetravelRequest } from '../requests/CreatetravelRequest'
import { UpdatetravelRequest } from '../requests/UpdatetravelRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('travels')

const travellsAccess = new travelAccess()

export const getAlltravels = async (jwtToken: string): Promise<travelItem[]> => {
  const userId = parseUserId(jwtToken)

  return await travellsAccess.getAlltravels(userId)
}

export const createtravel = async (
  createtravelRequest: CreatetravelRequest,
  jwtToken: string
): Promise<travelItem> => {
  logger.info('In createtravel() function')

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await travellsAccess.createtravel({
    travelId: itemId,
    userId,
    name: createtravelRequest.name,
    dueDate: createtravelRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export const updatetravel = async (
  travelId: string,
  updatetravelRequest: UpdatetravelRequest,
  jwtToken: string
): Promise<travelItem> => {
  logger.info('In updatetravel() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await travellsAccess.updatetravel({
    travelId,
    userId,
    name: updatetravelRequest.name,
    dueDate: updatetravelRequest.dueDate,
    done: updatetravelRequest.done,
    createdAt: new Date().toISOString()
  })
}

export const deletetravel = async (
  travelId: string,
  jwtToken: string
): Promise<string> => {
  logger.info('In deletetravel() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await travellsAccess.deletetravel(travelId, userId)
}

export const generateUploadUrl = async (travelId: string): Promise<string> => {
  logger.info('In generateUploadUrl() function')

  return await travellsAccess.generateUploadUrl(travelId)
}
