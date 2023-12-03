import { Pipe, PipeTransform } from '@angular/core';
import { NuisanceReport } from 'src/types/nuisance';

@Pipe({
  name: 'countNuisances',
})
export class CountNuisancesPipe implements PipeTransform {
  transform(nuisances: NuisanceReport[], placeName: string): number {
    const nuisanceReports = nuisances.filter(
      (nuisance) => nuisance.location.placeName === placeName
    );
    return nuisanceReports.length;
  }
}
