import {Component, OnDestroy, OnInit} from '@angular/core';
import {Activity} from "../../classes/activity";
import {ActivityService} from "../../services/activity.service";
import {LoginService} from "../../services/login.service";
import {Subscription} from "rxjs";
import {Usersocu} from "../../classes/usersocu";

@Component({
  selector: 'app-activity-cards',
  templateUrl: './activity-cards.component.html',
  styleUrls: ['./activity-cards.component.css']
})
export class ActivityCardsComponent implements OnInit, OnDestroy {

  activities: Activity[];
  subscription: Subscription;
  declinedActivityIDs: number[];
  user: Usersocu;

  constructor(private activityService: ActivityService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.user = this.loginService.getUserValue();
    this.subscription = this.activityService.getActivities(this.loginService.getUserValue().companyorganizationnumber).subscribe(activityarray => {
      this.activities = activityarray;
      // this.sortByCreatedDate();
      this.activities = this.activities.reverse();
      this.getDeclinedActivityIDs();
      this.sortAwayDeclinedActivities();
    });

  }

  public sortByCreatedDate(): void {
    this.activities.sort(function (ac1, ac2) {
      let ac1date = new Date(ac1.createddate).getTime();
      let ac2date = new Date(ac2.createddate).getTime();
      return ac1date > ac2date ? -1 : 1;
    });
  }

  attendEvent(activityid: number) {
    this.activityService.attendActivity(this.loginService.getUserValue().id, activityid);
  }

  declineEvent(id: number) {
    let declinedAs: number[] = JSON.parse(localStorage.getItem('declinedActivityIDs' + this.user.id));
    if (localStorage.getItem('declinedActivityIDs' + this.user.id) == null) {
      declinedAs = [id];
    } else {
      if (!declinedAs.includes(id)) {
        declinedAs.push(id);
      }
    }
    location.reload();
    localStorage.setItem('declinedActivityIDs' + this.user.id, JSON.stringify(declinedAs));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getDeclinedActivityIDs() {
    this.declinedActivityIDs = JSON.parse(localStorage.getItem('declinedActivityIDs' + this.user.id));
    console.log(this.declinedActivityIDs);
  }

  sortAwayDeclinedActivities() {
    if (!(this.declinedActivityIDs == null)) {
      this.declinedActivityIDs.forEach(id => {
        this.activities.forEach(activity => {
          if (activity.id == id) {
            let index = this.activities.indexOf(activity);
            if (index > -1) {
              this.activities.splice(index, 1);
            }
          }
        });
      });
    }
  }
}
