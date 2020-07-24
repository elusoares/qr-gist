import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenGistPage } from './open-gist.page';

describe('OpenGistPage', () => {
  let component: OpenGistPage;
  let fixture: ComponentFixture<OpenGistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenGistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenGistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
