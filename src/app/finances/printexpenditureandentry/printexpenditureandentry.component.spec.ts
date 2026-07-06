import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrintexpenditureandentryComponent } from './printexpenditureandentry.component';

describe('PrintexpenditureandentryComponent', () => {
  let component: PrintexpenditureandentryComponent;
  let fixture: ComponentFixture<PrintexpenditureandentryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintexpenditureandentryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrintexpenditureandentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
