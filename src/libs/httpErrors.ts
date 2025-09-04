export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
export const badRequest = (m: string, d?: unknown) => new HttpError(400, m, d);
export const notFound = (m: string) => new HttpError(404, m);
export const conflict = (m: string) => new HttpError(409, m);
export const internal = (m: string, d?: unknown) => new HttpError(500, m, d);
