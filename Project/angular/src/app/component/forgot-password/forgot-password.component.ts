import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { registration } from 'src/app/interface/registrationUser.interface';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    enteredOTP: new FormControl('', Validators.required),
  });
  allUsers: registration[] = [];
  generatedOTP: string | null = '';
  otpSent: boolean = false;
  timer: number = 60;
  countdown: undefined | ReturnType<typeof setTimeout>;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public router: Router,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getData();
  }

  sendOTP() {
    const email = this.forgotForm.value.email as string;
    this.sharedService.resetPassword$.next(email);
    const foundUser = this.allUsers.find((user: registration) => {
      return user.email == email;
    });
    if (foundUser) {
      this.startTimer();
      this.otpSent = true;
      this.generatedOTP = this.generateOTP();
      this.snackBar.open('Your OTP is:   ' + this.generatedOTP, 'Dismiss', {
        duration: 7000,
        verticalPosition: 'top',
        panelClass: 'success-snackbar',
      });
    } else {
      this.forgotForm.get('email')?.setErrors({ emailNotFound: true });
    }
  }

  verifyOTP() {
    if (this.forgotForm.value.enteredOTP === this.generatedOTP) {
      this.timer = 10;
      this.snackBar.open('OTP verification successful', 'Dismiss', {
        duration: 7000,
        verticalPosition: 'top',
        panelClass: 'success-snackbar',
      });
      this.router.navigate(['/reset-password']);
    } else if (this.timer < 0) {
      this.generatedOTP = null;
    } else {
      this.snackBar.open('Incorrect OTP. Please try again.', 'Dismiss', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'incorrect-snackbar',
      });
    }
  }

  generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  startTimer() {
    this.countdown = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.generatedOTP = null;
        clearInterval(this.countdown);
      }
    }, 500);
  }

  resendOTP() {
    this.timer = 60;
    this.generatedOTP = this.generateOTP();
    this.snackBar.open('Your new OTP is:    ' + this.generatedOTP, 'Dismiss', {
      duration: 7000,
      verticalPosition: 'top',
      panelClass: 'success-snackbar',
    });
    this.startTimer();
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

  ngOnDestroy() {
    clearInterval(this.countdown);
  }
}
