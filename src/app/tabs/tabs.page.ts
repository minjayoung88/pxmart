import { Component } from '@angular/core';

import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private statusBar: StatusBar) {
    //this.statusBar.overlaysWebView(true);
    this.statusBar.styleBlackOpaque();
    // set status bar to white
    //this.statusBar.backgroundColorByHexString('#ffffff');

  }

}
