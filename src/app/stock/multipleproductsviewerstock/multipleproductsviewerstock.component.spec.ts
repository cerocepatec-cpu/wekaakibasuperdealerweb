import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleproductsviewerstockComponent } from './multipleproductsviewerstock.component';

describe('MultipleproductsviewerstockComponent', () => {
  let component: MultipleproductsviewerstockComponent;
  let fixture: ComponentFixture<MultipleproductsviewerstockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleproductsviewerstockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleproductsviewerstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
