import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  disabledDates: Date[] = [];
  selectedDateRange: any;
  
  constructor(private datesService: DateService,){}

  ngOnInit(): void {
    this.getDateList()
  }

  getDateList(): void {
    this.datesService.getDates().subscribe(
      (response) => {
        this.disabledDates = this.extractIndividualDates(response);
      },
      (error) => {
        console.error("Error occurred while get data to mysql. Error: ", error);
      }
    )
  }

  private extractIndividualDates(dateRanges: any[]): Date[] {
    const individualDates: Date[] = [];
    dateRanges.forEach((dateRange) => {
      const startDate = new Date(dateRange.date_start);
      const endDate = new Date(dateRange.date_end);

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        individualDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return individualDates;
  }

  saveDates(): void {
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const startDate = this.selectedDateRange[0].toISOString().substring(0, 10);
      const endDate = this.selectedDateRange[1].toISOString().substring(0, 10);

      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
    } else {
      console.error('Please select a valid date range before saving.');
    }
  }

}
