import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from 'src/app/component/result-modal/result-modal.component';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy  {
  disabledDates: Date[] = [];
  selectedDateRange: any;
  readonlyInput: string = '';
  @ViewChild('dateRangeForm', { static: true }) dateRangeForm!: NgForm;
  @ViewChild(BsDaterangepickerDirective, { static: true }) datepicker!: BsDaterangepickerDirective;
  private getSubscription?: Subscription;
  private postSubscription?: Subscription;

  constructor(
    private datesService: DateService,
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
    this.getDateList()
  }

  getDateList(): void {
    this.getSubscription = this.datesService.getDates().subscribe(
      (response) => {
        this.disabledDates = this.datesService.extractIndividualDates(response);
        console.log(this.disabledDates)
      },
      (error) => {
        console.error("Error occurred while get data to mysql. Error: ", error);
      }
    )
  }

  saveDates(): void {
    if (!this.selectedDateRange || this.selectedDateRange.length === 0) {
      this.openResultModal("Please choose a date range.");
      return;
    }

    if (this.selectedDateRange && this.selectedDateRange.length === 2) {
      const startDate = new Date(this.selectedDateRange[0]);
      const endDate = new Date(this.selectedDateRange[1]);
      const formattedStartDate = this.datesService.formatDateToStringForDB(startDate);
      const formattedEndDate = this.datesService.formatDateToStringForDB(endDate);
      const obj = { date_start: formattedStartDate, date_end: formattedEndDate };

      this.postSubscription = this.datesService.postDates(obj).subscribe(
        (response) => {
          if(response.body.error){
            this.openResultModal(response.body.error);
            return;
          }
          this.openResultModal(response.body.message);
          const newDates = this.datesService.extractIndividualDates(response.body.result);
          this.datepicker.bsValue = newDates;
          this.disabledDates = newDates;
          this.datepicker.bsConfig = { ...this.datepicker.bsConfig, datesDisabled: this.disabledDates };
          this.dateRangeForm.resetForm();
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

  ngOnDestroy() {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

}
