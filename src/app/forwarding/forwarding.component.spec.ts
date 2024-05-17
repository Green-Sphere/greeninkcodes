import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardingComponent } from './forwarding.component';

describe('ForwardingComponent', () => {
  let component: ForwardingComponent;
  let fixture: ComponentFixture<ForwardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
