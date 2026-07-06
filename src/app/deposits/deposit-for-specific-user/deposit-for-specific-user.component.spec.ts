import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepositForSpecificUserComponent } from './deposit-for-specific-user.component';

describe('DepositForSpecificUserComponent', () => {
  let component: DepositForSpecificUserComponent;
  let fixture: ComponentFixture<DepositForSpecificUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositForSpecificUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositForSpecificUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
