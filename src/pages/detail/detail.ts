import { FeeformPage } from './../feeform/feeform';
import { AuthServiceProvider, User } from './../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, ModalController } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class ShipOrder {
  BreakCartons: number;
  BusinessType: number;
  CarType: string;
  CarrierId: number;
  Cartons: number;
  ClosedDate: Date;
  CompanyId: number;
  ContractNumber: string;
  DeliveryDate: Date;
  DepartDate: Date;
  Driver: string;
  DriverPhone: string;
  ExternalNo: string;
  Id: number;
  InputUser: string;
  ItemCount: number;
  LoadWeight: number;
  Location1: string;
  Location2: string;
  OrderDate: Date
  Packages: number;
  Pallets: number;
  PassLocation: string;
  PiceType: number;
  PlanDeliveryDate: Date;
  PlanDepartDate: Date;
  Remark: string;
  Requirements: string;
  ShipOrderNo: string;
  Status: number;
  TimePeriod: number;
  TotalMonetaryAmount: number;
  VehicleId: number;
  Volume: number;
  Weight: number;

}

declare var BMap;
@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  @ViewChild('map') mapElement: ElementRef;
  shiporder: ShipOrder;
  map: any;
  URL: string = "http://221.224.21.30:2018/api/default/";
  user: User
  currentpoint: any;
  constructor(
    public modalCtrl: ModalController,
    private auth: AuthServiceProvider,
    private http: HttpClient,
    private toastCtrl: ToastController,
    public actionsheetCtrl: ActionSheetController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.shiporder = new ShipOrder();
    this.user = this.auth.getUserInfo();
  }

  ionViewDidLoad() {
    this.loaddata();

  }
  convertoShipOrder(item) {
    let shiporder = new ShipOrder();
    shiporder.Id = item.Id;
    shiporder.VehicleId = item.VehicleId;
    shiporder.CarrierId = item.CarrierId;
    shiporder.CompanyId = item.CompanyId;
    shiporder.ShipOrderNo = item.ShipOrderNo;
    shiporder.Status = item.Status;
    shiporder.Location1 = item.Location1;
    shiporder.Location2 = item.Location2;
    shiporder.PassLocation = item.PassLocation;
    shiporder.OrderDate = item.OrderDate;
    shiporder.ItemCount = item.ItemCount;
    shiporder.LoadWeight = item.LoadWeight;
    shiporder.Packages = item.Packages;
    shiporder.Pallets = item.Pallets;
    shiporder.Cartons = item.Cartons;
    shiporder.BreakCartons = item.BreakCartons;
    shiporder.TimePeriod = item.TimePeriod;
    shiporder.Volume = item.Volume;
    shiporder.Weight = item.Weight;
    shiporder.PlanDeliveryDate = new Date(item.PlanDeliveryDate);
    this.shiporder = shiporder;
    return this.shiporder;
  }
  loaddata() {
    //console.log('ionViewDidLoad DetailPage');
    let item = this.navParams.get('item');
    this.shiporder = this.convertoShipOrder(item);
    console.log(this.shiporder);
    let map = this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom();//连续缩放效果，默认禁用
    //let point = new BMap.Point(116.06827, 22.549284);//坐标可以通过百度地图坐标拾取器获取
    //map.centerAndZoom(point, 16);//设置中心和地图显示级别
    map.centerAndZoom(this.shiporder.Location1, 7);

    let adds = [];
    let points = [];
    adds.push(this.shiporder.Location1);
    if (this.shiporder.PassLocation)
      adds.push(this.shiporder.PassLocation);
    adds.push(this.shiporder.Location2);
    let myGeo = new BMap.Geocoder();
    adds.forEach(function (add) {
      myGeo.getPoint(add, function (point) {
        if (point) {
          points.push(point);
          console.log(point);
          let marker = new BMap.Marker(point);
          map.addOverlay(marker);
          if (points.length == adds.length) {
            var p1 = points[0];
            var p2 = points[points.length - 1]

            var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
            driving.search(p1, p2);

          }
        }
      });
    });

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      this.currentpoint = {};
      if (this.getStatus() == 0) {
        this.currentpoint = r.point;

        console.log("当前位置", this.currentpoint);
        var mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        map.panTo(r.point);

      }

    }, { enableHighAccuracy: true })

  }
  uploadStatus(status) {
    console.log('set' + status);
    this.http.get(this.URL + "SetShipOrderStatus?shiporderid=" + this.shiporder.Id + "&status=" + status + "&lng=0&lat=0&user=" + this.user.name)
      .map((res: any) => res)
      .subscribe(data => {
        console.log(data);
        if (data.success) {
          let toas = this.toastCtrl.create({
            message: '状态更新成功',
            duration: 3000,
            position: 'top'
          });
          toas.present();
        }
      });

  }
  openupdatestatus() {
    let buttons = [{
      text: '发车',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('发车')
      }
    },
    {
      text: '提货',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('提货')
      }
    },
    {
      text: '在途',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('在途')
      }
    },
    {
      text: '卸货',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('卸货')
      }
    },
    {
      text: '入仓',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('入仓')
      }
    },
    {
      text: '完成',
      role: 'action',
      icon: 'md-checkmark',
      handler: () => {
        this.uploadStatus('完成')
      }
    },
    {
      text: '关闭',
      role: '关闭', // will always sort to be on the bottom
      icon: 'close',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
    ];
    this.http.get(this.URL + "GetHistoryStatus?shiporderno=" + this.shiporder.ShipOrderNo)
      .map((res: any) => res.data)
      .subscribe(data => {
        console.log(data);
        data.forEach((item) => {
          buttons.forEach((btn) => {
            if (item.Status == btn.text) {
              var date = new Date(item.TransactioDateTime);
              btn.text = btn.text + '-' + date.toLocaleTimeString();
              btn.icon = 'md-checkbox-outline'
              btn.handler = null;
            }
          });
        });

        let actionSheet = this.actionsheetCtrl.create({
          title: '状态跟踪',
          cssClass: 'action-sheets-basic-page',
          buttons: buttons
        });
        actionSheet.present();
      });

  }
  openfeemodal() {
    let item = this.shiporder;
    let profileModal = this.modalCtrl.create(FeeformPage, { item });
    profileModal.present();

  }

}
