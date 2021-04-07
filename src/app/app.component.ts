import { Component } from '@angular/core';
import {IMenu} from './shared/types/interfaces';
import {BcAuthService} from './shared/auth.service';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'bc-app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ BcAuthService ]
})
export class AppComponent {
  date = new Date();
  constructor(private authService: BcAuthService ) {  }
}
