import { Component, Input  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-result-modal',
  templateUrl: 'result-modal.component.html',
  styles: [
  ]
})
export class ResultModalComponent {
  @Input() resultMessage: string = '';

  constructor(public bsModalRef: BsModalRef) {}

  closeModal(): void {
    this.bsModalRef.hide();
  }
}
