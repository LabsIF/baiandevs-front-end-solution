import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import IUser from '../../interfaces/IUser';
import { environment } from '../../../../environments/environment';
import { Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private registerUrl = environment.apiUrl;
  private userSignal: Signal<IUser> = signal({} as IUser);

  constructor(private httpClient: HttpClient) { }

  getUserSignal(): Signal<IUser> {
    return this.userSignal;
  }

  fetchUserData(token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.httpClient.get<IUser>(this.registerUrl+'user/getUserByAccessToken', { headers })
      .subscribe(
        (user: IUser) => this.userSignal.apply(user),
        (error) => console.error(error)
      );
  }

  getUserData(accessToken: string) {
    return this.httpClient.get<IUser>(this.registerUrl+'user/getUserByAccessToken', { observe: 'response', headers: { 'Authorization': 'Bearer ' + accessToken } });
  }

  updateUser(user: IUser, access_token: string) {
    return this.httpClient.put(this.registerUrl+'user/update', user, { observe: 'response', headers: { 'Authorization': 'Bearer ' + access_token } });
  }

  updateProfilePhoto(photo: any, access_token: string) {
    return this.httpClient.put(this.registerUrl+'user/update-photo', photo, { observe: 'response', headers: { 'Authorization': 'Bearer ' + access_token } });
  }

  updatePassword(password: string, access_token: string) {
    return this.httpClient.put(this.registerUrl+'user/update-password', { password }, { observe: 'response', headers: { 'Authorization': 'Bearer ' + access_token } });
  }

  deleteUser(access_token: string) {
    return this.httpClient.delete(this.registerUrl+'user/delete', { observe: 'response', headers: { 'Authorization': 'Bearer ' + access_token } });
  }

  logout(accessToken: string) {
    const tokenObject = { accessToken: accessToken };
    return this.httpClient.post(this.registerUrl+'user/logout',  tokenObject, { observe: 'response', headers: { 'Authorization': 'Bearer ' + accessToken } });
  }

}
