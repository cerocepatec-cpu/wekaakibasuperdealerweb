import { Component, OnInit } from '@angular/core';
import { FundService } from '../services/funds.service';
import { ChartOptions, ChartType } from 'chart.js';
import { FenceService } from '../services/fence.service';

@Component({
  selector: 'app-closure-dashboard-advanced',
  templateUrl: './closure-dashboard-advanced.component.html',
  styleUrls: ['./closure-dashboard-advanced.component.scss'],
})
export class ClosureDashboardAdvancedComponent implements OnInit {
  closures: any[] = [];
  groupedClosures: any = {};
  stats: any[] = [];
  kpi: any = { totalClosures:0, totalReceived:0, soldeTotal:0, soldeStatus:'équilibré' };
  filters: any = { group_by:'week', start_date:null, end_date:null };

  // Chart.js
  barChartLabels: String[] = [];
  barChartData: any[] = [];
  barChartOptions: ChartOptions = { responsive:true, maintainAspectRatio:false };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  constructor(private fenceserv:FenceService,private fundserv:FundService) { }

  ngOnInit() {
    this.loadClosures();
    this.loadStats();
    this.loadKPI();
  }

  loadClosures() {
    this.fenceserv.getClosures(this.filters).subscribe(res=>{
      this.closures = res.data || res;
      this.groupClosures();
    });
  }

  groupClosures() {
    this.groupedClosures = {};
    this.closures.forEach(c => {
      const key = c.closed_at.split('T')[0] + '_' + c.user?.name;
      if(!this.groupedClosures[key]) this.groupedClosures[key] = [];
      this.groupedClosures[key].push(c);
    });
  }

  loadStats() {
    this.fenceserv.getDashboardStats(this.filters).subscribe(res=>{
      this.stats = res;
      this.prepareChart();
    });
  }

  loadKPI() {
    this.fenceserv.getKPI(this.filters).subscribe(res=>this.kpi=res);
  }

  prepareChart() {
    this.barChartLabels = this.stats.map(s=>s.date);
    this.barChartData = [
      { data: this.stats.map(s=>s.total_closures), label:'Total clôturé', backgroundColor:'#4caf50' },
      { data: this.stats.map(s=>s.total_received), label:'Total reçu', backgroundColor:'#2196f3' },
      { data: this.stats.map(s=>s.solde), label:'Solde', backgroundColor:'#f44336' }
    ];
  }

  validate(closure: any) {
    const amount = prompt("Montant reçu:", closure.total_amount);
    if(amount) {
      // this.fundserv.validateClosure(closure.id,+amount).subscribe(()=> this.loadClosures());
    }
  }

  reject(closure: any) {
    const reason = prompt("Raison du rejet:");
    // if(reason) this.fundserv.rejectClosure(closure.id,reason).subscribe(()=> this.loadClosures());
  }

   downloadPDF(closureId: number) {
    this.fenceserv.printClosure(closureId).subscribe({
      next: (res: Blob) => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL); // affiche dans un nouvel onglet
        // Si tu veux forcer le téléchargement :
        // const link = document.createElement('a');
        // link.href = fileURL;
        // link.download = `closure_${closureId}.pdf`;
        // link.click();
      },
      error: (err) => console.error('Erreur lors du téléchargement du PDF', err)
    });
  }

  downloadTicket(closureId: number) {
  this.fenceserv.printClosureTicket(closureId).subscribe({
      next: (res: Blob) => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL); // Affiche le PDF dans un nouvel onglet
        // Pour forcer le téléchargement :
        // const link = document.createElement('a');
        // link.href = fileURL;
        // link.download = `closure_ticket_${closureId}.pdf`;
        // link.click();
      },
      error: (err) => console.error('Erreur lors du téléchargement du PDF', err)
    });
  }
}
