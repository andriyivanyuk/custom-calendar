import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar-view/calendar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../dialog/dialog.component';
import { AppointmentService } from '../services/appointment.service';
import { CreateViewService } from '../services/create-view.service';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: CalendarComponent },
  { path: 'edit/:id', component: EditAppointmentComponent },
];

@NgModule({
  declarations: [CalendarComponent, EditAppointmentComponent],
  providers: [AppointmentService, CreateViewService],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIconModule,
    DragDropModule,
    DialogComponent,
    RouterModule.forChild(routes),
  ],
})
export class CalendarModule {}
