import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registration } from 'src/app/interface/registrationUser.interface';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  allUsers: registration[] = [];

  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    public router: Router,
    private apiService: ApiService
  ) {
    this.getData();
  }

  ngOnInit() {
    this.getData();
  }

  onSubmit() {
    try {
      if (this.loginForm.invalid) {
        return;
      } else {
        const email = this.loginForm.value.email as string;
        const password = this.loginForm.value.password as string;
        this.sharedService.emitEvent(email);
        const foundUser = this.allUsers.find((user: registration) => {
          return user.email === email && user.password === password;
        });
        if (foundUser) {
          foundUser.status = true;
          this.apiService
            .updateUser(foundUser.id, foundUser)
            .subscribe((res) => {
              res;
            });
          this.router.navigate(['/dashboard']);
        } else {
          this.loginForm.get('email')?.setErrors({ emailNotFound: true });
          this.loginForm.get('password')?.setErrors({ passwordNotFound: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  getData() {
    try {
      this.apiService.getAll().subscribe((res: registration[]) => {
        this.allUsers = res;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
