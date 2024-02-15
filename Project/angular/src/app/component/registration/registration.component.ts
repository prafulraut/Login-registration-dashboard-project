import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { registration } from 'src/app/interface/registrationUser.interface';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registerForm = this.formBuilder.group({
    firstName: new FormControl('', [
      Validators.required,
      this.spaceValidator(),
    ]),
    lastName: new FormControl('', [Validators.required, this.spaceValidator()]),
    email: new FormControl('', [Validators.required, Validators.email]),
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
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getData();
  }

  onSubmit() {
    try {
      if (
        this.registerForm.invalid ||
        this.registerForm.get('confirmPassword')?.value !==
          this.registerForm.get('password')?.value
      ) {
        return;
      } else {
        const email = this.registerForm.value.email as string;
        const foundUser = this.allUsers.find((user: registration) => {
          return user.email === email;
        });
        if (!foundUser) {
          const userData = {
            firstName: this.registerForm.value.firstName as string,
            lastName: this.registerForm.value.lastName as string,
            email: this.registerForm.value.email as string,
            password: this.registerForm.value.password as string,
            status: false,
          };
          this.apiService.postUser(userData).subscribe((res: registration) => {
            if (res) {
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.registerForm.get('email')?.setErrors({ emailFound: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  spaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && (control.value as string).trim() !== control.value) {
        return { noLeadingTrailingSpaces: true };
      }
      return null;
    };
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
