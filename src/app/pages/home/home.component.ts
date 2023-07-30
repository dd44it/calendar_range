import { Component, OnInit, ViewChild  } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
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
  @ViewChild(BsDaterangepickerDirective, { static: true }) datepicker!: BsDaterangepickerDirective;

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
    const step = 1;
    const individualDates: Date[] = [];
    dateRanges.forEach((dateRange) => {
      const startDate = new Date(dateRange.date_start);
      const endDate = new Date(dateRange.date_end);

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        individualDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + step);
      }
    });
    return individualDates;
  }

  saveDates(): void {
    console.log(this.selectedDateRange)
    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const startDate = new Date(this.selectedDateRange[0]);
      const endDate = new Date(this.selectedDateRange[1]);
      const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
      const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
      const obj = { date_start: formattedStartDate, date_end: formattedEndDate };

      this.datesService.postDates(obj).subscribe(
        (response) => {
          if(response.body.error){
            this.openResultModal(response.body.error);
            return
          }
          this.openResultModal(response.body.message);
          const newDates = this.extractIndividualDates(response.body.result);
          this.datepicker.bsValue = newDates;
          this.disabledDates = newDates;
          this.datepicker.bsConfig = { ...this.datepicker.bsConfig, datesDisabled: this.disabledDates };
          this.selectedDateRange = [];
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
