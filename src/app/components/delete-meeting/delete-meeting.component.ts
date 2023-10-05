import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-meeting',
  templateUrl: './delete-meeting.component.html',
  styleUrls: ['./delete-meeting.component.css']
})
export class DeleteMeetingComponent implements OnInit {
  message: string = "Are you sure you want to delete this meeting?"

  constructor() { }

  ngOnInit(): void {
  }

}
