import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { Day } from '../interfaces/day';

@Injectable()
export class CreateViewService {
  private dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private viewDateSource = new BehaviorSubject<Date>(new Date());
  private weeksSource = new BehaviorSubject<Date[][]>([]);
  private monthDaysSource = new BehaviorSubject<Date[]>([]);
  private timeSlotsSource = new BehaviorSubject<string[]>([]);
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  private selectedStartTimeSubject = new BehaviorSubject<string>('');

  public viewDate$: Observable<Date> = this.viewDateSource.asObservable();
  public weeks$: Observable<Date[][]> = this.weeksSource.asObservable();
  public monthDays$: Observable<Date[]> = this.monthDaysSource.asObservable();
  public timeSlots$: Observable<string[]> = this.timeSlotsSource.asObservable();

  public currentDate$: Observable<Date> =
    this.currentDateSubject.asObservable();
  public selectedDate$: Observable<Date> =
    this.selectedDateSubject.asObservable();
  public selectedStartTime$: Observable<string> =
    this.selectedStartTimeSubject.asObservable();

  public weekDays$: Observable<Day[]> = this.getWeekDays();

  constructor() {
    this.generateMonthView(this.viewDateSource.value);
    this.generateTimeSlots();
  }

  getWeekDays(): Observable<Day[]> {
    const daysOfWeek = this.dayNames.map((day, index) => ({
      id: index + 1,
      day: day,
    }));
    return of(daysOfWeek);
  }

  public setViewDate(date: Date) {
    this.viewDateSource.next(date);
    this.generateMonthView(date);
  }

  public getViewDate(): Date {
    return this.viewDateSource.value;
  }

  public isCurrentMonth(date: Date): Observable<boolean> {
    return this.currentDate$.pipe(
      map(
        (currentDate) =>
          date.getMonth() === currentDate.getMonth() &&
          date.getFullYear() === currentDate.getFullYear()
      )
    );
  }

  public isToday(date: Date): Observable<boolean> {
    return this.currentDate$.pipe(
      map(
        (today) =>
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      )
    );
  }

  public isSameDate(date1: Date, date2: Date): Observable<boolean> {
    return this.currentDate$.pipe(
      map(
        () =>
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
      )
    );
  }

  public setSelectedDate(date: Date): void {
    this.selectedDateSubject.next(date);
  }

  public setSelectedStartTime(value: string): void {
    this.selectedStartTimeSubject.next(value);
  }

  private generateMonthView(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let weeks: Date[][] = [];
    let monthDays: Date[] = [];
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      monthDays.push(prevDate);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      monthDays.push(currentDate);
      week.push(currentDate);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    for (let day = 1; monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      monthDays.push(nextDate);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    this.weeksSource.next(weeks);
    this.monthDaysSource.next(monthDays);
  }

  private generateTimeSlots() {
    let timeSlots: string[] = [];
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      timeSlots.push(time);
    }
    this.timeSlotsSource.next(timeSlots);
  }
}
