import { Response } from 'express'

////////////////////////////////////////// HTTP //////////////////////////////////////////
type HTTPResponseParmas<T> = {
  status: 200 | 404 | 500
  result: T
  error?: string | null
}

export const HTTPResponse = <T>(parmas: HTTPResponseParmas<T>, res: Response) => {
  return res.status(parmas.status).json(parmas)
}

export const DefaultHealthCheck = (res: Response) => {
  return HTTPResponse(
    {
      status: 200,
      result: 'success',
      error: null,
    },
    res,
  )
}

export const Default404Page = (res: Response) => {
  return HTTPResponse(
    {
      status: 404,
      result: null,
      error: 'Not Found',
    },
    res,
  )
}
