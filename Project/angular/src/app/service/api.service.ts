import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { registration } from '../interface/registrationUser.interface';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = 'http://localhost:3000/registration';

  constructor(private http: HttpClient) {}

  postUser(userRegistration: registration) {
    return this.http.post<registration>(this.apiUrl, userRegistration);
  }

  getAll() {
    return this.http.get<registration[]>(this.apiUrl);
  }

  updateUser(data: any, updatedUserData: registration[] | registration) {
    return this.http.put<registration>(
      `${this.apiUrl}/${data}`,
      updatedUserData
    );
  }
}
