import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Activity} from "../../../classes/activity";
import {Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";
import {ActivityService} from "../../../services/activity.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-current-activity',
  templateUrl: './current-activity.component.html',
  styleUrls: ['./current-activity.component.css']
})
export class CurrentActivityComponent implements OnInit, OnDestroy {

  @Input('activity') activity: Activity;
  subscription: Subscription;
  attendedActivities: Activity[];
  declinedActivities: Activity[];
  isAttended = false;
  isDeclined = false;

  constructor(private activityService: ActivityService,
              private authService: AuthService) {
    this.isActivityAttended();
    this.isActivityDeclined();
  }

  ngOnInit(): void {

  }


  isActivityAttended() {
    this.subscription = this.activityService.getattendedActivities(this.authService.getToken()).subscribe((data) => {
      let data2 = JSON.stringify(data);
      this.attendedActivities = JSON.parse(data2);
      this.attendedActivities.forEach(a => {
        if (a.id == this.activity.id) {
          this.isAttended = true;
          return;
        }
      });
    });
  }

  isActivityDeclined() {

    this.subscription = this.activityService.getDeclinedActivities(this.authService.getToken()).subscribe((data) => {
      let data2 = JSON.stringify(data);
      this.declinedActivities = JSON.parse(data2);
      this.declinedActivities.forEach(a => {
        if (a.id == this.activity.id) {
          this.isDeclined = true;
        }
      });
    });
  }

  attendActivity() {
    if(this.isDeclined){
      this.subscription = this.activityService.attendDeclinedActivity(this.authService.getToken(), this.activity.id);
    }else {
      this.subscription = this.activityService.attendActivity(this.authService.getToken(), this.activity.id);
    }
    location.reload();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}