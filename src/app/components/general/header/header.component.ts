import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  headerVariable = true;

  constructor() {}

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(){
    if (window.pageYOffset >= 100){
      this.headerVariable = false;
    }
    else this.headerVariable = true;
  }
   
    }
    
  





