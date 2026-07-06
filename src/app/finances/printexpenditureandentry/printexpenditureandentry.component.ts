import { Component, OnInit, Input } from '@angular/core';
import { Expenditures } from 'src/app/interfaces/expenditures';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-printexpenditureandentry',
  templateUrl: './printexpenditureandentry.component.html',
  styleUrls: ['./printexpenditureandentry.component.scss'],
})
export class PrintexpenditureandentryComponent implements OnInit {

  @Input() expendituresent : Expenditures;
  @Input() typesent : any;
  @Input() duplicated: boolean;
  posprintoptions=this.appserv.getDefaultPrinterConfig();
  showprogress=false;
  constructor(public appserv: AppservicesService) { }
  
    ngOnInit() {
      console.log(this.expendituresent);
    }
  
    ionViewDidEnter(){
      // this.printOperation();
    }

    printOperation(){

      var win = window.open('','_blank','popup=1');
      win.document.write(`<html><head><title>OperationPrint</title><style>
       body {
         font-size: x-small;
         font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
       }
       table{
             table-layout: fixed;
             width: 100%;
             border-collapse: collapse;
             thead th:nth-child(1){
                     width: 50%;
                     text-align: left;
             }
             thead th:nth-child(2){
                     width: 10%;
                     text-align: right;
             }
             thead th:nth-child(3){
                     width: 15%;
                     text-align: right;
             }
             thead th:nth-child(4){
                     width: 25%;
                     text-align: right;
             }
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
       .font-size-20{
        font-size:20px!important;
       }
      .font-size-16{
        font-size:16px!important;
       }
        .font-size-15{
        font-size:15px!important;
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
       .bd-square-3px{
        --tw-text-opacity: 0.1!important;
        border: 3px solid black !important;
      }
      
      .bd-square-dark-1px{
        --tw-text-opacity: 0.1!important;
        border: 1px solid black !important;
      }
      .bd-square-dark-2px{
        --tw-text-opacity: 0.1!important;
        border: 2px solid black !important;
      }
      
      .border-right-2px{
        border-right: 2px solid rgb(86 84 84/var(--tw-text-opacity))!important;
      }
      
      .border-right-dark-2px{
        border-right: 2px solid black!important;
      }
      
      .border-right-dark-1px{
        border-right: 1px solid rgb(21, 21, 21)!important;
      }
      
      .bg-yellow {
        background: rgba(245, 181, 6, 0.849);
      }
      .ion-padding{
        padding:15px!important;
      }
      .ion-padding-top{
        padding-top:15px!important;
      }
      .ion-float-right{
        float:right!important;
      }
   </style></head><body>`);
  //  var image = document.createElement("img");
  //  image.setAttribute('src',this.appserv.getactualEse().logo?this.appserv.imgUrl+this.appserv.getactualEse().logo:'');
  //  image.setAttribute('style','width: 50px;height: 50px;');
  //  const div = document.getElementById('imgbloc');
  // //  div.setAttribute('id','imagebloc');
  //  div.insertBefore(image,div.firstChild);
  //  win.document.body.appendChild(div);
       win.document.write(document.getElementById('printableBlock').innerHTML);
       win.document.write('</body></html>');
       win.print();
       win.close();
       this.appserv.modalCtrl.dismiss();
    }
}
