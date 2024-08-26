import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  @HostListener('window:scroll', ['$event'])
  public handleScroll(event: Event) {
    const scrollPosition = window.scrollY + window.innerHeight;
    
    // Define the positions of the sections
    const categoryPos = document.getElementById('category').offsetTop;
    const productsPos = document.getElementById('products').offsetTop;
    const locationPos = document.getElementById('location').offsetTop;
    
    // Update the URL fragment based on scroll position
    if (scrollPosition >= locationPos) {
      this.router.navigate([], { fragment: 'location' });
    } else if (scrollPosition >= productsPos) {
      this.router.navigate([], { fragment: 'products' });
    } else if (scrollPosition >= categoryPos) {
      this.router.navigate([], { fragment: 'category' });
    }
  }
}
