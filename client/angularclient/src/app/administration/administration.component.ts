import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Usersocu} from "../classes/usersocu";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";
import {Response} from "../classes/response";

/**
 * The main component used in /administration
 */
@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit, OnDestroy {

  /**
   * Formgroup that makes upp form where the administrator can add new users
   */
  addForm: FormGroup;
  /**
   * Response from backend with eventual error message
   */
  response: Response;
  subscription: Subscription;
  subscrip: Subscription;
  /**
   * Boolean that tells if the user has clicked the "Save"-button
   */
  isSubmitButtonClicked = false;
  /**
   * The currently logged in user
   */
  currentUser: Usersocu;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService) {
    this.getLoggedInUser();
  }

  /**
   * Creates a new form for adding users and resets any error messages
   */
  ngOnInit(): void {
    this.createForm();
    this.response = new Response();
    this.response.message = '';
    this.response.status = '';
  }

  /**
   * Creates a form used for adding a new user
   */
  createForm() {
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-åäö]+$/i)]],
      email: ['', [Validators.required, Validators.email]],
      department: [''],
      employeenumber: ['']
    });
  }

  /**
   * Gets the logged in user by confirming that the token saved in LocalStorage is correct and checking which user it belongs to, if the token is incorrect the user gets logged out automatically
   */
  getLoggedInUser() {
    this.subscrip = this.userService.getUser(this.authService.getToken()).subscribe((data) => {
      let data2= JSON.stringify(data);
      this.currentUser = JSON.parse(data2);
    }, error => {
      this.authService.logout();
    });
  }

  /**
   * Gather the information provided in the addForm and forwards it to a UserService which in turn forwards the information to the backend
   */
  onSubmit() {
    if (this.addForm.invalid) {
      this.isSubmitButtonClicked = true;
      return;
    }
    let usersocu = new Usersocu();
    usersocu.name = this.addForm.get('name').value;
    usersocu.name = this.addForm.get('name').value;
    usersocu.email = this.addForm.get('email').value;
    usersocu.department = this.addForm.get('department').value;
    usersocu.employmentnumber = this.addForm.get('employeenumber').value;
    usersocu.usertype = 0;
    usersocu.companyorganizationnumber = this.currentUser.companyorganizationnumber;
    this.subscription = this.userService.sendUser(usersocu).subscribe((data) => {
      this.response = data;
      if(this.response.status == 'OK'){
        this.mailto(usersocu.email.toString());
        this.addForm.reset();
        this.response.message = '';
        this.response.status = '';
        window.location.reload();
      }
    });
  }

  /**
   * Opens an email to the added user with information about username and password
   * @param emailaddress
   */
  mailto(emailaddress: string) {
    window.location.assign(`mailto:${emailaddress}?subject=Lösenord för SocialCube&body=Hej! Du har precis blivit tillagd som användare på SocialCube av ${this.currentUser.name}.%0D%0ADitt användarnamn: ${emailaddress}%0D%0ADitt lösenord: ${this.response.message}%0D%0ANär du loggat in för första gången bör du byta ditt lösenord. Detta gör du i din profil.`);
  }

  /**
   * Unsubscribes from any subscriptions to prevent memory leak
   */
  ngOnDestroy(): void {
    this.subscrip.unsubscribe();
  }
}
