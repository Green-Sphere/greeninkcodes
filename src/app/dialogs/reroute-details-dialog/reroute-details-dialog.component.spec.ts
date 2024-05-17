import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RerouteDetailsDialogComponent } from './reroute-details-dialog.component';

describe('RerouteDetailsDialogComponent', () => {
  let component: RerouteDetailsDialogComponent;
  let fixture: ComponentFixture<RerouteDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RerouteDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RerouteDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
