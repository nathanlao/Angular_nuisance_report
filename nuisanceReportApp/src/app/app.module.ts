import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NuisanceComponent } from './nuisance/nuisance.component';
import { NuisanceListComponent } from './nuisance-list/nuisance-list.component';
import { NuisanceFormComponent } from './nuisance-form/nuisance-form.component';
import { NuisanceInfoComponent } from './nuisance-info/nuisance-info.component';
import { FormatDateTimePipe } from '../pipe/format-date-time.pipe';
import { NuisanceMapComponent } from './nuisance-map/nuisance-map.component';
import { CountNuisancesPipe } from '../pipe/count-nuisances.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NuisanceComponent,
    NuisanceListComponent,
    NuisanceFormComponent,
    NuisanceInfoComponent,
    FormatDateTimePipe,
    NuisanceMapComponent,
    CountNuisancesPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
