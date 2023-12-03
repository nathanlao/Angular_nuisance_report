import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import { CountNuisancesPipe } from 'src/pipe/count-nuisances.pipe';
import { NuisanceService } from 'src/service/nuisance.service';
import { NuisanceReport } from 'src/types/nuisance';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-nuisance-map',
  templateUrl: './nuisance-map.component.html',
  styleUrls: ['./nuisance-map.component.css'],
})
export class NuisanceMapComponent implements OnChanges, AfterViewInit {
  @Input() nuisances: NuisanceReport[];
  private map!: L.Map;

  constructor(private nuisanceService: NuisanceService) {
    this.nuisances = [];
  }

  // Respond to changes in input property nuisances
  ngOnChanges(changes: any): void {
    if (changes.nuisances) {
      this.updateMarkers();
    }
  }

  updateMarkers() {
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });
      this.putLabels();
    }
  }

  ngAfterViewInit(): void {
    this.showMap();
    this.putLabels();
  }

  showMap() {
    this.map = L.map('mapid').setView([49.27, -123], 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    }).addTo(this.map);
  }

  putLabels() {
    const countPipe = new CountNuisancesPipe();

    this.nuisances.forEach((nuisance) => {
      const countInMarker = countPipe.transform(
        this.nuisances,
        nuisance.location.placeName
      );

      L.marker([nuisance.location.latitude, nuisance.location.longitude])
        .addTo(this.map)
        .bindPopup(
          `
            <div style="font-family: 'Roboto Mono'; color: #333;">
              <i class="bi bi-geo" style="color: #007bff;"></i>
              <b>${nuisance.location.placeName}</b>
              <br>
              <span style="font-size: 0.8em; color: #666;">${countInMarker} nuisance reports</span>
            </div>
          `
        );
    });
  }
}
