import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClosureDashboardAdvancedComponent } from './closure-dashboard-advanced.component';

describe('ClosureDashboardAdvancedComponent', () => {
  let component: ClosureDashboardAdvancedComponent;
  let fixture: ComponentFixture<ClosureDashboardAdvancedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosureDashboardAdvancedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClosureDashboardAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
