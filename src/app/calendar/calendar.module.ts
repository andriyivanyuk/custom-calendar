import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogComponent } from '../dialog/dialog.component';
import { EditAppointmentComponent } from './components/edit-appointment/edit-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { AppointmentService } from './services/appointment.service';
import { CreateViewService } from './services/create-view.service';

const routes: Routes = [
  { path: '', component: CalendarViewComponent },
  { path: 'edit/:id', component: EditAppointmentComponent },
];

@NgModule({
  declarations: [CalendarViewComponent, EditAppointmentComponent],
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
