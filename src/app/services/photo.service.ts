import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Camera, CameraResultType,CameraSource,Photo } from '@capacitor/camera';
import { Filesystem} from '@capacitor/filesystem';
import { HttpClient} from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private file:Filesystem, private http:HttpClient, public appserv:AppservicesService, private platform:Platform) { }

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
      if(this.platform.is('hybrid')){
        const file = await Filesystem.readFile({
          path:photo.path
        });
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
  const url =`${this.appserv.imgUrl}`;
  this.http.post(url,formData).subscribe(
    (data: any)=>{
      // this.sendingagent.patchValue({
      //   avatar:file.name
      // });
      // if(data.success==true){
      //   this.agentsent.avatar=file.name;
      //   this.iseditingmodeactivated=true;
      //   this.validatemodification();
      // }
    },
    error=>{
    }
  );
  }
}
