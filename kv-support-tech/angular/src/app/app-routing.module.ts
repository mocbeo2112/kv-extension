import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'popup',
    loadChildren: () => import('./modules/popup/popup.module').then(m => m.PopupModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
