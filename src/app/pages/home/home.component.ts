import { Component, OnInit, ViewChild  } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from 'src/app/component/result-modal/result-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  disabledDates: Date[] = [];
  selectedDateRange: any;
  readonlyInput: string = '';
  
  constructor(
    private datesService: DateService,
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
    this.getDateList()
  }

  getDateList(): void {
    this.datesService.getDates().subscribe(
      (response) => {
        this.disabledDates = this.extractIndividualDates(response);
        console.log(this.disabledDates)
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
      const obj = { date_start: startDate, date_end: endDate };
      this.datesService.postDates(obj).subscribe(
        (response) => {
          if(response.body.error){
            this.openResultModal(response.body.error);
            return
          }
          this.openResultModal(response.body.message);
        },
        (error) => {
          console.error("Error occurred while get data to mysql. Error: ", error);
          this.openResultModal(error);
        }
      )
    } else {
      console.error('Please select a valid date range before saving.');
    }
  }

  openResultModal(resultMessage: string): void {
    const initialState = {
      resultMessage: resultMessage
    };
    this.modalService.show(ResultModalComponent, { initialState });
  }

}
