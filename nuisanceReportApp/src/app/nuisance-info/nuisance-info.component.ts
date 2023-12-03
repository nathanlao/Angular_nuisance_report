import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NuisanceService } from 'src/service/nuisance.service';
import { NuisanceReport, NuisanceStatus } from 'src/types/nuisance';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-nuisance-info',
  templateUrl: './nuisance-info.component.html',
  styleUrls: ['./nuisance-info.component.css'],
})
export class NuisanceInfoComponent implements OnInit {
  nuisanceId: string = '';
  nuisance!: NuisanceReport | undefined;

  constructor(
    private nuisanceService: NuisanceService,
    private ActivatedRoute: ActivatedRoute
  ) {}

  formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  toggleStatus() {
    const userInput = prompt(
      'Please enter the password to confirm and change the status:'
    );

    if (userInput === null) {
      alert('The change has been cancelled.');
      return;
    }

    const hashedInput = Md5.hashStr(userInput);
    if (hashedInput === 'fcab0453879a2b2281bc5073e3f5fe54') {
      if (!this.nuisance) {
        return;
      }

      this.nuisanceService
        .updateStatusById(this.nuisanceId, this.nuisance)
        .subscribe({
          next: () => {
            alert('Status successfully changed.');
          },
          error: () => {
            alert('There was an error updating the status.');
          },
        });
    } else {
      alert('Incorrect password.');
    }
  }

  ngOnInit() {
    this.nuisanceId = this.ActivatedRoute.snapshot.params['id'];
    this.nuisanceService.getNuisanceById(this.nuisanceId).subscribe({
      next: (nuisance) => {
        this.nuisance = nuisance;
      },
      error: (error) => console.error('Error getting nuisance', error),
    });
  }
}
