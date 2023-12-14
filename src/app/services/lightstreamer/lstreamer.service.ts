import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItemUpdate, Subscription, ConsoleLogLevel, ConsoleLoggerProvider, LightstreamerClient, StatusWidget } from 'lightstreamer-client-web/lightstreamer.esm';
import { LocalStorageService } from 'ngx-localstorage';
import { ToastrService } from 'ngx-toastr';
import { UpdateFeedStatus } from 'src/app/reducers/feed/feed.action';

declare var $:any;

@Injectable({
  providedIn: 'root',
})
export class LstreamerService {
  client: any;
  wlSubscription: any;
  siSubscription: any;
  icSubscription: any;
  temp: any;
  status: any;

  constructor(
    private lss: LocalStorageService, 
    private notif: ToastrService, 
    private store: Store
  ) {
    var that = this;
    this.client = new LightstreamerClient("http://20.90.66.153:8080","NUTCRACKER");
    this.client.addListener({
      onStatusChange: function(newStatus: any) {
        console.log("Client status:" + newStatus);
        if(newStatus === 'CONNECTED:WS-STREAMING'){
          that.store.dispatch(UpdateFeedStatus({status: 2}));
        } 
        if(newStatus === 'CONNECTING') {
          that.store.dispatch(UpdateFeedStatus({status: 1}))
        }
      }
    });
    this.client.connect()
  }

  getFields(str: string): any {
    var tFlg = this.lss.get('ThreeLineDepth');
    var res: any = [];
    switch (str) {
      case 'watchlist':
        // if (tFlg) {
        //   res = ["L", "H", "BS1", "BP1", "AP1", "AS1", "BS2", "BP2", "AP2", "AS2", "BS3", "BP3", "AP3", "AS3", "LTP", "LTS", "LTT", "CHG", "CHGP", "CLS"];;
        // } else {
          res = ["L", "H", "BS1", "BP1", "AP1", "AS1", "LTP", "LTS", "LTT", "CHG", "CHGP", "CLS"];
        // }
        break;
      case 'indices':
          res = ["LTP", "LTT", "CHG", "CHGP", "CLS"];
        break;
      case 'stockInfo':
        // if (tFlg) {
        //   res = ["L", "H", "BS1", "BP1", "AP1", "AS1", "BS2", "BP2", "AP2", "AS2", "BS3", "BP3", "AP3", "AS3",
        //   "LTP1", "LTS1", "LTT1", "LTP2", "LTS2", "LTT2", "LTP3", "LTS3", "LTT3", "LTP4", "LTS4", "LTT4", "LTP5", "LTS5", "LTT5",
        //   "LTP", "LTS", "LTT", "CHG1", "CHG2", "CHG3", "CHG4", "CHG5", "CHG", "CHGP", "CLS", "TVOL", "TVAL", "NTRD", "ST"];;
        // } else {
          res = ["L", "H", "BS1", "BP1", "AP1", "AS1",
          "LTP1", "LTS1", "LTT1", "LTP2", "LTS2", "LTT2", "LTP3", "LTS3", "LTT3", "LTP4", "LTS4", "LTT4", "LTP5", "LTS5", "LTT5",
          "LTP", "LTS", "LTT", "CHG1", "CHG2", "CHG3", "CHG4", "CHG5", "CHG", "CHGP", "CLS", "TVOL", "TVAL", "NTRD", "ST"];
        // }
        break;
      case 'marketMover':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
      case 'intraChart':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
    }
    return res;
  }

  getItems(str: any): any {
    var tFlg = this.lss.get('ThreeLineDepth');
    var res: any = [];
    switch (str) {
      case 'watchlist':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
      case 'indices':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
      case 'stockInfo':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
      case 'marketMover':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
      case 'intraChart':
        if (tFlg) {
          res = [];
        } else {
          res = [];
        }
        break;
    }
  }
// clear functions
  wlSubscriptionClear(){
    if(this.wlSubscription !== null){
      try {
        this.client.unsubscribe(this.wlSubscription)
        this.wlSubscription = null;
      } catch (error) {
      }
    }
  }

  siSubscriptionClear(){
    if(this.siSubscription !== null){
      try {
        this.client.unsubscribe(this.siSubscription)
        this.siSubscription = null;
      } catch (error) {
      }
    }
  }

  icSubscriptionClear(){
    if(this.icSubscription !== null){
      try {
        this.client.unsubscribe(this.icSubscription)
        this.icSubscription = null;
      } catch (error) {
      }
    }
  }

  indSubscriptionClear(){

  }
// subscriptions
  subscribeWatchlists($obj: any) {
    this.wlSubscriptionClear();
    var items: any = this.lss.get('subWlList');
    var fields = this.getFields('watchlist');
    this.wlSubscription = new Subscription('MERGE', items, fields);
    this.wlSubscription.setDataAdapter('NTMARKETDATA');
    this.wlSubscription.setRequestedSnapshot("yes");
    this.wlSubscription.setRequestedMaxFrequency(1);
    this.client.subscribe(this.wlSubscription);
    this.wlSubscription.addListener({
      onItemUpdate: (update: ItemUpdate) => $obj.onItemUpdate(update, fields)
    });
  }

  subscribeIndices(items: any) {}

  subscribeStockInfo($obj: any) {
    this.siSubscriptionClear();
    var items: any = this.lss.get('siPesk');
    var fields = this.getFields('stockInfo');
    this.siSubscription = new Subscription('MERGE', items, fields);
    this.siSubscription.setDataAdapter('NTMARKETDATA');
    this.siSubscription.setRequestedSnapshot("yes");
    this.siSubscription.setRequestedMaxFrequency(1);
    this.client.subscribe(this.siSubscription);
    this.siSubscription.addListener({
      onItemUpdate: (update: ItemUpdate) => $obj.onItemUpdate(update, fields)
    });
  }

  subscribeIntradayChart($obj: any) {
  }

  subscribeMarketMover() {}

  // getSubscription(items: any, fields: any, datas: any) {
  //   var sub = new Subscription('MERGE', items, fields);
  //   sub.setDataAdapter('NTMARKETDATA');
  //   sub.setRequestedSnapshot('yes');
  //   sub.setRequestedMaxFrequency(1);
  //   sub.addListener({
  //     onItemUpdate: (update) => {
  //       console.log(update)
  //       this.getStockItem(update, fields, datas)
  //     },
  //   });
  //   this.client.subscribe(sub);
  //   this.client.connect();
  // }

  // getStockItem(update: ItemUpdate, field: any, instrument: any){
  //   var itemPos = update.getItemPos();
  //   function getStockItem(update: ItemUpdate, instrument: any){
  //     for (var f of field) {
  //       var val: string = update.getValue(f);
  //       if((val !== ' ') && (val !== null) && parseFloat(val)){
  //         if(f == 'B1'){
  //           console.log(val)
  //         }
  //         instrument[f] = val;
  //       }
  //     }
  //   }
  //   getStockItem(update, instrument[itemPos-1]);
  // }

  
}


// onItemUpdate(update: ItemUpdate, obj: any){
//   console.log(update)
//   var itemPos = update.getItemPos();
//   function getStockItem(update: ItemUpdate, instrument: any){
//     for (var f of obj.field) {
//       var val: string = update.getValue(f);
//       if((val !== ' ') && (val !== null) && parseFloat(val)){
//         if(f == 'B1'){
//           console.log(val)
//         }
//         instrument[f] = val;
//       }
//     }
//   }
//   getStockItem(update, obj.instruments[itemPos-1]);
// }