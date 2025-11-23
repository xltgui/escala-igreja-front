import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout-component',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.scss'
})
export class AdminLayoutComponent implements OnInit{
  username?: string;
  isAdmin?: boolean;
  private userSubscription?: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
  ){

  }

  ngOnInit(): void {
    this.loadUserName();
    this.isLoggedUserAdmin();

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.username = user?.username;
      this.isAdmin = user ? user.roles.includes('ADMIN') : false;
    });
  }

  loadUserName(){
    const user = this.authService.getStoredUser();
    this.username = user?.username;
  }

  logout(){
    console.log("LOGOUT");
    this.authService.logout();
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isLoggedUserAdmin() {
    this.isAdmin = this.authService.hasRole('ADMIN')
  }
}

