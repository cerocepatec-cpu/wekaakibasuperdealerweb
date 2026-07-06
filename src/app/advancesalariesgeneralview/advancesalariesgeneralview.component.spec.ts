import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdvancesalariesgeneralviewComponent } from './advancesalariesgeneralview.component';

describe('AdvancesalariesgeneralviewComponent', () => {
  let component: AdvancesalariesgeneralviewComponent;
  let fixture: ComponentFixture<AdvancesalariesgeneralviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancesalariesgeneralviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancesalariesgeneralviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
