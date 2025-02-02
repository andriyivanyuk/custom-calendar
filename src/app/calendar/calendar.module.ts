import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
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

const routes: Routes = [{ path: '', component: CalendarComponent }];

@NgModule({
  declarations: [CalendarComponent],
  providers: [AppointmentService, CreateViewService],
  imports: [
    CommonModule,
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
