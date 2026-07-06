import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewmarginexpenditureComponent } from './newmarginexpenditure.component';

describe('NewmarginexpenditureComponent', () => {
  let component: NewmarginexpenditureComponent;
  let fixture: ComponentFixture<NewmarginexpenditureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmarginexpenditureComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewmarginexpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
