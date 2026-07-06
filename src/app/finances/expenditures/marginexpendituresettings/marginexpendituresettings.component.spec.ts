import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarginexpendituresettingsComponent } from './marginexpendituresettings.component';

describe('MarginexpendituresettingsComponent', () => {
  let component: MarginexpendituresettingsComponent;
  let fixture: ComponentFixture<MarginexpendituresettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginexpendituresettingsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarginexpendituresettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
