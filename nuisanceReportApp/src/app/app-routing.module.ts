import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuisanceListComponent } from './nuisance-list/nuisance-list.component';
import { NuisanceFormComponent } from './nuisance-form/nuisance-form.component';
import { NuisanceInfoComponent } from './nuisance-info/nuisance-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/nuisance', pathMatch: 'full' },
  { path: 'nuisance', component: NuisanceListComponent },
  { path: 'nuisance/add', component: NuisanceFormComponent },
  { path: 'nuisance/:id', component: NuisanceInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
