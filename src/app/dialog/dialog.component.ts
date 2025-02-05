import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { timeFormatValidator } from '../validators/date-validator';
import { timeRangeValidator } from '../validators/range-validator';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
})
export class DialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      date: Date;
      title: string;
      startTime: string;
      endTime: string;
    },
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm() {
    this.form = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        date: [this.data.date, Validators.required],
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.startTime || '', Validators.required],
      },

      {
        validators: Validators.compose([
          timeRangeValidator,
          timeFormatValidator,
        ]),
      }
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (this.form.valid) {
      const data = {
        title: this.form.controls['title'].value,
        date: this.form.controls['date'].value,
        startTime: this.form.controls['startTime'].value,
        endTime: this.form.controls['endTime'].value,
        id: this.data.id,
      };
      this.dialogRef.close(data);
    }
  }

  public onDelete(): void {
    this.dialogRef.close({ remove: true, id: this.data.id });
  }
}
