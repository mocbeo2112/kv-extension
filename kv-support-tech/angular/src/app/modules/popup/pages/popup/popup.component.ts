import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TAB_ID } from '../../../../providers/tab-id.provider';
import { HttpClient } from '@angular/common/http';

interface IRetailerInfo {
  Id: number;
  Code: string;
  kvSession: string;
  fbId?: string;
  fbUT?: string;
  fbUsers?: IFbUserInfo[];
  GroupId?: string;
  BearerToken?: string;
  CatalogId?: string;
  CatalogToken?: string;
}
export interface ICatalogInfo {
  _id: string;
  catalogId: string;
  businessId: string;
  businessName: string;
  catalogName: string;
  createdAt: string;
  pageId: string;
  branchId: number;
  pricebookId: number;
  pricebookName: string;
  syncInventory: number;
}

export interface IFbUserInfo {
  fbid: string;
  updatedTime: string;
  userToken: string;
  name: string;
}


@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent implements OnInit {
  retailerInfo: IRetailerInfo = {
    Id: 0,
    Code: '',
    kvSession: '',
    GroupId: '',
    CatalogId: '',
    BearerToken: ''
  };


  localStorageData: any;
  catalogList: Array<ICatalogInfo> = [];

  fbcAPI = 'https://fbc.kvpos.com:444';
  basicAuth = `YWRtaW46JmpMMnFDNjkxIW0z`;

  toastMessage = '';
  timeOutToast;
  constructor(@Inject(TAB_ID) readonly tabId: number,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly httpClient: HttpClient) { }

  ngOnInit(): void {
    const component = this;
    chrome.storage.local.get("receivedData", function (result) {
      const receivedData = (result && result['receivedData']) as any;
      if (receivedData) {
        component.localStorageData = receivedData;
        if (receivedData.kvsale_session) {
          const saleSession = JSON.parse(receivedData.kvsale_session);
          component.fbcAPI = saleSession.baseSocialNetworkApi || this.fbcAPI;
        }
        const session = receivedData.kvSession;
        if (session) {
          const info = JSON.parse(session);
          component.retailerInfo = info['Retailer'];
          component.retailerInfo.kvSession = session;
          component.retailerInfo.BearerToken = info['BearerToken'];
          try {
            const GroupId = JSON.parse(result?.['receivedData'].kvSession).Retailer?.GroupId;
            component.retailerInfo.GroupId = GroupId;
          } catch (e) {
          }
        }
      }
    });

    setTimeout(() => {
      this.getTokenAndCopy();
      this.getCatalogConnection();
      this.changeDetectorRef.detectChanges();
    }, 500);
  }

  copyInputMessage(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  getTokenAndCopy() {
    this.httpClient.get(`${this.fbcAPI}/fbid?retailerId=${this.retailerInfo.Id}`, {
      headers: {
        Authorization: `Basic ${this.basicAuth}`
      }
    }).subscribe(result => {
      const data = result['data'] as any;
      if (data?.length) {
        this.retailerInfo.fbUsers = data;
        this.retailerInfo.fbUsers = this.retailerInfo.fbUsers.map(item => {
          if (!item?.name) {
            item.name = 'NAME';
          }

          return item
        })
        const first = data[0];
        this.retailerInfo.fbId = first.fbid;
        this.retailerInfo.fbUT = first.userToken;
        this.copyInputMessage(this.retailerInfo.fbId);
        this.showToast(`Copied fbid ${first.fbid}`);
      }
    })
  }

  onFbidChange(newValue: string) {
    this.copyInputMessage(this.retailerInfo.fbId);
    const found = this.retailerInfo.fbUsers.find(x => x.fbid === this.retailerInfo.fbId);
    if (found) {
      this.retailerInfo.fbUT = found.userToken;
      this.showToast(`Copied fbid ${found.fbid}`);
    }
  }

  onCatalogChange(newValue) {
    this.copyInputMessage(this.retailerInfo.CatalogId);
    this.showToast(`Copied catalogId ${this.retailerInfo.CatalogId}`);

    this.getCatalogToken();
  }

  getCatalogConnection() {
    this.httpClient.get(`${this.fbcAPI}/facebook-catalog/connection`, {
      headers: {
        Authorization: `Bearer ${this.retailerInfo.BearerToken}`
      }
    }).subscribe(result => {
      if (result?.['data']?.length) {
        this.catalogList = result['data'];
        this.retailerInfo.CatalogId = this.catalogList[0].catalogId;
        this.getCatalogToken();
      }
    })
  }

  getCatalogToken() {
    this.httpClient.get(`${this.fbcAPI}/fbcToken?catalogId=${this.retailerInfo.CatalogId}`, {
      headers: {
        Authorization: `Basic ${this.basicAuth}`
      }
    }).subscribe(result => {
      if (result?.['token']) {
        this.retailerInfo.CatalogToken = result?.['token'];
      }
    })
  }

  showToast(message: string) {
    if (this.timeOutToast) {
      clearTimeout(this.timeOutToast);
    }
    this.toastMessage = message;
    this.timeOutToast = setTimeout(() => { this.toastMessage = '' }, 2000);
  }

}
