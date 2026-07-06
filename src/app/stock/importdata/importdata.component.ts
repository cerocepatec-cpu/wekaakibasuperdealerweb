import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppservicesService } from '../../services/appservices.service';
import { Articles } from '../../interfaces/articles';
import { ArticlesService } from '../../services/articles.service';
import { FileSharer } from '@byteowls/capacitor-filesharer';

@Component({
  selector: 'app-importdata',
  templateUrl: './importdata.component.html',
  styleUrls: ['./importdata.component.scss'],
})
export class ImportdataComponent implements OnInit {

result :any[]=[];
showprogress=false;
showcheckbox=false;
keyword:any;
showinputfile=true;
articles :Articles[]=[];
unsavedarticles :any[]=[];

  constructor(public appserv: AppservicesService,private articleserv:ArticlesService) { }

  ngOnInit() {}

  async sendresult(){
    this.appserv.modalCtrl.dismiss(this.result,'added');
  }

  saveoffline(){
    localStorage.setItem('stockhistorydraft',JSON.stringify(this.result));
    this.appserv.modalCtrl.dismiss(this.result,'added');
  }

  fileadding(event:any){
    this.showprogress=true;
    let file =event.target.files[0];
    let filereader = new FileReader();

    filereader.readAsBinaryString(file);
    filereader.onload = (ev)=>{
      var workBook = XLSX.read(filereader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.result =XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      this.showprogress=false;
      this.showinputfile=false;
    }
  }


  async articlemenu(article:any){

  }

  async importingModel(){
    this.appserv.http.get('./assets/csvmodels/stockhistory.csv',{responseType:'blob'}).subscribe(
      res => {
        const reader = new FileReader();
        reader.onloadend = ()=>{
          const result = reader.result as string;
          const base64 = result.split(',')[1];
            FileSharer.share({
              filename:'stock_history_model.csv',
              base64Data:base64,
              contentType:'application/csv'
            });
        }
        reader.readAsDataURL(res);
      });
  }

}
