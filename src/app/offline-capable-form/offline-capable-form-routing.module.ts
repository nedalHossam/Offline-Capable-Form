import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineCapableFormPage } from './offline-capable-form.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineCapableFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineCapableFormPageRoutingModule {}
