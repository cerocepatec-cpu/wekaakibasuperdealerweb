import { Component, OnInit } from '@angular/core';
import { MobileVersionService } from '../services/mobile-version.service';
import { HttpEventType } from '@angular/common/http'

@Component({
  selector: 'app-mobile-version-upload',
  templateUrl: './mobile-version-upload.component.html',
  styleUrls: ['./mobile-version-upload.component.scss'],
})
export class MobileVersionUploadComponent {
  version = ""
  version_code:number|null = null

  apkFile!:File

  progress = 0
  uploading=false

  versions:any[]=[]

  constructor(
    private service:MobileVersionService
  ){}

  ngOnInit(){

    this.loadVersions()

  }

  loadVersions(){

    this.service.listVersions()
    .subscribe(res=>{
      this.versions = res.data
    })

  }

  onFileSelected(event:any){

    this.apkFile = event.target.files[0]

  }

  upload(){

    if(!this.apkFile) return

    const form = new FormData();

    form.append("apk",this.apkFile);
    form.append("version",this.version);
    form.append("version_code",String(this.version_code));

    this.uploading=true
console.log("before uploading version",form);
    this.service.uploadVersion(form)
    .subscribe(event=>{

      if(event.type === HttpEventType.UploadProgress){

        this.progress = Math.round(
          (event.loaded / (event.total || 1))*100
        )

      }

      if(event.type === HttpEventType.Response){

        this.uploading=false

        this.version=""
        this.version_code=null

        this.loadVersions()

      }

    })

  }

  publish(id:number){

    if(!confirm("Publier cette version ?")) return

    this.service.publishVersion(id)
    .subscribe(()=>{
      this.loadVersions()
    })

  }

}
