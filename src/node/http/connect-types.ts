import http from 'node:http'

export class IncomingMessage extends http.IncomingMessage {
  originalUrl?: http.IncomingMessage['url'] | undefined
  protocol?: string
  path?: string
  query?: Record<string, string | string[]>
  text?: string
  body?: any
}

export class ServerResponse extends http.ServerResponse {
}

export type NextFunction = (err?: any) => void

export type SimpleHandleFunction = (
  req: IncomingMessage,
  res: ServerResponse
) => void | Promise<void>
export type NextHandleFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void
export type ErrorHandleFunction = (
  err: any,
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void
export type HandleFunction =
  | ErrorHandleFunction
  | NextHandleFunction
  | SimpleHandleFunction

export type DoneFunction = (err: any, req: IncomingMessage, res: ServerResponse) => void
