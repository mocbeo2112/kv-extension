import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopupComponent } from './pages/popup/popup.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PopupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule]
})
export class PopupRoutingModule {}
