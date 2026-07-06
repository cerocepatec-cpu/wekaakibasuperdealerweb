import { Component, OnInit, Input } from '@angular/core';
import { PrintclosureComponent } from 'src/app/printclosure/printclosure.component';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FenceService } from 'src/app/services/fence.service';

@Component({
  selector: 'app-infosfence',
  templateUrl: './infosfence.component.html',
  styleUrls: ['./infosfence.component.scss'],
})
export class InfosfenceComponent implements OnInit {
@Input() closure:any={};
showprogress=false;
  constructor(
    private closureService:FenceService,public appserv:AppservicesService
  ) { }

  ngOnInit() {
    const closureId = this.closure.id;
    if (closureId) {
      // this.loadClosure(+closureId);
    }
  }

  getStatusColor(status: string): string {
  switch(status) {
    case 'validated': return '#16a34a'; // vert
    case 'pending': return '#d97706';   // orange
    case 'rejected': return '#dc2626';  // rouge
    default: return '#6b7280';          // gris neutre
  }
}

  loadClosure(id: number) {
    // this.closureService.show(id).subscribe({
    //   next: (res: any) => {
    //     this.closure = res;
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
  }
async printclosure(){
  const modal = await this.appserv.modalCtrl.create({
    component:PrintclosureComponent,
    componentProps:{closure:this.closure},
    cssClass:"modal-border-radius-20",
    mode:"ios",
  });
  modal.present();
}

  downloadClosurePDF(id: number) {
    this.closureService.printClosure(id).subscribe((res: Blob) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = `closure_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
