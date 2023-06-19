import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import { Platform,  LoadingController, AlertController } from '@ionic/angular';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingService } from '../loading.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
export interface Data {
  movies: string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None
})


export class Tab2Page {
  public columns: any;
  public rows: any;
  public data: Data;
  LoadingS : any;
  Path__:string;
  frame: HTMLElement;
  lat:string;
  lon:string;
  json_array_ALL = new Array();
  json_array = new Array();
  UPload_chk = 0;
  Region_1 = new Array();
  Region_2 = ["전체"]
  Region_All:JSON;
  sel:string;
  sel_:string;
  constructor(
    private platform: Platform, 
    private alertController:AlertController,
    private nativeStorage: NativeStorage,
    private loadingController: LoadingController,
    private http: HttpClient){
      this.LoadingS = new LoadingService(loadingController);

      
  }

  async Combo_DO(){
    //콤보박스 아이템
    await fetch('./assets/px_data_/px_region.json').then(res => res.json())
    .then(data => {
        //alert(data);
        this.Region_All = data; 
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

  async ngOnInit() {
    await this.platform.ready();
    await fetch('./assets/px_data_/px_data_List.json').then(res => res.json())
    .then(data => {
        this.json_array_ALL = data
        this.columns = [
          { name: '마트명', prop: 'name', width: 100},
          { name: '주소', prop: 'address', width: 150},
          { name: '전화', prop: 'phone' }
        ];
        
        //this.rows = data;

        this.rows = this.json_array_ALL

      },
      error => console.log(error)
    );

    await this.Combo_DO();
  }

  async R1_Chage() {
    //alert(this.sel);
    if(this.sel == "전체"){
      this.Region_2 = ["전체"];
      this.rows = this.json_array_ALL;
    }else{
      this.Region_2 = this.Region_All[this.sel];
      //alert('a');
      this.json_array = this.json_array_ALL.filter(el => {
        return el.address.indexOf(this.sel) != -1;
        //return el.px_Address == '강원도 강릉시 남항진동 공항길 180 군인아파트단지 내';
      });

      this.rows = this.json_array;
    }
    this.sel_ = "전체";
    // this.cdr.detectChanges();

  }

  
  async R2_Chage() {
    //alert(this.sel);
    if(this.sel != "전체"){
     if(this.sel_ != "전체"){
        let arr:any = this.json_array.filter(el => {
          return el.address.indexOf(this.sel_) != -1;
          //return el.px_Address == '강원도 강릉시 남항진동 공항길 180 군인아파트단지 내';
        });
        this.rows = arr;
        //await this.add_Marker(arr,"2");
      }else{
        this.json_array = this.json_array_ALL.filter(el => {
          return el.address.indexOf(this.sel) != -1;
        });
        this.rows = this.json_array;
        //await this.add_Marker(this.json_array,"2");
      }
    }
  }
}
