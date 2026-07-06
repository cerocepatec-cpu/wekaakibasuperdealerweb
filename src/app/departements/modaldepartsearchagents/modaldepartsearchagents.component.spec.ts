import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaldepartsearchagentsComponent } from './modaldepartsearchagents.component';

describe('ModaldepartsearchagentsComponent', () => {
  let component: ModaldepartsearchagentsComponent;
  let fixture: ComponentFixture<ModaldepartsearchagentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldepartsearchagentsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaldepartsearchagentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
