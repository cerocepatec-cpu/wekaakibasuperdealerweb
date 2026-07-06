import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PosService } from 'src/app/services/pos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PointOfSales } from 'src/app/interfaces/pos';

@Component({
  selector: 'app-newpos',
  templateUrl: './newpos.component.html',
  styleUrls: ['./newpos.component.scss'],
})
export class NewposComponent implements OnInit {
  @Input() posSent: PointOfSales;
  showcreatingprogress=false;
  showothersinfos=false;
  posform=this.fb.group(
    {
      id:[],
      name:['',Validators.required],	
      description:[],
      rccm:[],	
      national_identification:[],
      num_impot:[],	
      autorisation_fct:[],
      adresse:[],	
      phone:[],
      mail:[],	
      website:[],	
      logo:[],	
      category:[],	   
      vat_rate:[],	
      uuid:[],	
      sync_status:[],
      user_id:[],
      status:[],
      invoicefooter:[],
      selected: [],
      type:[],
      sold:[],
      nb_sales_bonus:[],
      bonus_percentage:[],
      workforce_percent:[],	
      enterprise_id:[]
    });
  constructor(private fb: FormBuilder,public appserv: AppservicesService, private posService: PosService) { }

  ngOnInit() {
    if (this.posSent) {
      this.posform.patchValue({
        id:this.posSent.id,
        name:this.posSent.name,
        description:this.posSent.description,
        rccm:this.posSent.rccm,
        national_identification:this.posSent.national_identification,
        num_impot:this.posSent.num_impot,
        autorisation_fct:this.posSent.autorisation_fct,
        adresse:this.posSent.adresse,
        phone:this.posSent.phone,
        mail:this.posSent.mail,
        website:this.posSent.website,
        logo:this.posSent.logo,
        category:this.posSent.category,
        vat_rate:this.posSent.vat_rate,
        uuid:this.posSent.uuid,
        sync_status:this.posSent.sync_status,
        status:this.posSent.status,
        type:this.posSent.type,
        sold:this.posSent.sold,
        nb_sales_bonus:this.posSent.nb_sales_bonus,
        bonus_percentage:this.posSent.bonus_percentage,
        workforce_percent:this.posSent.workforce_percent,
        invoicefooter:this.posSent.invoicefooter,
        user_id:this.posSent.user_id,
        enterprise_id:this.posSent.enterprise_id
      });
    } else {
      this.posform.patchValue({
        status:'enabled',
        user_id:this.appserv.actualUser.id,
        enterprise_id:this.appserv.actualEse.id,
        type:'bonus'
      });
    }
  }
  reverse(data:PointOfSales){
    this.posSent.name=data.name;
    this.posSent.description=data.description;
    this.posSent.rccm=data.rccm;
    this.posSent.national_identification=data.national_identification;
    this.posSent.num_impot=data.num_impot;
    this.posSent.autorisation_fct=data.autorisation_fct;
    this.posSent.adresse=data.adresse;
    this.posSent.phone=data.phone;
    this.posSent.mail=data.mail;
    this.posSent.website=data.website;
    this.posSent.logo=data.logo;
    this.posSent.category=data.category;
    this.posSent.vat_rate=data.vat_rate;
    this.posSent.uuid=data.uuid;
    this.posSent.sync_status=data.sync_status;
    this.posSent.status=data.status;
    this.posSent.type=data.type;
    this.posSent.sold=data.sold;
    this.posSent.nb_sales_bonus=data.nb_sales_bonus;
    this.posSent.bonus_percentage=data.bonus_percentage;
    this.posSent.workforce_percent=data.workforce_percent;
  }
  addpos(){
    this.showcreatingprogress=true;
    if (this.posSent) {
        this.posService.editpos(this.posform.value).subscribe(
          (data:any)=>{
            this.showcreatingprogress=false;
             this.appserv.presentToast('POS modifié avec succès','success');
              this.reverse(data);
              this.appserv.modalCtrl.dismiss(data,'updated');
          },error=>{
            this.showcreatingprogress=false;
            this.appserv.presentToast("Erreur survenue sur le serveur lors de modification du POS",'danger');
          });
    } else {
      this.posService.newpos(this.posform.value).subscribe(
        (data:any)=>{
          this.showcreatingprogress=false;
          if (data.message==='error') {
            this.appserv.presentToast("Erreur survenue lors d'ajout du POS",'warning');
          } else if(data.message==='success') {
            this.appserv.presentToast('POS ajouté avec succès','success');
            this.appserv.modalCtrl.dismiss(data.pos,'added');
          }else{
            this.appserv.presentToast("Impossible de traiter votre requête",'warning');
          }
        },error=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast("Erreur survenue sur le serveur lors d'ajout du POS",'danger');
        });
    }
  }
  async pickusers(){}
  async pickdeposit(){}
  changestatus(status:string){}

}
