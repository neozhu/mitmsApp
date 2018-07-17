import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the FeeformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class ShipOrderCharge {
  FeeName: string;
  Amount: number;
  Invoice: string;
  Remark: string;
  Attachment: string;
  InputUser: string;
  ShipOrderId: number;
  ShipOrderNo: string;

}

@IonicPage()
@Component({
  selector: 'page-feeform',
  templateUrl: 'feeform.html',
})
export class FeeformPage {
  imageURL: any;
  feemodel: FormGroup;

  constructor(
    private camera: Camera,
    private formBuilder: FormBuilder,
    private viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.feemodel = this.formBuilder.group({
      FeeName: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      Amount: ['', Validators.compose([Validators.min(0.1), Validators.required])],
      Remark: ['', Validators.compose([Validators.maxLength(120)])],
    });
  }

  ionViewDidLoad() {
    let item = this.navParams.get('item');
    console.log(item);

  }


  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageURL = "data:image/jpeg;base64," + imageData;

    }, (err) => {
      console.log(err);
    });
  }
  submitfeeform() {
    console.log(this.feemodel);
    if (this.feemodel.valid) {

    }

  }
}
