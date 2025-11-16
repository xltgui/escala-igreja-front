import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-admin-layout-component',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.scss'
})
export class AdminLayoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ){

  }

  logout(){
    console.log("LOGOUT");
    this.authService.cleanUpAuth();
    this.router.navigate(['login']);
  }
}

