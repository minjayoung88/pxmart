import { Component, OnInit} from '@angular/core';
import { Platform,  LoadingController, AlertController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from '../loading.service';
import * as XLSX from 'xlsx';
import {
  Geocoder,
  GeocoderResult
} from '@ionic-native/google-maps';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as launcher from '../../app/start-app.js';
@Component({
  selector: 'app-home',
  templateUrl: 'Tab3.page.html',
  styleUrls: ['Tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  radioValue:any;
  Path_Test:string;
  networks_ = new Array();
  LoadingS : any;
  now_date : any;
  myDate : any;
  Path__:string;
  frame: HTMLElement;
  lat:string;
  lon:string;
  json_array = new Array();
  json_array_List = new Array();
  Region_array = new Array();
  flag = false;
  lb_file:string = '';
  constructor(
    private fileChooser:FileChooser, 
    private platform: Platform, 
    private filePath:FilePath, 
    private file:File, 
    
    private FileOpener:FileOpener,
    private http:HTTP,
    private loadingController:LoadingController,
    private alertController:AlertController,
    private nativeStorage: NativeStorage){
      this.LoadingS = new LoadingService(loadingController);
      let today = new Date();
      this.now_date = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString();
      this.myDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString();
  }

  async ngOnInit() {
    await this.platform.ready();
    this.lb_file = "현재 적용된 파일 : 전국 영외마트 현황(19.7.1부).cell";

  }
  async ionViewWillEnter(){
   this.nativeStorage.getItem('radio').then(
      (data) => this.radioValue = data
    );
  }
  async ionViewWillLeave(){
    this.nativeStorage.setItem('radio', this.radioValue);
  }
  
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: '알림',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  goGook(){
    launcher.packageLaunch("com.welfare.mobile");
  }
}


















