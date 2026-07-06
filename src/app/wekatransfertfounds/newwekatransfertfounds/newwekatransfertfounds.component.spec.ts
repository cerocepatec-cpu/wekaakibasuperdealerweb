import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewwekatransfertfoundsComponent } from './newwekatransfertfounds.component';

describe('NewwekatransfertfoundsComponent', () => {
  let component: NewwekatransfertfoundsComponent;
  let fixture: ComponentFixture<NewwekatransfertfoundsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewwekatransfertfoundsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewwekatransfertfoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
