import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalListOperationsbyfundsComponent } from './modal-list-operationsbyfunds.component';

describe('ModalListOperationsbyfundsComponent', () => {
  let component: ModalListOperationsbyfundsComponent;
  let fixture: ComponentFixture<ModalListOperationsbyfundsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListOperationsbyfundsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalListOperationsbyfundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
