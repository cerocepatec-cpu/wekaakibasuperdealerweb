import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import Chart from 'chart.js/auto';
import { UsersService } from '../services/users.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-wekaakibaadmindashboard',
  templateUrl: './wekaakibaadmindashboard.component.html',
  styleUrls: ['./wekaakibaadmindashboard.component.scss'],
})
export class WekaakibaadmindashboardComponent implements OnInit {
  @ViewChild('defaultsearchinput') defaultsearchinput!:IonInput;
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();
  financedata:any={};
  chart:any;
  ChartData:string[]=[];
  labelChart:string[]=[];
  soldChart: any;
  search:any;
  loaded:boolean=false;
  showprogress=false;
  constructor(public appserv: AppservicesService,private userserv: UsersService) { }

  ngOnInit() {
    this.getfinancialdata();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.defaultsearchinput.setFocus();
    }, 100);
  }
 
  chartbardata(){
    if (this.chart) {
      this.chart.destroy();
    }
    // console.log('periodicdashboard',this.financedata.periodicdashboard);
   
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.labelChart,
        datasets: [
          {
            label:`Detail par date`,
            data: this.ChartData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  public actionSheetButtons = [
    {
      text: 'Annuler',
      role:'cancel'
    },
    { 
      text: 'Imprimer la liste',
      icon:'print-outline',
      handler:()=>{
       
      }
    },
    {
      text: 'Exporter en Excel',
      icon:'download-outline',
      handler:()=>{
        
      }
    },
    {
      text: 'Exporter en PDF',
      icon:'download-outline',
      handler:()=>{
  
      }
    },
  ];
  
  async dashboardperiodfilter(){
   
    const period = await  this.periodicfilter();
    this.from=period.from;
    this.to=period.to;
    this.getfinancialdata();
  }

  async periodicfilter(){
    let dateFrom="";
    let dateTo="";
    const modal = await this.appserv.periodicfilter();
    modal.present(); 
  
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      dateFrom=data.from;
      dateTo=data.to;
    }else{
      dateFrom=this.from;
      dateTo=this.to;
    }
    return {from:dateFrom,to:dateTo};
  }

  getfinancialdata(){
    this.loaded=true;
    this.userserv.financedashboard({id:this.appserv.getactualuser().id,from:this.from,to:this.to}).subscribe(
      response=>{
        this.loaded=false;
        if (response.message==="success" && response.status===200) {
          this.financedata=response.data;
          this.financedata.periodicdashboard.forEach((element:any) => {
            this.labelChart.push(element.date);
            this.ChartData.push(element.periodicbefenefits[0].totalbenefits);
          });

          this.chartbardata();
        }
        // console.log('dashboard data',this.financedata);
      },
      error=>{
        this.loaded=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des données!","danger");
      });
  }

  exportallinexcel(){}
  exportallinpdf(){}
  printpage(){}
  SoldBarChart(){
    if(this.soldChart){
      this.soldChart.destroy();
    }
      this.soldChart = new Chart('soldcanvas', {
        type:'doughnut',
        data:{
        labels: [
          'Sorties',
          'Entrées'
        ],
        datasets: [{
          label:`Montant en CDF`,
          data: [220,5000],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 2
        }]
      },
    options:{
      animation:{
        animateRotate:true
      }
    }});
  } 
}
