import { apiEndpoint, subDirectory, devapiEndpoint } from '../config'
import { travel } from '../types/travel'
import { CreatetravelRequest } from '../types/CreatetravelRequest'
import Axios from 'axios'
import { UpdatetravelRequest } from '../types/UpdatetravelRequest'

console.log('is offline:', process.env.REACT_APP_IS_OFFLINE)

let Endpoint: string
let JWTtoken: string

if (
  process.env.REACT_APP_IS_OFFLINE == 'false' ||
  process.env.REACT_APP_IS_OFFLINE == undefined
) {
  Endpoint = apiEndpoint
} else {
  console.log('offline')
  Endpoint = devapiEndpoint
}
console.log(Endpoint)

export async function gettravels(idToken: string): Promise<travel[]> {
  console.log('Fetching travels')
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  console.log('My token id:', JWTtoken)
  console.log('get link: ', `${Endpoint}/${subDirectory}`)
  const response = await Axios.get(`${Endpoint}/${subDirectory}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWTtoken}`
    }
  })
  console.log('travels:', response.data)
  console.log('token', JWTtoken)
  return response.data.items
}

export async function createtravel(
  idToken: string,
  newtravel: CreatetravelRequest
): Promise<travel> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  const response = await Axios.post(
    `${Endpoint}/${subDirectory}`,
    JSON.stringify(newtravel),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
  console.log(response.data)

  return response.data.newItem
}

export async function patchtravel(
  idToken: string,
  travelId: string,
  updatedtravel: UpdatetravelRequest
): Promise<void> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  await Axios.patch(
    `${Endpoint}/${subDirectory}/${travelId}`,
    JSON.stringify(updatedtravel),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
}

export async function deletetravel(
  idToken: string,
  travelId: string
): Promise<void> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  console.log('Deletion endpoint', `${Endpoint}/${subDirectory}/${travelId}`)
  await Axios.delete(`${Endpoint}/${subDirectory}/${travelId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JWTtoken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  travelId: string
): Promise<string> {
  if (
    process.env.REACT_APP_IS_OFFLINE == 'false' ||
    process.env.REACT_APP_IS_OFFLINE == undefined
  ) {
    JWTtoken = idToken
  } else {
    console.log('Offline')
    JWTtoken = '123'
  }
  const response = await Axios.post(
    `${Endpoint}/${subDirectory}/${travelId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWTtoken}`
      }
    }
  )
  console.log(response.data)

  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export const checkAttachmentURL = async (
  attachmentUrl: string
): Promise<boolean> => {
  await Axios.get(attachmentUrl)

  return true
}
