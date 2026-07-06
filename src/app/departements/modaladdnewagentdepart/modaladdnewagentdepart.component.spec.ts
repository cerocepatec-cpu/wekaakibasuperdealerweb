import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaladdnewagentdepartComponent } from './modaladdnewagentdepart.component';

describe('ModaladdnewagentdepartComponent', () => {
  let component: ModaladdnewagentdepartComponent;
  let fixture: ComponentFixture<ModaladdnewagentdepartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaladdnewagentdepartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaladdnewagentdepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
