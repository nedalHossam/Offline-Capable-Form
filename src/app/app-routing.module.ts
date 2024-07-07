import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'offline-form',
    loadChildren: () =>
      import('./offline-capable-form/offline-capable-form.module').then(
        (m) => m.OfflineCapableFormPageModule
      ),
  },
  {
    path: '',
    redirectTo: 'offline-form',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
