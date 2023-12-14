import { Component } from '@angular/core';
import { NavbarComponent } from './components/includes/navbar/navbar.component';
import { LightstreamerClient } from 'lightstreamer-client-web/lightstreamer.esm';
import { LstreamerService } from './services/lightstreamer/lstreamer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nutrade';
}
