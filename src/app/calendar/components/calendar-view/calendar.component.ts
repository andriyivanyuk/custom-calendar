import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../../../dialog/dialog.component';
import { Appointment } from '../../../interfaces/appointment';
import { AppointmentService } from '../../../services/appointment.service';
import { combineLatest, Observable, take } from 'rxjs';
import { CreateViewService } from '../../../services/create-view.service';
import { Day } from '../../../interfaces/day';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false,
})
export class CalendarComponent implements OnInit {
  appointments$!: Observable<Appointment[]>;
  weeks$!: Observable<Date[][]>;
  viewDate$!: Observable<Date>;
  weekDays$!: Observable<Day[]>;

  selectedDate$!: Observable<Date>;
  selectedStartTime$!: Observable<string>;

  constructor(
    public dialog: MatDialog,
    public appointmentService: AppointmentService,
    private createViewService: CreateViewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.appointments$ = this.appointmentService.appointments$;

    this.weekDays$ = this.createViewService.weekDays$;
    this.weeks$ = this.createViewService.weeks$;
    this.viewDate$ = this.createViewService.viewDate$;
    this.selectedDate$ = this.createViewService.selectedDate$;
    this.selectedStartTime$ = this.createViewService.selectedStartTime$;
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

  public isToday(date: Date): Observable<boolean> {
    return this.createViewService.isToday(date);
  }

  public isSameDate(date1: Date, date2: Date): Observable<boolean> {
    return this.createViewService.isSameDate(date1, date2);
  }

  public selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.createViewService.setSelectedDate(date);
    } else {
      this.createViewService.setSelectedDate(new Date());
    }
    if (startTime) {
      this.createViewService.setSelectedStartTime(startTime);
    }
    this.openDialog();
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

  public isCurrentMonth(date: Date): Observable<boolean> {
    return this.createViewService.isCurrentMonth(date);
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

  public openDialog(): void {
    combineLatest([this.selectedDate$, this.selectedStartTime$])
      .pipe(take(1))
      .subscribe(([selectedDate, selectedStartTime]) => {
        if (!selectedDate) return;

        const hour = new Date().getHours();
        const minutes = new Date().getMinutes();
        const h = hour < 10 ? `0${hour}` : hour;
        const m = minutes < 10 ? `0${minutes}` : minutes;

        const dialogRef = this.dialog.open(DialogComponent, {
          width: '500px',
          panelClass: 'dialog-container',
          data: {
            date: selectedDate,
            title: '',
            startTime: selectedStartTime || `${h}:${m}`,
            endTime: selectedStartTime || `${h}:${m}`,
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
      });
  }
}
