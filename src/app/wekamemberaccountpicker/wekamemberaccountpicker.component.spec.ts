import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WekamemberaccountpickerComponent } from './wekamemberaccountpicker.component';

describe('WekamemberaccountpickerComponent', () => {
  let component: WekamemberaccountpickerComponent;
  let fixture: ComponentFixture<WekamemberaccountpickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WekamemberaccountpickerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WekamemberaccountpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
