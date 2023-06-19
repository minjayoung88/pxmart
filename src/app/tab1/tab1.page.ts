import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Platform,  LoadingController, AlertController } from '@ionic/angular';
import * as launcher from '../../app/start-app.js';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  HtmlInfoWindow
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingService } from '../loading.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IfStmt } from '@angular/compiler';
@Component({
  selector: 'app-home',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  mapValue:string;
  map: GoogleMap;
  //getA: any;
  Path_Test:string;
  LoadingS : any;
  Path__:string;
  htmlInfoWindow = new HtmlInfoWindow();
  frame: HTMLElement;
  lat:string;
  lon:string;
  json_array_ALL = new Array();
  json_array = new Array();
  Marker_:Marker;
  UPload_chk = 0;
  Region_1 = new Array();
  Region_2 = ["전체"]
  Region_All:JSON;
  sel:string;
  sel_:string;
  lb_text_:string = '';
  constructor(
    private platform: Platform, 
    private geolocation: Geolocation, 
    private alertController:AlertController,
    private nativeStorage: NativeStorage,
    private loadingController: LoadingController,
    public cdr: ChangeDetectorRef){
      this.LoadingS = new LoadingService(loadingController);
  }

  async Combo_DO(){
    //콤보박스 아이템
    await fetch('./assets/px_data_/px_region.json').then(res => res.json())
    .then(data => {
        //alert(data);
        this.Region_All= data; 
        let arr = Object.keys(this.Region_All);
        arr.unshift("전체");
        //데이터 초기화
        this.Region_1= arr;
        this.sel = "전체"
        this.sel_ = "전체"
        // this.cdr.detectChanges();
      },
      error => console.log(error)
    );
  }

  async ionViewWillEnter(){
    //alert('이동');
    //업로드가 반영되었는지 확인

    this.nativeStorage.getItem('radio').then(
      (data) => {

        if(this.mapValue != data){
          this.mapValue = data;
          this.Combo_DO();
          this.add_Marker(this.json_array_ALL,"1");
        }
        
      },
      error => this.nativeStorage.setItem('radio', "1")
    );
    
  }

  async ngOnInit() {
    await this.platform.ready();

    this.frame = document.createElement('div');
    this.frame.innerHTML= '<div></div>'
    this.frame.addEventListener("click", (evt) => {
      let container = document.getElementById('flip-container');
      if (container.className.indexOf(' hover') > -1) {
        container.className = container.className.replace(" hover", "");
      } else {
        container.className += " hover";
      }
    });
    this.htmlInfoWindow.setContent(this.frame, {
      width: "230px"
    });
    
    await fetch('./assets/px_data_/px_data_.json').then(res => res.json())
    .then(data => this.json_array_ALL =data,
      error => console.log(error)
    );

    await this.Combo_DO();

    //alert(this.json_array[0].px_Name)
    await this.GetCurr();

  }

  async R1_Chage() {
    //alert(this.sel);
    if(this.sel == "전체"){
      this.Region_2 = ["전체"];
      
      await this.add_Marker(this.json_array_ALL,"2");
    }else{
      this.Region_2 = this.Region_All[this.sel];
      //alert('a');
      this.json_array = this.json_array_ALL.filter(el => {
        return el.px_Address.indexOf(this.sel) != -1;
        //return el.px_Address == '강원도 강릉시 남항진동 공항길 180 군인아파트단지 내';
      });
      // var arr_:any = this.json_array_ALL;
      //let new_arr = this.json_array_ALL.filter(c => c.__EMPTY_3.includes(this.sel) == true)
      // alert(JSON.parse(arr_));
      await this.add_Marker(this.json_array,"2");
    }
    this.sel_ = "전체";
    // this.cdr.detectChanges();
  }

  async R2_Chage() {
    //alert(this.sel);
    if(this.sel != "전체"){
     if(this.sel_ != "전체"){
        let arr:any = this.json_array.filter(el => {
          return el.px_Address.indexOf(this.sel_) != -1;
          //return el.px_Address == '강원도 강릉시 남항진동 공항길 180 군인아파트단지 내';
        });
        
        await this.add_Marker(arr,"2");
      }else{
        this.json_array = this.json_array_ALL.filter(el => {
          return el.px_Address.indexOf(this.sel) != -1;
        });
        await this.add_Marker(this.json_array,"2");
      }
    }
  }

  GetCurr(){

    this.LoadingS.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat =  resp.coords.latitude.toString();
      this.lon =  resp.coords.longitude.toString();
      this.map = GoogleMaps.create('map_canvas', {
        controls : {
          compass : false,
          myLocationButton : true,
          myLocation: true,
          indoorPicker : false,
          zoom : false,
          mapToolbar : false
        },
        camera: {
          target: {
            lat: this.lat,
            lng: this.lon
          },
          zoom: 12
          //tilt: 30
        }
      })
      //처음엔 전부
      if(this.json_array_ALL.length > 0){
        this.add_Marker(this.json_array_ALL,"1");
      }else{
        this.presentAlert("설정탭에서 전국영외마트 현황을 업로드해주세요. 업로드시 1~2분 소요될 수 있습니다.")
        this.LoadingS.dismiss();
      }
      }).catch((error) => {
      this.LoadingS.dismiss();
      alert('Error getting location');
    }); 
    
  }
  
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: '알림',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async add_Marker(j_array:any, chk){
    //alert(address_);
    //alert('a');
    this.map.clear();
    this.LoadingS.present();
    let sum_lat = 0;
    let sum_lng = 0;
    Promise.all(j_array.map((data_) => {
      sum_lat += data_.lat;
      sum_lng += data_.lng;
      this.map.addMarker({
        //title: 'Ionic',
        icon: 'skyblue',
        //animation: 'DROP',
        position: { 
          lat : data_.lat,
          lng : data_.lng
        },
        //title : r.__EMPTY_2  + '위치 : ' + r.__EMPTY_3 +'\n'+ '<a>전화 : ' + r.__EMPTY_4 + '</a>'
      }).then((marker: Marker) => {

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          let phon_NO = data_.px_Phon.replace('-','');

          this.frame.innerHTML = '<div style="font-size:10x;line-height:1.3em;">';
          this.frame.innerHTML += this.mapValue == "1"?
          //https://m.map.naver.com/directions/?ename=%EA%B5%AD%EB%B0%A9%EB%B6%80&ex=126.9777595&ey=37.5341668
           data_.px_Name +'<br>'+ '<a href="https://www.google.co.kr/maps/dir/'+this.lat+','+this.lon+'/'+data_.lat+','+data_.lng+'?hl=ko">위치 : ' + data_.px_Address +'</a><br>'+ '<a href="tel:'+ phon_NO +'">전화 : ' + data_.px_Phon + '</a></div>':
           this.mapValue == "2"? 
           data_.px_Name +'<br>'+ '<a href="https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxc38c8ee38be44841b32eec60b806757d&name='+data_.px_Name+'&lon='+data_.lng+'&lat='+data_.lat+'">위치 : ' + data_.px_Address +'</a><br>'+ '<a href="tel:'+ phon_NO +'">전화 : ' + data_.px_Phon + '</a></div>': 
           data_.px_Name +'<br>'+ '<a href="https://map.kakao.com/link/to/'+ data_.px_Name+','+data_.lat+','+data_.lng+'">위치 : ' + data_.px_Address +'</a><br>'+ '<a href="tel:'+ phon_NO +'">전화 : ' + data_.px_Phon + '</a></div>'; 
            //https://m.map.naver.com/directions/?ename='+r.__EMPTY_2+'&ex='+latlng.lat.toString()+'&ey='+latlng.lng.toString()+'
            //'<a href="https://m.map.naver.com/directions/?ename='+r.__EMPTY_2+'&ex='+latlng.lat.toString()+'&ey='+latlng.lng.toString()+'">위치 : ' + r.__EMPTY_3 +'</a><br>'+ 
            //nmap://route/public?slat='+this.lat+'&slng='+this.lon+'&sname=현재위치&dlat='+latlng.lat.toString()+'&dlng='+latlng.lng.toString()+'&dname='+r.__EMPTY_2+'&appname=com.example.myapp
          
          this.htmlInfoWindow.open(marker);
          //alert(this.json_array.length);
          
        });
        //marker.trigger(GoogleMapsEvent.MARKER_CLICK);
      });
    })).then(files => {
      if(chk != "1"){
        //let bounds  = this.map. .LatLngBounds();
        //카메라 위치를 중간으로 변경
        //this.map.fit
        let count_ = j_array.length;
        this.map.moveCamera({
          target: {lat: sum_lat/count_, lng: sum_lng/count_},
          zoom: 8,
          tilt: 30//,
          //bearing: 140
        });
        //this.map.setCameraZoom(this.map.getCameraZoom() - 1);
        
      }
      this.LoadingS.dismiss();
    })
  } 
}


















