import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WekaakibaadmindashboardComponent } from './wekaakibaadmindashboard.component';

describe('WekaakibaadmindashboardComponent', () => {
  let component: WekaakibaadmindashboardComponent;
  let fixture: ComponentFixture<WekaakibaadmindashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WekaakibaadmindashboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WekaakibaadmindashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
