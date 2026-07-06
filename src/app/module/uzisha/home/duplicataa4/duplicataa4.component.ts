import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'src/app/interfaces/invoices';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-duplicataa4',
  templateUrl: './duplicataa4.component.html',
  styleUrls: ['./duplicataa4.component.scss'],
})
export class Duplicataa4Component implements OnInit {

  @Input() invoice: Invoice;
  @Input() typeInvoice: any;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
    constructor(public appserv: AppservicesService) { }
  
    ngOnInit() {
      if(this.invoice.invoice.note){
        this.invoice.noteArray = this.invoice.invoice.note.split(';');
      }
    }
  
    async printToCart(){
      if (this.typeInvoice==='model1') {
        this.printA4model1();
      } 
      
      if (this.typeInvoice==='model2') {
        this.printA4model2();
      }
    }
  
    async printA4model1(){
      var win = window.open('','_blank','popup=1');
       await win.document.write(`<html><head><title>Invoice_duplication_A4</title>
       <style>
          body {
            font-size: x-small;
            font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
          }
          .proforma-line{
            background-color: #ec8b6d;
            font-weight: bold;
            border: 3px solid #ec8b6d;
            border-radius: 5px;
            width: 45px;
            float: left;
        }
      
        .text-medium{
          color: #a2a09f;
        }
        .background-proforma-model1{
          background: #f4a68f;
        }
        .table-proforma-model1{
          width: 100%!important;
       
         .thead-proforma-model1{
           background: #f4a68f;
           border-radius: 5px;
           height: 20px!important;
         }
       
         .tbody-proforma-model1{
           border-bottom: 2px solid #efb3a1;
           padding: 5px!important;
           line-height: 2.5;
         }
       
         .line-height-2-5{
           line-height: 2.5;
         }
       }
        .margin-5{
          margin: 5px;
        }
        .bg-medium-clean-proforma{
        background:   #f0f0f0; 
        }
        .font-bold-500{
          font-weight: 500;
        }
        .text-center{
          text-align: center;
        }
        .font-bold-600{
          font-weight: 600;
        }
        .font-size-20{
          font-size: 20px!important;
        }
        .font-size-25{
          font-size: 25px!important;
        }
        .font-size-30{
          font-size: 30px!important;
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
          thead{
            font-size:11!important;
          }
          table tbody{
              font-size:11!important;
          }
  
          tfoot{
              font-size:11!important;
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
        .font-size-12{
          font-size: 12px !important;
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
        .footer{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          bottom: 0;
        }
        .ion-padding{
          padding:10px!important;
        }
        .bd-radius-10{
          border-radius: 10px;
        }
  
      .grid{
          display: grid;
          grid-template-rows: auto auto;
          grid-gap: 10px;
        }
        .top-moins-20{
          top:-20px;
        }
    </style></head><body>`);
    var image = document.createElement("img");
    image.setAttribute('src',this.appserv.getactualEse().logo?this.appserv.imgUrl+this.appserv.getactualEse().logo:'');
    image.setAttribute('style','width: 50px;height: 50px;');
    const div = document.createElement('div');
    div.setAttribute('id','imagebloc');
    div.appendChild(image);
    win.document.body.appendChild(div);
        win.document.write(document.getElementById('invoiceOne').innerHTML);
        win.document.write('</body></html>');
        await win.print();
        win.close();
    } 
    
    async printA4model2(){
      var win = window.open('','_blank','popup=1');
       await win.document.write(`<html><head><title>Invoice_duplication_A4</title>
       <style>
          body {
            font-size: x-small;
            font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
          }
          .model2-principal{
            padding: 8px 8px 8px 8px;
            border: 2px double black;
            display: flex;
            flex-direction: column;
            .model2-header{
              display: flex;
              flex-direction: row;
              .header-logo{
                flex: 1 1 200px;
                ion-img{
                  height: 100px; 
                  float:left;
                }
              }
              .header-second-bloc{
                display: flex;
                flex-direction: column;
                flex: 1 1 200px;
                .header-invoice-number{
                  display: flex;
                  flex-direction:row ;
                  .header-invoice-number-title{
                    display: flex;
                    justify-content: right;
                    color: rgb(11, 71, 105);
                    font-weight: 600;
                    margin-top: 8px !important;
                  }
                  .header-invoice-number-uuid{
                    border: 1px solid rgb(11, 71, 105);
                    color: rgb(11, 71, 105);
                    font-weight: 600;
                    padding: 6px;
                    display: flex;
                    justify-content: center;
                    width: fit-content;
                    font-size: large;
                  }
                }
                .header-invoice-number-date{
                 font-weight: 600;
                }
              }
            }
            .model2-subheader{
              display: flex;
              flex-direction: row;
              .subheader-infos-ese{
                flex: 1 1 200px;
                border: 2px solid black;
                .subheader-ese-others{
                  padding: 4px;
                }
              }
              .subheader-infos-customer{
                flex: 1 1 200px;
                border: 2px solid black;
                padding: 4px;
              }
            }
            .model2-body{
              
              table{
                width: 100% !important;
                thead::after {
                  content: "@";
                  display: block;
                  line-height: 10px;
                  text-indent: -99999px;
                }
                .model2-body-table-first-tr{
                  border-bottom:2px solid black ;
                  border-top:2px solid black ;
                  th{
                    border-left:1px solid black ;
                    border-right:1px solid black ;
                    padding: 3px !important;
                  }
                }
                tbody{
                  border: 2px solid black;
                  tr{
                    margin-bottom: 4px !important;
                  }
                  td{
                    border-right:1.5px solid black ;
                    padding-bottom: 5px !important;
                  }
                }
              }
            }
            .model2-footer{
              display: flex;
              flex-direction: row;
              .footer-totals-subtotals{
                float: right;
                table{
                  tr{
                    td{padding:4px !important;}
                  }
                }
              }
            }
          }
          .font-bold-500{
            font-weight: 500;
          }
          
          .font-bold-600{
            font-weight: 600;
          }
          .bg-yellow{
            background-color: yellow;
          }
          .text-italic{
            font-style: italic;
          }
          .text-right{
            text-align: right;
          }
          
          .text-left{
            text-align: left;
          }
          .uppercase{
            text-transform: uppercase;
          }
          
          .full-width{
            width: 100%;
          }
          .font-size-12{
            font-size: 12px;
          }
          
          .border-1px{
            border: 1px solid black;
          }
          
          .font-size-20{
            font-size: 20px !important;
          }
          .font-size-25{
            font-size: 25px !important;
          }
          .font-size-30{
            font-size: 30px !important;
          }
          .font-size-13{
            font-size: 13!important;
          }
          
          .font-size-14{
            font-size: 14!important;
          }
          
          .font-size-15{
            font-size: 15px !important;
          }
          .spacer-row{
            height: 20px;
            background-color: #f0f0f0;
          }
          
          .float-right{
            float: right;
          }
          .bg-medium{
            background-color: var(--ion-color-medium);
          }
        .footer{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          bottom: 0;
        }
        .ion-padding{
          padding:10px!important;
        }
        .bd-radius-10{
          border-radius: 10px;
        }
    </style></head><body>`);
    var image = document.createElement("img");
    image.setAttribute('src',this.appserv.getactualEse().logo?this.appserv.imgUrl+this.appserv.getactualEse().logo:'');
    image.setAttribute('style','width: 50px;height: 50px;');
    const div = document.createElement('div');
    div.setAttribute('id','imagebloc');
    div.appendChild(image);
    win.document.body.appendChild(div);
        win.document.write(document.getElementById('invoiceTwo').innerHTML);
        win.document.write('</body></html>');
        await win.print();
        win.close();
    }

}
