import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RerouteCreateDialogComponent } from './reroute-create-dialog.component';

describe('RerouteCreateDialogComponent', () => {
  let component: RerouteCreateDialogComponent;
  let fixture: ComponentFixture<RerouteCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RerouteCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RerouteCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
