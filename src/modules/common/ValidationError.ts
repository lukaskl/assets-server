import { ValidationError as CVValidationError } from 'class-validator';

export class ValidationError extends Error {
  constructor(
    readonly errors: CVValidationError[],
    message: string = 'Validation Error',
    readonly responseCode: number = 400,
  ) {
    super(message);
  }
}
