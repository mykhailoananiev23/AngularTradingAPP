import { Component } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { NTVoyagerApiWtp } from 'src/app/services/api.service';
import { InstrumentSearchComponent } from '../../templates/instrument-search/instrument-search.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { getStockInfo } from 'src/app/reducers/market/market.selector';
import { LstreamerService } from 'src/app/services/lightstreamer/lstreamer.service';
import { ItemUpdate } from 'lightstreamer-client-web/lightstreamer.esm';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css'],
})
export class StockInfoComponent {
  stockInfo: any;
  symbol: any;

  constructor(
    private apiservice: NTVoyagerApiWtp,
    private lss: LocalStorageService,
    private modalService: NgbModal,
    private store: Store,
    private lsService: LstreamerService
  ) {
    this.symbol = this.lss.get('siSymbol');
  }

  onItemUpdate(update: ItemUpdate, obj: any){
    for (var f of obj) {
      var val: string = update.getValue(f);
      var chgp = update.getValue("CHGP");
      if(parseFloat(chgp) < 0){
        this.stockInfo["chgColour"] = 'danger'
      }
      if(parseFloat(chgp) > 0){
        this.stockInfo["chgColour"] = 'success'
      }
      if(parseFloat(chgp) === 0){
        this.stockInfo["chgColour"] = 'warning'
      }
      if((val !== ' ') && (val !== null) && parseFloat(val)){
        this.stockInfo[f] = val;
      }
    }
  }

  ngOnInit() {
    this.store.select(getStockInfo).subscribe(
      (res) => {
        var siPesk = this.lss.get('siPesk');
        var siSymbol = this.lss.get('siSymbol');
        var siName = this.lss.get('siName');
        var stockInfo = instrument(siPesk, siSymbol, siName);
        this.lss.set('stockInfo', stockInfo);
        this.stockInfo = stockInfo;
        this.symbol = siSymbol;
        if(siPesk){
          this.lsService.subscribeStockInfo(this);
        }
      }
    )
    if (this.lss.get('stockInfo') === null || this.stockInfo === undefined) {
      this.stockInfo = instrument('', '', '');
    } else {
      var siPesk = this.lss.get('siPesk');
      var siSymbol = this.lss.get('siSymbol');
      var siName = this.lss.get('siName');
      var stockInfo = instrument(siPesk, siSymbol, siName);
      this.lss.set('stockInfo', stockInfo);
      this.stockInfo = stockInfo;
      this.symbol = siSymbol;
      if(siPesk){
        this.lsService.subscribeStockInfo(this);
      }
    }
  }

  ngOnChanges() {}

  handleStockInfoChanged() {
    var siPesk = this.lss.get('siPesk');
    var siSymbol = this.lss.get('siSymbol');
    var siName = this.lss.get('siName');

    this.stockInfo = instrument(siPesk, siSymbol, siName);
  }

  changeInstrument(pesk: any, symbol: any, name: any) {
    this.lss.set('siPesk', pesk);
    this.lss.set('siSymbol', symbol);
    this.lss.set('siName', name);
    this.stockInfo = instrument(pesk, symbol, name);
    this.lss.set('stockInfo', this.stockInfo);
    // subscribeData()
    // broadcastChartData()
  }

  keypress(event: KeyboardEvent) {
    if (event.keyCode === 13 && this.symbol !== null && this.symbol !== '') {
      this.searchInstrument();
      event.preventDefault();
    }
  }

  subscribeData() {}

  getColor(change: any, isText: any) {
    if (
      change !== null &&
      change !== '' &&
      change !== ' ' &&
      change !== '   '
    ) {
      if (change > 0) {
        if (isText) {
          return 'text-success';
        }
        return 'success';
      } else if (change < 0) {
        if (isText) {
          return 'text-danger';
        }
        return 'danger';
      } else if (isText) {
        return 'text-warning';
      }
      return 'warning';
    } else {
      return '';
    }
  }

  showChange(ltp: any) {
    // if (!angular.isDefined(ltp) || ltp === null || ltp === '' || ltp === ' ' || ltp === '  ' || ltp === 0) {
    if (
      ltp === null ||
      ltp === '' ||
      ltp === ' ' ||
      ltp === '  ' ||
      ltp === 0
    ) {
      return false;
    }
    return true;
  }

  orderDetails = function (s: any, p: any) {
    var res = {
      side: s,
      price: p,
    };
    return res;
  };

  newOrder = function (side: any, price: any) {
    // var od = new orderDetails(side, price);
    // var modalInstance = $modal.open({
    //     templateUrl: 'app/templates/orderEntry.html?',
    //     controller: 'orderentryController',
    //     backdrop: 'static',
    //     resolve: {
    //         instructionDetails: function () {
    //             return od;
    //         }
    //     }
    // });
  };

  searchAction(a: any, s: any) {
    var res = {
      action: a,
      searchString: s
    }
    return res;
  };

  searchInstrument() {
    const modalRef = this.modalService.open(InstrumentSearchComponent, {
      backdrop: 'static',
      modalDialogClass: 'modal-lg',
    });
    modalRef.componentInstance.instrumentCollection = this.searchAction('SI', this.symbol);

    modalRef.result.then(
      (selectedInstrument) => {
        // tradableInstrument = selectedInstrument;
        // this.openOrderEntry(od, tradableInstrument);
      },
      (dismissReason) => {
        console.log('Modal dismissed:', dismissReason);
      }
    );
    this.symbol = ''
  }
}

function instrument(pesk: any, symbol: any, name: any) {
  var res = {
    pesk: pesk,
    symbol: symbol,
    Name: name,

    //Depth
    BS1: '0',
    BP1: '0',
    AP1: '0',
    AS1: '0',
    BS2: '0',
    BP2: '0',
    AP2: '0',
    AS2: '0',
    BS3: '0',
    BP3: '0',
    AP3: '0',
    AS3: '0',

    // Last 5 Trades
    LTP1: '0',
    LTS1: '0',
    LTT1: '0',
    CHG1: '0',
    LTP2: '0',
    LTS2: '0',
    LTT2: '0',
    CHG2: '0',
    LTP3: '0',
    LTS3: '0',
    LTT3: '0',
    CHG3: '0',
    LTP4: '0',
    LTS4: '0',
    LTT4: '0',
    CHG4: '0',
    LTP5: '0',
    LTS5: '0',
    LTT5: '0',
    CHG5: '0',

    CHG: '0',
    CHGP: '0',
    Cls: '0',
    L: '0',
    H: '0',
    TVOL: '0',
    TVAL: '0',
    NTRD: '0',
    ST: '0',

    //chgColour is used for changing the row's css class
    //('warning', 'danger', 'success') - (yellow, red, green)
    chgColour: 'warning',
  };

  return res;
}
