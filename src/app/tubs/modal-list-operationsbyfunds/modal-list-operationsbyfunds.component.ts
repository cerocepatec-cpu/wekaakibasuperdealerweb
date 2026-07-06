import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Mouvement } from 'src/app/interfaces/mouvement';
import { Tubs } from 'src/app/interfaces/tubs';
import { IonInput, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-list-operationsbyfunds',
  templateUrl: './modal-list-operationsbyfunds.component.html',
  styleUrls: ['./modal-list-operationsbyfunds.component.scss'],
})
export class ModalListOperationsbyfundsComponent implements OnInit {
@ViewChild('defaultinput') defaultinput:IonInput;
@Input() listmouvements: Mouvement[];
@Input() tubsent: Tubs;
search: any;
allmouvements: Mouvement[]=[];
operationsfilter='all';
constructor(private modal: ModalController) { }

  ngOnInit() {this.allmouvements=this.listmouvements;}
  async closemodal(){
    this.modal.dismiss();
  }

ionViewDidEnter() {
  this.gotodefaultInput();
}

gotodefaultInput(){
  setTimeout(() => {
    this.defaultinput.setFocus();
  }, 100);
}

async filteroperations(criteria: string){
  if(criteria==='all'){
    this.listmouvements=this.allmouvements;
  }else{
    this.listmouvements=this.allmouvements.filter(m=>m.type===criteria);
  }
  this.gotodefaultInput();
}
}
