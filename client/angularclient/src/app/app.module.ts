import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UserListComponent} from "./administration/userlist/user-list/user-list.component";
import {UserService} from "./services/user.service";
import {HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from './navigation/header/header.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {CreateActivityComponent} from './main/create-activity/create-activity.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivityCardsComponent} from './main/activity-cards/activity-cards.component';
import {CalendarComponent} from './main/calendar/calendar.component';
import {UpcomingActivitiesComponent} from './main/upcoming-activities/upcoming-activities.component';
import {ProfileComponent} from './profile/profile.component';
import {AdministrationComponent} from './administration/administration.component';
import {AuthService} from "./services/auth.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {ErrorpageComponent} from './error/errorpage/errorpage.component';
import {Page404Component} from './error/page404/page404.component';
import {StartredirecterComponent} from './startredirecter/startredirecter.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {CurrentActivitiesComponent} from './main/current-activities/current-activities.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {ExpiredPipe} from './helpers/pipes/expired.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EditModalComponent} from './main/activity-cards/edit-modal/edit-modal.component';
import {CurrentActivityComponent} from './main/current-activities/current-activity/current-activity.component';
import {CurrentmonthPipe} from './helpers/pipes/currentmonth.pipe';
import {CancelledPipe} from './helpers/pipes/cancelled.pipe';


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    HeaderComponent,
    LoginComponent,
    MainComponent,
    CreateActivityComponent,
    ActivityCardsComponent,
    CalendarComponent,
    UpcomingActivitiesComponent,
    ProfileComponent,
    AdministrationComponent,
    ErrorpageComponent,
    Page404Component,
    StartredirecterComponent,
    CurrentActivitiesComponent,
    ExpiredPipe,
    EditModalComponent,
    CurrentActivityComponent,
    CurrentmonthPipe,
    CancelledPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatExpansionModule,
    NgbModule
  ],
  providers: [UserService, AuthService, ExpiredPipe, CurrentmonthPipe, CancelledPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
