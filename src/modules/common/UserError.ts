export class UserError extends Error {
  constructor(readonly responseCode: number, message: string) {
    super(message);
  }
}
