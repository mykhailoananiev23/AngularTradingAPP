import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-localstorage';
import { ToastrService } from 'ngx-toastr';
import { NTVoyagerApiWtp } from 'src/app/services/api.service';

@Component({
  selector: 'app-rename-watchlist-name',
  templateUrl: './rename-watchlist-name.component.html',
  styleUrls: ['./rename-watchlist-name.component.css'],
})
export class RenameWatchlistNameComponent {
  watchlist: any;
  renameWatchlistForm: any;

  constructor(
    private activeModal: NgbActiveModal,
    private lss: LocalStorageService,
    private apiService: NTVoyagerApiWtp,
    private notif: ToastrService
  ) {}

  ngOnInit() {
    this.watchlist = this.lss.get('watchlist');
    this.renameWatchlistForm = new FormGroup({
      watchlistName: new FormControl(this.watchlist.name, [
        Validators.required,
        Validators.maxLength(15),
      ]),
    });
  }

  renameExistingWatchlist(){
    var newName: string = this.renameWatchlistForm.get('watchlistName').value
    var watchlists: any = this.lss.get('watchlists');
    watchlists.forEach((ele: any) => {
      if(ele.name == newName){
        this.notif.warning('Same name is already exist!', 'Warning!', { positionClass: 'toast-top-right'})
        return ;
      }
    });
    this.apiService.rename({watchlistId: this.watchlist.id, newName: newName } as any).subscribe(
      (res) => {
        if(res.isSuccess){
          var newWlLists: any = [];
          watchlists.forEach((ele: any) => {
            if(ele.id === this.watchlist.id){
              newWlLists.push({id: ele.id, name: newName})
            } else {
              newWlLists.push(ele)
            }
          });
          this.lss.set('watchlists', newWlLists);
          this.notif.success(res.message, "Success!", { positionClass: 'toast-top-right' })
          this.cancel()
        } else {
          this.notif.error(res.message, "Error!")
        }
      }
    )
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
