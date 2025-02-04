import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeFormatValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (value.date instanceof Date && !isNaN(value.date)) {
    return null;
  } else {
    return { invalidDate: 'Invalid date format' };
  }
};
