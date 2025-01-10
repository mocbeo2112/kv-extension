import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TAB_ID } from '../../../../providers/tab-id.provider';
import { HttpClient } from '@angular/common/http';

interface IRetailerInfo {
  Id: number;
  Code: string;
  kvSession: string;
  fbId?: string;
  fbName?: string;
  fbIds?: string;
  fbUT?: string;
  GroupId?: string;
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
    GroupId: ''
  };
  localStorageData: any;
  constructor(@Inject(TAB_ID) readonly tabId: number,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly httpClient: HttpClient) { }

  ngOnInit(): void {
    const component = this;
    chrome.storage.local.get("receivedData", function (result) {
      const receivedData = (result && result['receivedData']) as any;
      if (receivedData) {
        component.localStorageData = receivedData;
        const session = receivedData.kvSession;
        // const fbid = receivedData.fbid;
        if (session) {
          const info = JSON.parse(session);
          component.retailerInfo = info['Retailer'];
          console.log('info', info);
          component.retailerInfo.kvSession = session;
          // component.retailerInfo.fbId = fbid;
          try {
            const GroupId = JSON.parse(result?.['receivedData'].kvSession).Retailer?.GroupId;
            component.retailerInfo.GroupId = GroupId;
          } catch (e) {
          }

          // if (component.retailerInfo.fbId) {
          //   component.getTokenAndCopy();
          // }
          component.changeDetectorRef.detectChanges();
        }
      }
    });
  }

  copyInputMessage(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Append the textarea to the document
    document.body.appendChild(textarea);
    // Select the text within the textarea
    textarea.select();
    // Copy the selected text to the clipboard
    document.execCommand('copy');
    // Remove the temporary textarea
    document.body.removeChild(textarea);
  }

  getTokenAndCopy() {
    this.httpClient.get(`https://fbc.kiotapi.com/fbid?retailerId=${this.retailerInfo.Id}`, {
      headers: {
        Authorization: `Basic YWRtaW46JmpMMnFDNjkxIW0z`
      }
    }).subscribe(result => {
      const data = result['data'] as any;
      if (data && data.length) {
        this.retailerInfo.fbId = data[0].fbid;
        this.retailerInfo.fbIds = data.map(x => x.fbid).join(', ');
        localStorage['anhhn'] = this.retailerInfo.fbId;
        this.httpClient.get(`https://graph.facebook.com/${data[0].fbid}?access_token=${data[0].userToken}`)
          .subscribe((res: any) => {
            this.retailerInfo.fbName = res?.name;
          })
      }
    })
  }

}
