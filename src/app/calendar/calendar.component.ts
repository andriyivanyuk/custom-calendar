import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../dialog/dialog.component';
import { Appointment } from '../interfaces/appointment';
import { AppointmentService } from '../services/appointment.service';
import { Observable } from 'rxjs';
import { CreateViewService } from '../services/create-view.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false,
})
export class CalendarComponent implements OnInit {
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate: Date = new Date();
  selectedDate: Date | null = null;

  selectedStartTime: string | undefined;
  timeSlots: string[] = [];

  appointments$!: Observable<Appointment[]>;
  weeks$!: Observable<Date[][]>;
  monthDays$!: Observable<Date[]>;
  timeSlots$!: Observable<string[]>;
  viewDate$!: Observable<Date>;

  constructor(
    public dialog: MatDialog,
    public appointmentService: AppointmentService,
    private createViewService: CreateViewService
  ) {}

  ngOnInit(): void {
    this.weeks$ = this.createViewService.weeks$;
    this.monthDays$ = this.createViewService.monthDays$;
    this.timeSlots$ = this.createViewService.timeSlots$;
    this.viewDate$ = this.createViewService.viewDate$;
    this.appointments$ = this.appointmentService.appointments$;
  }

  public previous() {
    this.createViewService.setViewDate(
      new Date(
        this.createViewService
          .getViewDate()
          .setMonth(this.createViewService.getViewDate().getMonth() - 1)
      )
    );
  }

  public next() {
    this.createViewService.setViewDate(
      new Date(
        this.createViewService
          .getViewDate()
          .setMonth(this.createViewService.getViewDate().getMonth() + 1)
      )
    );
  }

  public isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  public isSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  public isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  public selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.selectedDate = date;
    } else {
      this.selectedDate = new Date();
    }
    this.selectedStartTime = startTime;
    this.openDialog();
  }

  public openDialog(): void {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: {
        date: this.selectedDate,
        title: '',
        startTime: this.selectedStartTime || `${h}:${m}`,
        endTime: this.selectedStartTime || `${h}:${m}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment(
          result.date,
          result.title,
          result.startTime,
          result.endTime
        );
      }
    });
  }

  public drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    const movedAppointment = event.item.data;
    movedAppointment.date = date;
    if (slot) {
      movedAppointment.startTime = slot;
      movedAppointment.endTime = slot;
    }

    this.appointmentService.updateAppointment(movedAppointment);
  }

  public viewToday(): void {
    this.createViewService.setViewDate(new Date());
  }

  public isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.currentDate.getMonth() &&
      date.getFullYear() === this.currentDate.getFullYear()
    );
  }

  public addAppointment(
    date: Date,
    title: string,
    startTime: string,
    endTime: string
  ) {
    this.appointmentService.addAppointment({
      id: 'id-' + Date.now().toString(),
      date,
      title,
      startTime,
      endTime,
    });
  }

  public deleteAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    if (appointment.id) {
      this.appointmentService.deleteAppointment(appointment.id);
    }
  }

  public editAppointment(appointment: Appointment, event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      panelClass: 'dialog-container',
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.remove) {
          this.appointmentService.deleteAppointment(result.id);
        } else {
          this.appointmentService.updateAppointment(result);
        }
      }
    });
  }
}
