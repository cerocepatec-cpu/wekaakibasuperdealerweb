import { Injectable } from '@angular/core';
import { OwnerService } from './owner.service';
import { EnterpriseService } from './enterprise.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private ownerserv: OwnerService, private enterpriseserv: EnterpriseService) { }
  
}
