import { DetailPage } from './../detail/detail';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  list: any;
  URL = "http://221.224.21.30:2018/api/default/";
  constructor(public navCtrl: NavController,
    private http: HttpClient) {

  }
  ionViewDidLoad() {
    this.loadshiporders();
  }
  godetail(item) {
    this.navCtrl.push(DetailPage, { item })

  }
  loadshiporders() {
    this.http.get(this.URL + "GetShipOrders")
      .map((res: any) => res.data)
      .subscribe(data => {
        console.log(data);
        this.list = data;
      });

  }

}
