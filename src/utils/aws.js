import { Storage } from 'aws-amplify'

export const removeFileFromS3 = file => Storage.remove(file)

export const addImageToS3 = file =>
  Storage.put(file.name, file, {
    contentType: file.type // contentType is optional
  })

export const getFileExtension = (fileName, forceLowerCase = true) => {
  let extension = fileName
    .split('.')
    .reverse()
    .slice(0, 1)
    .join('')

  if (forceLowerCase) {
    extension = extension.toLowerCase()
  }

  return extension
}

const getFileNameFromUrl = url => {
  if (!url) return null
  let fileName = decodeURIComponent(url)
    .split('/')
    .filter(x => x)
    .slice(2)
    .join('/')
  return fileName
}

export const getFileFromS3 = async url => {
  const fileName = getFileNameFromUrl(url)
  if (!fileName) return null
  return Storage.get(fileName.original)
}
