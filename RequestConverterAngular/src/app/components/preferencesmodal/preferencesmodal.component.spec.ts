import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesmodalComponent } from './preferencesmodal.component';

describe('PreferencesmodalComponent', () => {
  let component: PreferencesmodalComponent;
  let fixture: ComponentFixture<PreferencesmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesmodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
