import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booked-dates',
  templateUrl: 'booked-dates.component.html',
})
export class BookedDatesComponent implements OnInit, OnDestroy {
  listBookedDates: string[] = [];
  private getSubscriptionBookedDates?: Subscription;

  constructor(
    private datesService: DateService,
  ) {}

  ngOnInit(): void {
    this.getBookedDates();
  }

  getBookedDates(): void {
    this.getSubscriptionBookedDates = this.datesService.getDates().subscribe(
      (response) => {
        const datesRange = this.datesService.extractIndividualDates(response);
        this.listBookedDates = datesRange.map(date => this.datesService.formatDateToStringForClient(date));
      },
      (error) => {
        console.error("Error occurred while get data to mysql. Error: ", error);
      }
    )
  }

  ngOnDestroy(): void {
    if (this.getSubscriptionBookedDates) {
      this.getSubscriptionBookedDates.unsubscribe();
    }
  }

}
