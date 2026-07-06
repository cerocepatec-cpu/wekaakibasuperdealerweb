import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrintgeneralsituationComponent } from './printgeneralsituation.component';

describe('PrintgeneralsituationComponent', () => {
  let component: PrintgeneralsituationComponent;
  let fixture: ComponentFixture<PrintgeneralsituationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintgeneralsituationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrintgeneralsituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
