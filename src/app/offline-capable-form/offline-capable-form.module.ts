import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineCapableFormPageRoutingModule } from './offline-capable-form-routing.module';

import { OfflineCapableFormPage } from './offline-capable-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineCapableFormPageRoutingModule,
    ReactiveFormsModule, // Add this line
  ],
  declarations: [OfflineCapableFormPage],
})
export class OfflineCapableFormPageModule {}
