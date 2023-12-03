import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NuisanceService } from 'src/service/nuisance.service';
import { Location_, NuisanceReport, NuisanceStatus } from 'src/types/nuisance';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-nuisance-form',
  templateUrl: './nuisance-form.component.html',
  styleUrls: ['./nuisance-form.component.css'],
})
export class NuisanceFormComponent implements OnInit {
  form: FormGroup;
  selectedLocation: string | null = null;
  existingLocations: Location_[] = [];

  constructor(
    private nuisanceService: NuisanceService, 
    private router: Router
  ) {
    let locationGroup = new FormGroup({
      selectedLocation: new FormControl(''),
      placeName: new FormControl('', [Validators.required]),
      longitude: new FormControl(null, [Validators.required]),
      latitude: new FormControl(null, [Validators.required])
    });

    let formControls = {
      id: new FormControl(''),
      reporterName: new FormControl('', [
        Validators.required
      ]),
      reporterPhone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]),
      troublemakerName: new FormControl('', [
        Validators.required
      ]),
      location: locationGroup,
      pictureUrl: new FormControl(''),
      extraInfo: new FormControl('', [
        Validators.required
      ]),
      timeReported: new FormControl(new Date().getTime()),
      status: new FormControl(NuisanceStatus.OPEN),
    };
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
    this.existingLocations = this.nuisanceService.getUniqueLocations();
  }

  onSelectLocation(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLocation = selectElement.value;

    // User is creating a new location, reset these fields
    if (this.selectedLocation === 'Type your location...') {
      this.form.get('location.placeName')?.reset();
      this.form.get('location.longitude')?.reset();
      this.form.get('location.latitude')?.reset();
    } else {
      // User selected an existing location, set the values
      const selectedLocation = this.existingLocations.find(loc => loc.placeName === this.selectedLocation);
      if (selectedLocation) {
        this.form.get('location.placeName')?.setValue(selectedLocation.placeName);
        this.form.get('location.longitude')?.setValue(selectedLocation.longitude);
        this.form.get('location.latitude')?.setValue(selectedLocation.latitude);
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const newNuisance: NuisanceReport = {
        ...this.form.value,
        id: uuidv4(),
        timeReported: new Date().getTime(),
        status: NuisanceStatus.OPEN
      };
      this.nuisanceService.add(newNuisance);
      this.form.reset();
      alert("Successfully saved the report!");
      this.router.navigate(['/nuisance']);

    } else {
      this.form.markAllAsTouched();
    }
  }
}
