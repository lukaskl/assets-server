import { ValidationError as CVValidationError, validate, ValidatorOptions } from 'class-validator';

export class ValidationError extends Error {
  constructor(
    readonly errors: CVValidationError[],
    message: string = 'Validation Error',
    readonly responseCode: number = 400,
  ) {
    super(message);
  }
}

export const assertIsValid = async (model: {}, validatorOptions?: ValidatorOptions) => {
  const errors = await validate(model, validatorOptions);
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};
