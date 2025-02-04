import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;
  if (startTime && endTime) {
    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');

    const startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);

    const endDate = new Date();
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);

    if (startDate > endDate) {
      return { timeRangeInvalid: true };
    }
  }
  return null;
};
