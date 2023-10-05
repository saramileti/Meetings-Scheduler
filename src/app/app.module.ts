import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeetingListComponent } from './components/meeting-list/meeting-list.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { AddMeetingComponent } from './components/add-meeting/add-meeting.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMatDatetimePickerModule,NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {TranslocoModule} from "@ngneat/transloco";
import {ToastrModule} from "ngx-toastr";
import { DeleteMeetingComponent } from './components/delete-meeting/delete-meeting.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetingListComponent,
    AddMeetingComponent,
    DeleteMeetingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    NgxMatDatetimePickerModule,
    TranslocoModule,
    NgxMatNativeDateModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
