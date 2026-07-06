import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppservicesService } from '../services/appservices.service';
import { Articles } from '../interfaces/articles';
import { ArticlesService } from '../services/articles.service';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { CustomersService } from '../services/customers.service';
import { AccountService } from '../services/account.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
@Input() criteria : any;
result :any[]=[];
listcustomers:any;
showprogress=false;
showcheckbox=false;
keyword:any;
showinputfile=true;
articles :Articles[]=[];
unsavedarticles :any[]=[];

  constructor(private userserv:UsersService, public appserv: AppservicesService,private articleserv:ArticlesService, private customerServ: CustomersService, private accountServ: AccountService) { }

  ngOnInit() {}


  async sendingdata(){
    if (this.criteria==='users') {
      this.importusers();  
    }
}

async importusers(){
  this.showprogress=true;
  const loading = await this.appserv.loadctrl.create({
    message:'Importation des membres en cours...',
    spinner:'circles',
    mode:'ios',
    translucent:true
  });
  loading.present();
 
  let members = [];
  this.result.forEach(element => {
    const member :any={};
    member.done_at=this.appserv.defaultdate();
    member.fullname=element.fullname?element.fullname:"";
    member.uuid=element.uuid?element.uuid:"";
    member.phone=element.phone?element.phone:"";
    member.soldecdf=element.soldecdf?element.soldecdf:0;
    member.soldeusd=element.soldeusd?element.soldeusd:0;
    member.adress=element.adress?element.adress:"";
    member.proffession=element.profession?element.profession:"";
    member.sex=element.sex?element.sex:"";
    member.email=element.email?element.email:"";
    member.activity=element.activity?element.activity:"";
    member.type="member";	
    member.manager="";
    member.sensibilisator="";	
    member.description=element.description?element.description:"member";
    members.push(member);
  });
  let object ={members:members,sentby:this.appserv.actualUser.id};
  //sending data
  this.userserv.importmembers({data:object}).subscribe(
    (data:any)=>{
      console.log('data from members import',data);
      this.showprogress=false;
      loading.dismiss();
      this.appserv.presentToast(`Importation terminée avec succès`,'success');
      // this.appserv.modalCtrl.dismiss(data,'added');
    },
    error=>{
      this.showprogress=false;
      loading.dismiss();
      this.appserv.presentToast(`Erreur d'importation sur le serveur`,'danger');
    });
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
      console.log('result imported',this.result);
      this.showprogress=false;
      this.showinputfile=false;
    }
  }

  restelist(){
    this.result=[];
    this.showinputfile=!this.showinputfile;
  }
  removefromlist(article:any){
    this.result=this.result.filter(a=>a!=article);
  }

  removeAccountFromList(account: any){
    this.result=this.result.filter(a=>a!=account);
  }
 
}
