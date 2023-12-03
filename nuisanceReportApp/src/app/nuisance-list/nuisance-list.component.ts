import { Component, OnInit } from '@angular/core';
import { NuisanceService } from 'src/service/nuisance.service';
import { NuisanceReport } from 'src/types/nuisance';

@Component({
  selector: 'app-nuisance-list',
  templateUrl: './nuisance-list.component.html',
  styleUrls: ['./nuisance-list.component.css'],
})
export class NuisanceListComponent implements OnInit {
  nuisances: NuisanceReport[];

  constructor(private nuisanceService: NuisanceService) {
    this.nuisances = [];
    // this.nuisances = [
    //   {
    //     id: '1',
    //     reporterName: 'Hello',
    //     reporterPhone: '2041112222',
    //     troublemakerName: 'X',
    //     location: {
    //       placeName: 'Metrotown',
    //       longitude: 1,
    //       latitude: 2,
    //     },
    //     pictureUrl: './src/assets',
    //     extraInfo: 'This is cool',
    //     timeReported: new Date().toDateString(),
    //     status: NuisanceStatus.OPEN,
    //   },
    //   {
    //     id: '2',
    //     reporterName: 'Hi',
    //     reporterPhone: '2041112223',
    //     troublemakerName: 'Y',
    //     location: {
    //       placeName: 'Vancouver',
    //       longitude: 3,
    //       latitude: 4,
    //     },
    //     pictureUrl: './src/assets',
    //     extraInfo: 'He is bad',
    //     timeReported: new Date().toDateString(),
    //     status: NuisanceStatus.RESOLVED,
    //   },
    // ];
  }

  onNuisanceDelete(event: { nuisance_id: string }) {
    this.nuisanceService.delete(event.nuisance_id).subscribe({
      next: (updatedNuisances) => {
        // console.log('Nuisance successfully deleted');

        // Update the nuisances array
        this.nuisances = updatedNuisances;
      },
      error: (error) => console.error('Error deleting nuisance', error),
    });
  }

  onLocationSort() {
    this.nuisanceService.setCurrentSortMethod('location');
    this.nuisanceService.setActiveSortButton('locationSortButton');
  }

  onNameSort() {
    this.nuisanceService.setCurrentSortMethod('name');
    this.nuisanceService.setActiveSortButton('nameSortButton');
  }

  onTimeSort() {
    this.nuisanceService.setCurrentSortMethod('time');
    this.nuisanceService.setActiveSortButton('timeSortButton');
  }

  ngOnInit(): void {
    this.nuisanceService.get().subscribe({
      next: (nuisances) => {
        this.nuisances = nuisances;
      },
      error: (error) => console.error('Error getting nuisances', error),
    });
    this.setFocusOnActiveSortButton();
  }

  setFocusOnActiveSortButton() {
    const activeButtonId = this.nuisanceService.getActiveSortButton();
    if (activeButtonId) {
      setTimeout(() => {
        const element = document.getElementById(activeButtonId);
        element?.focus();
      });
    }
  }
}
