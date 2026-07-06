import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { AppservicesService } from 'src/app/services/appservices.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import {Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-editenterprise',
  templateUrl: './editenterprise.component.html',
  styleUrls: ['./editenterprise.component.scss'],
})
export class EditenterpriseComponent implements OnInit {
  @Input() enterpriseSent:Enterprise={};
  showsecurityprogress=false;
  showpermissionprogress=false;
  showprogress=false;
  actualEse:Enterprise=this.appserv.getactualEse();
  newenterprise=this.fb.group({
    id:[],
    name: ['',Validators.required],	
    description: [],
    rccm: [],	
    national_identification:[],
    num_impot:[],	
    autorisation_fct:[],
    adresse:[],	
    phone:[],
    mail:[],	
    website:[],	
    logo:[],
    user_id:[],
    facebook:[],	
    linkdin:[],	
    instagram:[],	
    category:[],	   
    vat_rate:[],	
    uuid:[],	
    sync_status:[],
    status:[''],
    rules:[],
    invoicefooter:['']
  });
  constructor(public appserv: AppservicesService, private fb:FormBuilder, private enterpriseServ: EnterpriseService) { }

  ngOnInit() {
    this.sycingdata();
  }

  sycingdata(){
    this.newenterprise.patchValue({
      id:this.enterpriseSent.id,
      name:this.enterpriseSent.name,
      description:this.enterpriseSent.description,
      rccm:this.enterpriseSent.rccm,
      national_identification:this.enterpriseSent.national_identification,
      num_impot:this.enterpriseSent.num_impot,
      autorisation_fct:this.enterpriseSent.autorisation_fct,
      adresse:this.enterpriseSent.adresse,
      phone:this.enterpriseSent.phone,
      mail:this.enterpriseSent.mail,
      website:this.enterpriseSent.website,
      category:this.enterpriseSent.category,
      vat_rate:this.enterpriseSent.vat_rate,
      status:this.enterpriseSent.status,
      user_id:this.enterpriseSent.user_id,
      facebook:this.enterpriseSent.facebook,
      linkdin:this.enterpriseSent.linkdin,
      instagram:this.enterpriseSent.instagram,
      logo:this.enterpriseSent.logo,
      invoicefooter:this.enterpriseSent.invoicefooter
    });
  }  
  
  reverseData(data:Enterprise){
      this.enterpriseSent.id=data.id;
      this.enterpriseSent.name=data.name;
      this.enterpriseSent.description=data.description;
      this.enterpriseSent.rccm=data.rccm;
      this.enterpriseSent.national_identification=data.national_identification;
      this.enterpriseSent.num_impot=data.num_impot;
      this.enterpriseSent.autorisation_fct=data.autorisation_fct;
      this.enterpriseSent.adresse=data.adresse;
      this.enterpriseSent.phone=data.phone;
      this.enterpriseSent.mail=data.mail;
      this.enterpriseSent.website=data.website;
      this.enterpriseSent.category=data.category;
      this.enterpriseSent.vat_rate=data.vat_rate;
      this.enterpriseSent.logo=data.logo;
      this.enterpriseSent.facebook=data.facebook;
      this.enterpriseSent.instagram=data.instagram;
      this.enterpriseSent.linkdin=data.linkdin;
      this.enterpriseSent.invoicefooter=data.invoicefooter;
  }

  validationEditEse(){
    if (this.newenterprise.getRawValue().name.length>0 && this.newenterprise.getRawValue().phone) {
      this.showprogress=true;
      this.enterpriseServ.update(this.newenterprise.value).subscribe(
        (data:any)=>{
          this.showprogress=false;
          if (data.message && data.message==='updated') {
            this.appserv.setactualenterprise(data.enterprise);
            this.appserv.presentToast('Entreprise mise à jour avec succès.','success');
            this.reverseData(data.enterprise);
          }else{
            this.appserv.presentToast('Mise à jour échouée. Veuillez réssayer.','primary');
          }
        },error=>{
          this.showprogress=false;
          console.log('error',error);
          this.appserv.presentToast('Erreur survenue sur le serveur lors de la mise à jour.Veuillez réssayer ou vérifier votre connexion internet','danger');
        }
      )
    }else{
      this.appserv.presentToast('Vous devez au moins compléter le nom et le téléphone de votre entreprise.','warning');
    }
  }

  openeditprofil(){}

  async editavatar(){
    const sheet = await this.appserv.actionsheetctrl.create({
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Supprimer photo',handler:async ()=>{this.deleteimage();}},
        {text:'Prendre une photo',handler:async ()=>{this.takephoto();}},
        {text:'Galerie photo',handler:async ()=> {this.selectImage();}}
      ]
    });
    sheet.present();
   }
  
   async deleteimage(){
    this.enterpriseSent.logo='';
   };
  
   async selectImage(){
    const image = await Camera.getPhoto({
      quality:90,
      allowEditing:true,
      resultType: CameraResultType.Uri,
      source:CameraSource.Photos
    });
  
    if(image){
      this.saveImage(image);
    }
  }
  
  async takephoto(){
    const image = await Camera.getPhoto({
      quality:90,
      allowEditing:true,
      resultType: CameraResultType.Uri,
      source:CameraSource.Camera
    });
  
    if(image){
      this.saveImage(image);
    }
  }
  
  async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64(photo);
    const filesize = await this.gettingsize(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const newimg={size:filesize,filename:fileName,name:fileName,path:photo.webPath,data:base64Data,extension:'jpeg'};
    this.startUpload(newimg);
  }
  
  async gettingsize(photo: Photo){
    const response = await fetch(photo.webPath);
    const blob = await (await response.blob()).size;
    return await blob;
  }
  
  async readAsBase64(photo: Photo){
      if(this.appserv.plateform.is('hybrid')){
        const file:any={};
        // const file = await Filesystem.readFile({
        //   path:photo.path
        // });
        return file.data;
    }
    else{
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  
  async startUpload(file: any){
    const response = await fetch(file.data);
    const blob=await response.blob();
    const formData = new FormData();
    formData.append('file',blob,file.name);
    this.uploadData(formData,file);
  }
  
  async uploadData(formData: FormData,file: any){
  const url =`${this.appserv.urlimgupload}`;
  this.appserv.http.post(url,formData).subscribe(
    (data: any)=>{
      this.newenterprise.patchValue({
        logo:file.name
      });
      if(data.success==true){
        //console.log(data);
        this.validationEditEse();
      }
    },
    error=>{
      this.appserv.presentToast("Impossible de charger l'avatar de votre entreprise",'danger');
    }
  );
  }

}
