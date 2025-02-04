import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timeFormatValidator } from '../validators/date-validator';
import { timeRangeValidator } from '../validators/range-validator';
import { AppointmentService } from '../services/appointment.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Appointment } from '../interfaces/appointment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss'],
  standalone: false,
})
export class EditAppointmentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  appointment$!: Observable<Appointment | undefined>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.appointment$ = this.route.params.pipe(
      map((params) => params['id']),
      map((id) => this.appointmentService.getAppointmentById(id))
    );
    this.presetForm();
  }

  public presetForm() {
    this.appointment$
      .pipe(takeUntil(this.destroy$))
      .subscribe((appointment) => {
        if (appointment) {
          this.form.patchValue(appointment);
        } else {
          this.router.navigate(['/calendar']);
        }
      });
  }

  public createForm() {
    this.form = this.formBuilder.group(
      {
        id: [''],
        title: ['', Validators.required],
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
      },
      {
        validators: Validators.compose([
          timeRangeValidator,
          timeFormatValidator,
        ]),
      }
    );
  }

  public edit(): void {
    if (this.form.valid) {
      const appointment: Appointment = {
        id: this.form.controls['id'].value,
        date: this.form.controls['date'].value,
        title: this.form.controls['title'].value,
        startTime: this.form.controls['startTime'].value,
        endTime: this.form.controls['endTime'].value,
      };
      this.appointmentService.updateAppointment(appointment);
      this.form.reset();
      this.router.navigate(['/calendar']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
