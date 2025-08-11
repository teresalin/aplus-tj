export class MethodNotAllowedError extends Error {
  constructor(method: string) {
    super(`Method ${method} Not Allowed`);
    this.name = "MethodNotAllowedError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UniqueConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
