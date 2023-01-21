import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesettingsComponent } from './codesettings.component';

describe('CodesettingsComponent', () => {
  let component: CodesettingsComponent;
  let fixture: ComponentFixture<CodesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodesettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
