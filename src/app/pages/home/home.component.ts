import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  disabledDates: Date[] = []
  
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

}
