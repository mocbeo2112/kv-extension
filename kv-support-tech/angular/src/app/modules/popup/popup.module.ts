import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopupComponent } from './pages/popup/popup.component';
import { PopupRoutingModule } from './popup-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PopupComponent],
  imports: [CommonModule, PopupRoutingModule, FormsModule]
})
export class PopupModule {}
