import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WekatransfertfoundsPage } from './wekatransfertfounds.page';

describe('WekatransfertfoundsPage', () => {
  let component: WekatransfertfoundsPage;
  let fixture: ComponentFixture<WekatransfertfoundsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WekatransfertfoundsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WekatransfertfoundsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
