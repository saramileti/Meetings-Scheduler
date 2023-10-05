import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Meeting } from 'src/app/Meeting';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddMeetingComponent } from '../add-meeting/add-meeting.component';
import { DeleteMeetingComponent } from '../delete-meeting/delete-meeting.component';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css'],
})
export class MeetingListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'startDate',
    'endDate',
    'action',
  ];
  dataSource!: MatTableDataSource<Meeting>;
  meetings: Meeting[] = [];
  filteredData: Meeting[] = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;

  constructor(
    public http: HttpClient,
    private dialog: MatDialog,
    private meetingService: MeetingService
  ) {}

  ngOnInit() {
    this.filteredData = this.meetings;
    this.getMeetingsList();
   
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddMeetingComponent, {
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getMeetingsList();
      console.log('Modal closed with result:', result);
    });
    this.getMeetingsList();
  }

  private getMeetingsList() {
    this.meetingService.getMeetingList().subscribe((result: any) => {
      this.meetings = result;
      console.log(this.meetings);
      this.dataSource = new MatTableDataSource(this.meetings);
    
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilters() {
    if (this.startDateFilter && this.endDateFilter) {
      this.dataSource.data = this.meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.startDate);
        return (
          meetingDate >= this.startDateFilter! &&
          meetingDate <= this.endDateFilter!
        );
      });
    }
   
  }

  removeMeeting(id: any) {
    this.dialog
      .open(DeleteMeetingComponent)
      .afterClosed()
      .subscribe((confirm: any) => {
        if (confirm) {
          this.meetingService.deleteMeeting(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (m: Meeting) => m.id != id
            );
          });
        }
        this.getMeetingsList();
       
      });
  }

  clearFilters() {
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.getMeetingsList();
    
  }

  editSelectedMeeting(element: any) {
    this.dialog
      .open(AddMeetingComponent, {
        width: '400px',
        data: element,
      })
      .afterClosed()
      .subscribe((value) => {
        this.getMeetingsList();
      });
  }
}
