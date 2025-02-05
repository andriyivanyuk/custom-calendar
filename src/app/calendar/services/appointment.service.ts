import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment } from '../../interfaces/appointment';

@Injectable()
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  public addAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointmentsSubject.getValue();
    this.appointmentsSubject.next([...currentAppointments, appointment]);
  }

  public updateAppointment(updatedAppointment: Appointment): void {
    const currentAppointments = this.appointmentsSubject
      .getValue()
      .map((appt) =>
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      );
    this.appointmentsSubject.next(currentAppointments);
  }

  public deleteAppointment(appointmentId: string): void {
    const filteredAppointments = this.appointmentsSubject
      .getValue()
      .filter((appt) => appt.id !== appointmentId);
    this.appointmentsSubject.next(filteredAppointments);
  }

  public getAppointmentById(appointmentId: string): Appointment | undefined {
    const appointments = this.appointmentsSubject.getValue();
    return appointments.find((appt) => appt.id === appointmentId);
  }
}
