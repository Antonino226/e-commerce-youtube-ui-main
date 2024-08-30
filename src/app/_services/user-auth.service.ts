import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private currentUser: any = null;

  constructor() {}

  public setRoles(roles: any[]) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): any[] {
    return JSON.parse(localStorage.getItem('roles')) || [];
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): string {
    return localStorage.getItem('jwtToken');
  }

  public clear() {
    localStorage.clear();
    this.currentUser = null;
  }

  public isLoggedIn(): boolean {
    return !!this.getRoles().length && !!this.getToken();
  }

  public isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.some(role => role.roleName === 'Admin');
  }

  public isUser(): boolean {
    const roles = this.getRoles();
    return roles.some(role => role.roleName === 'User');
  }

  public setUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }

    return this.currentUser;
  }
}
