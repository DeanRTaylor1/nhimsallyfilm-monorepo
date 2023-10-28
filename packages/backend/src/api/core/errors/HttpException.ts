import { HttpError } from "routing-controllers";

export class HttpException<T> extends HttpError {
  public status: number;
  public data?: T;

  constructor({
    status,
    message,
    data,
  }: {
    status: number;
    message: string;
    data?: T;
  }) {
    super(status, message);
    this.status = status;
    this.message = message;
    this.data = data;
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
