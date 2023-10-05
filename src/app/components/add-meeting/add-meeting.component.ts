import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Meeting } from 'src/app/Meeting';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatDatepickerInputEvent,} from "@angular/material/datepicker";
import { MeetingService } from 'src/app/services/meeting.service';
import {DatePipe} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-meeting',
  templateUrl: './add-meeting.component.html',
  styleUrls: ['./add-meeting.component.css'],
  providers: [DatePipe],
})
export class AddMeetingComponent implements OnInit {
  meetingInfo !: FormGroup;
  actionText: string = "Save";
  meetingsList: Meeting[] =[];


  constructor(public http: HttpClient,
              private meetingService: MeetingService,
              public dialogRef: MatDialogRef<AddMeetingComponent>,
              @Inject(MAT_DIALOG_DATA) public meetingData: any,
              private datepipe: DatePipe,
              private toastr: ToastrService) {

      this.meetingInfo = new FormGroup({
        id: new FormControl(''),
        title: new FormControl(''),
        startDate: new FormControl( new Date()),
        durationMinutes: new FormControl ( ['', [Validators.required]]),
        endDate: new FormControl(''),
      });
      if(this.meetingData){
        this.actionText = "Update"
        this.meetingInfo.controls['title'].setValue(this.meetingData.title);
        this.meetingInfo.controls['startDate'].setValue(this.meetingData.startDate);
        this.meetingInfo.controls['durationMinutes'].setValue(this.meetingData.durationMinutes);
      }
    }

  ngOnInit(): void {
    this.getMeetings();

    }

  private getMeetings() {
    this.meetingService.getMeetingList().subscribe((result : any)=>{
      this.meetingsList = result;
      console.log(this.meetingsList);
    });
  }


  saveMeeting() {
    let startDate = this.meetingInfo.get('startDate')?.value;
    this.onSelectedStartDate(startDate);
    this.calculateId();
    this.calulateEndDate();
    let newMeeting: Meeting = this.meetingInfo.value;

    function isMeetingOverlap(newMeeting: Meeting, existingMeetings: Meeting[]): boolean {
      // Convert the new meeting's timestamps to Date objects
      const newMeetingStartDate = new Date(newMeeting.startDate);
      const newMeetingEndDate = new Date(newMeeting.startDate + newMeeting.durationMinutes * 60000);

      // Filter existing meetings that have the same date as the new meeting
      const sameDateMeetings = existingMeetings.filter(existingMeeting => {
        const existingMeetingStartDate = new Date(existingMeeting.startDate);
        return (
          newMeetingStartDate.toDateString() === existingMeetingStartDate.toDateString()
        );
      });

      // Iterate through the filtered existing meetings and check for overlaps
      for (const existingMeeting of sameDateMeetings) {
        // Convert existing meeting's timestamps to Date objects
        const existingMeetingStartDate = new Date(existingMeeting.startDate);
        const existingMeetingEndDate = new Date(existingMeeting.startDate + existingMeeting.durationMinutes * 60000);

        // Check for overlaps
        if (
          (newMeetingStartDate >= existingMeetingStartDate && newMeetingStartDate < existingMeetingEndDate) ||
          (newMeetingEndDate > existingMeetingStartDate && newMeetingEndDate <= existingMeetingEndDate) ||
          (newMeetingStartDate <= existingMeetingStartDate && newMeetingEndDate >= existingMeetingEndDate)
        ) {
          // Overlap found
          return true;
        }
      }

      // No overlap found
      return false;
    }

    if (!this.meetingData) {
      // Check if there is no existing meeting data
      const overlappingMeeting = isMeetingOverlap(newMeeting, this.meetingsList);
    
      if (overlappingMeeting) {
        // Check if the new meeting overlaps with any existing meetings
        // If overlap is found, display an error message and log it
        this.toastr.error("The new meeting overlaps with an existing meeting");
        console.error('The new meeting overlaps with an existing meeting.');
      } else {
        // If there is no overlap, proceed to add the new meeting
        this.meetingService.addMeeting(this.meetingInfo.value).subscribe(
          result => {
            // Subscribe to the meeting service's response
            console.log(result); // Log the result
            this.toastr.success("New meeting added successfully"); // Display a success message
          },
          error => {
            // Handle any errors that may occur during the addition of the new meeting
            console.error('Error', error); // Log the error
          }
        )
      }
    } else {
      // If there is existing meeting data
      this.updateMeetings(); // Call the function to update the existing meeting
    }
  }

  updateMeetings() {
    this.meetingService.updateMeeting(this.meetingData.id, this.meetingInfo.value,)
      .subscribe({
        next:(result) =>{
          console.log('updated the data')
          this.meetingInfo.reset();
          this.dialogRef.close('update');
        }
      })

  }

  private calulateEndDate() {
        const startDateString = this.meetingInfo.get('startDate')?.value;
        const durationMinutes = this.meetingInfo.get('durationMinutes')?.value;
        // Convert the string representation of startDate into a Date object
        const startDate = new Date(startDateString);
        if (!isNaN(startDate.getTime())) { // Check if the conversion was successful
          // Calculate the end date
          const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
          console.log("End date is:    "+ endDate)// 1 minute = 60000 milliseconds
          // Format the endDate as a string
          const formattedEndDate = endDate.getTime(); // This gives you a string representation of the date
          console.log('The formated end date is:   ' + formattedEndDate);
          // Set the endDate in the form control
          this.meetingInfo.get('endDate')?.setValue(formattedEndDate);
          //console.log('The end date is  ' + this.meetingInfo.get('endDate')?.value)
        } else {
          console.error('Invalid start date format');
        }

  }

  onSelectedStartDate(date: Date) {
   
    console.log('The date is: ' + date);
    if (date) {
      const timestamp = date?.getTime(); // Convert Date to timestamp (milliseconds)
      const startDate = this.meetingInfo.get('startDate')?.value;

      if (startDate !== null && startDate !== undefined) {
        this.meetingInfo.get('startDate')?.setValue(timestamp);
        //startDate.setValue(timestamp);
     } else {
       console.error('startDate control is null or undefined');
     }
     console.log(this.meetingInfo.get('startDate')?.value)
    }
 }

onSelectedEndDate(event: MatDatepickerInputEvent<Date>) {
    const dateEnd = event.value;
    this.meetingInfo.get('endDate')?.setValue(dateEnd);
  }
  formatTimestampToDateString(timestamp: number): string {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Use DatePipe to format the Date object into a string
    return <string>this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
  }


  private calculateId() {
    let min = 1;
    let max = 200;
   let id =  Math.floor(Math.random()* (max-min + 1)) + min;
    this.meetingInfo.get('id')?.setValue(id);
  }
}

