import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonInput } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-change-pin',
  templateUrl: '././changepin.component.html'
})
export class ChangePinComponent {
@ViewChild('defaultinput') defaultinput: IonInput;
  isSubmitting = false;

  constructor(
    public appserv:AppservicesService,
    private userserv:UsersService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 300);
  }

  form = this.fb.group({
    current_password: ['', [Validators.required]],
    new_pin: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}$/) // PIN 4 chiffres
      ]
    ],
    confirm_pin: ['', Validators.required]
  });

  get f() {
    return this.form.controls;
  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.f.new_pin.value !== this.f.confirm_pin.value) {
      alert('Les PIN ne correspondent pas');
      return;
    }

    this.isSubmitting = true;
    this.userserv.resetpin(this.form.value).subscribe({
      next: (res: any) => {
        console.log('PIN RESET=>',res);
        // alert('PIN modifié avec succès');
        this.form.reset();
        this.isSubmitting = false;
        this.appserv.modalCtrl.dismiss();
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur');
        this.isSubmitting = false;
      }
    });
  }
}