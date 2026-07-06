import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Fences } from 'src/app/interfaces/fences';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FenceService } from 'src/app/services/fence.service';

@Component({
  selector: 'app-newfence',
  templateUrl: './newfence.component.html',
  styleUrls: ['./newfence.component.scss'],
})
export class NewfenceComponent implements OnInit {
  @ViewChild('printer_content') printerContent! : ElementRef; 
  showprogress=false;
  datefiltered=new Date();
  shouldfencing=false;
  fence:Fences={};
  fenceAndPrint=false;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  showheader=false;
  defaultmoney=this.appserv.getDefaultmoney();
  
  constructor(public appserv: AppservicesService, private fencserv: FenceService) { }

  ngOnInit() {
    const object={user_id:this.appserv.getactualuser().id};
    this.datefiltered=this.appserv.today;
    this.fence.user_id=this.appserv.getactualuser().id;
    this.fence.enterprise_id=this.appserv.getactualuser().enterprise_id;
    this.gettingdata(object);
  }

  lookup(){
    const object={user_id:this.appserv.getactualuser().id,date_concerned:this.datefiltered};
    this.gettingdata(object);
  }

  gettingdata(object: any){
    this.showprogress=true;
    this.fencserv.dataforfencing(object).subscribe(
      (data: any)=>{
        this.showprogress=false;
        if(data.message=='data_no_conform'){
          this.appserv.presentToast(`Informations introuvables`,'warning');
          this.shouldfencing=false;
        }
        else if(data.message=='already_fenced'){
          this.appserv.presentToast(`Date déjà clôturée`,'warning');
          this.shouldfencing=false;
        }else{
          this.calculatetotalsell(data.fence.sells);
          this.calculateExpenditures(data.fence.expenditures);
          this.calculateCautions(data.fence.cautions);
          this.calculatepayments(data.fence.payments);
          this.calculateEntries(data.fence.entries);
          this.calculatesold();
          this.shouldfencing=true;
        }

      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Une erreur est survenue lors de récupération des données`,'danger');
      }
    )
  }

  calculateEntries(data: any){
    this.fence.totalentries=0;
    data.forEach(element => {
      this.fence.totalentries=this.fence.totalentries+element.amount;
    });
  }
  calculatepayments(data:any){
    this.fence.totaldebts=0;
    data.forEach(element => {
      this.fence.totaldebts=this.fence.totaldebts+element.amount_payed;
    });
  }

  calculatetotalsell(data:any){
    this.fence.totalsell=0;
    this.fence.totalcash=0;
    this.fence.totalcredits=0;
    data.forEach((invoice:any) => {
      if(invoice.type_facture=='cash' || invoice.type_facture=='credit'){
      this.fence.totalsell=this.fence.totalsell+invoice.total;

      if(invoice.type_facture=='cash'){
        this.fence.totalcash +=invoice.total;
      }

      if(invoice.payment_mode=='bonus'){
        this.fence.totalbonus +=invoice.total;
      }

      if(invoice.payment_mode=='caution'){
        this.fence.totalcautions +=invoice.total;
      }

      if(invoice.payment_mode=='point'){
        this.fence.totalpoints +=invoice.total;
      }

      if(invoice.type_facture=='credit'){
        this.fence.totalcredits +=invoice.total;
      }
    }
    });
  }

  calculateExpenditures(data:any){
    this.fence.totalexpenditures=0;
    data.forEach((exp:any) => {
        this.fence.totalexpenditures +=exp.amount;
    });
  }

  calculateCautions(data:any){
    this.fence.depositcautions=0;
    data.forEach((exp:any) => {
        this.fence.depositcautions +=exp.amount;
        this.fence.totalsell +=exp.amount;
    });

  }

  calculatesold(){
    let totalsell=parseFloat(this.fence.totalsell);
    let totalcredits=this.fence.totalcredits;
    let totalexpenditures=this.fence.totalexpenditures;
    let totalentries = this.fence.totalentries;
    let sold=(totalsell+totalentries+this.fence.totaldebts)-(totalcredits+totalexpenditures);
    this.fence.sold=sold;
    this.fence.amount_due=sold;
    this.fence.amount_paid=0;
  }

 async fencing(canprint: boolean){
    this.showprogress=true;
    this.fence.date_concerned= new Date(this.datefiltered).toISOString();
    this.fence.money_id=this.appserv.getDefaultmoney().id;
    this.fencserv.new(this.fence).subscribe(
      (data: any)=>{
        this.showprogress=false;
        if(data.message=='data_no_conform'){
          this.appserv.presentToast(`Informations introuvables`,'warning');
          this.shouldfencing=false;
        }
        else if(data.message=='already_fenced'){
          this.appserv.presentToast(`Journée déjà clôturée`,'warning');
          this.shouldfencing=false;
        }else{
          this.appserv.presentToast(`Journée clôturée avec succès`,'success');
          if (canprint) {
            this.printFencePos(); 
          }
          this.appserv.modalCtrl.dismiss(data.fence,'added');
        }
      },
      error=>{
        this.showprogress=false;
        if (error.text==='already_fenced') {
          this.appserv.presentToast(`Journée déjà clôturée`,'warning');
        }else{
          this.appserv.presentToast(`Une erreur est survenue lors de récupération des données`,'danger');
        }
      }
    );
  }

  async printFencePos(){
      let header = document.getElementById('header');
      let subheader = document.getElementById('subheader');
      subheader.hidden=false;
      header.hidden=false;
      var win = window.open('','_blank','popup=1');
     await win.document.write(`<html><head><title>Fence Printing.</title><style>
      body {
        font-size: x-small;
        font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
      }
      table{
            table-layout: fixed;
            width: 100%;
            border-collapse: collapse;
        }
        .header{
            border-style: none none dashed none;
            border-width: 1px;
        }

        .suheader{
            border-style: none none dashed none;
            border-width: 1px;
        }
        thead{
          font-size:11!important;
        }
        table tbody{
            border-style: none none dashed none;
            border-width: 1px;
            font-size:11!important;
        }

        tfoot{
            font-size:11!important;
        }
        tr.border-bottom-dashed{
          border-style:none none dashed none ;
          border-width: 1px;
      }

      .border-bottom-dashed{
          border-style:none none dashed none ;
          border-width: 1px;
      }
      .text-wrapped{
        word-wrap: break-word;
      }
      .text-right{
        text-align: right;
      }
      .font-size-10{
        font-size: 10px !important;
      }
      .font-bold-600{
        font-weight: 600;
      }
      .text-italic{
        font-style: italic;
      }
      .text-left{
        text-align:left;
      }
  </style></head><body>`);
      win.document.write(this.printerContent.nativeElement.innerHTML);
      win.document.write('</body></html>');
      await win.print();
      header.hidden=true;
      subheader.hidden=true;
      win.close();
  }
}
