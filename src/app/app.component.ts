import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jwt-youtube-ui';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
