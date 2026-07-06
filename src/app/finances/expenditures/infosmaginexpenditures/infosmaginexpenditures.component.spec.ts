import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfosmaginexpendituresComponent } from './infosmaginexpenditures.component';

describe('InfosmaginexpendituresComponent', () => {
  let component: InfosmaginexpendituresComponent;
  let fixture: ComponentFixture<InfosmaginexpendituresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosmaginexpendituresComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfosmaginexpendituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
