import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import * as fromAuthSelector from '../../../reducers/auth/auth.selectors';
import * as fromAuth from '../../../reducers/auth/auth.action'
import { LocalStorageService } from 'ngx-localstorage';
import { NTVoyagerApiWtp } from 'src/app/services/api.service';
import { LstreamerService } from 'src/app/services/lightstreamer/lstreamer.service';
import { getFeedStatus } from 'src/app/reducers/feed/feed.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isAuth: any;
  isfeed: any;

  progress: any;
  isLoading: any;

  constructor(
    private router: Router,
    private store: Store,
    private lss: LocalStorageService,
    private apiService: NTVoyagerApiWtp,
    private lsService: LstreamerService
  ) {
    this.isAuth = this.lss.get('isAuth');
    this.isLoading = false;
    this.progress = 40
  }

  async getUsername() {}

  ngOnInit() {
    this.store.select(getFeedStatus).subscribe(
      (res) => {
        this.isfeed = res;
      }
    )
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const currentUrl = event.url;
      var isAuth = this.lss.get('isAuth');
      if(isAuth === true){
        this.isAuth = isAuth;
        if(currentUrl == '/' || currentUrl == '/login' || currentUrl == '/home'){
          this.router.navigateByUrl('/dashboard')
        } else {
          this.router.navigateByUrl(currentUrl)
        }
      } else {
        this.router.navigateByUrl('/login')
      }
    });
  }
  
  logout() {
    try {
      this.isAuth = false;
      this.lss.set('isAuth', false);
    } catch (error) {
      
    }
  }
}
