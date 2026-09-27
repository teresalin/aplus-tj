/** An error that maps directly to an HTTP status (e.g. 401, 403). */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class UniqueConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
