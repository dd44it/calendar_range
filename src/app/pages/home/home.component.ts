import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  disabledDates = [
    new Date('2020-02-05'),
    new Date('2020-02-09'),
    new Date('2023-07-23'),
    new Date('2023-07-24'),
    new Date('2023-07-25'),
  ];
  startDate: Date = new Date();
  endDate: Date = new Date();

  onStartDateChange() {
    // Handle start date change if needed
  }

  onEndDateChange() {
    // Handle end date change if needed
  }
}
