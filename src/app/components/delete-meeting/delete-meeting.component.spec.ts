import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMeetingComponent } from './delete-meeting.component';

describe('DeleteMeetingComponent', () => {
  let component: DeleteMeetingComponent;
  let fixture: ComponentFixture<DeleteMeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMeetingComponent]
    });
    fixture = TestBed.createComponent(DeleteMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
