import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
