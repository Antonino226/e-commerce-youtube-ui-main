import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspecialofferComponent } from './add-specialoffer.component';

describe('AddspecialofferComponent', () => {
  let component: AddspecialofferComponent;
  let fixture: ComponentFixture<AddspecialofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddspecialofferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddspecialofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
