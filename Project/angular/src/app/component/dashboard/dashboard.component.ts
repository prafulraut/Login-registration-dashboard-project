import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { registration } from 'src/app/interface/registrationUser.interface';
import { ApiService } from 'src/app/service/api.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'status',
  ];
  allUsers: registration[] = [];
  loader: boolean = false;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    try {
      this.loader = true;
      setTimeout(() => {
        this.apiService.getAll().subscribe((res: registration[]) => {
          this.allUsers = res;
        });
        this.loader = false;
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  logOut() {
    this.dashboardData();
    this.sharedService.emitEvent('');
    this.router.navigate(['/login']);
  }

  dashboardData() {
    try {
      const userEmail = this.sharedService.userEmailSource.getValue();
      const foundUser = this.allUsers.find(
        (user: registration) => user.email === userEmail
      );
      if (foundUser) {
        foundUser.status = false;
        this.apiService
          .updateUser(foundUser.id, foundUser)
          .subscribe((saveRes: registration) => saveRes);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
