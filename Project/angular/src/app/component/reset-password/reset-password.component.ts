import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registration } from 'src/app/interface/registrationUser.interface';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetForm = this.formBuilder.group({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  allUsers: registration[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getData();
  }

  onSubmit() {
    try {
      if (
        this.resetForm.invalid ||
        this.resetForm.get('confirmPassword')?.value !==
          this.resetForm.get('password')?.value
      ) {
        return;
      } else {
        const forgetEmail = this.sharedService.resetPassword$.getValue();
        const foundUser = this.allUsers.find(
          (user: registration) => user.email === forgetEmail
        );
        if (foundUser) {
          foundUser.password = this.resetForm.value.password as string;
          this.apiService
            .updateUser(foundUser.id, foundUser)
            .subscribe((saveRes: registration) => saveRes);
        }
        this.router.navigate(['/login']);
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
