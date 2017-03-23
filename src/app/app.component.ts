import { Component } from '@angular/core';
import { VERSION } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  version:string;
  showHeading = true;
  heroes = ['Magneta', 'Bombasto', 'Magma', 'Tornado', 'Toto'];
  constructor(){    
    this.version = VERSION.full;
    console.log(VERSION);
  }

  toggleHeading() {
    debugger;
    this.showHeading = !this.showHeading;
  }
}
