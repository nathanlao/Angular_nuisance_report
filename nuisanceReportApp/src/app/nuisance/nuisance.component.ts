import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NuisanceReport } from 'src/types/nuisance';
import { Md5 } from 'ts-md5';

@Component({
  selector: '[app-nuisance]',
  templateUrl: './nuisance.component.html',
  styleUrls: ['./nuisance.component.css'],
})
export class NuisanceComponent {
  @Input() nuisance!: NuisanceReport; // Object from external view: nuisance-list
  @Output() delete = new EventEmitter();

  constructor(private router: Router) {}

  onDelete(event: any, nuisanceId: string) {
    const userInput = prompt(
      'Please enter the password to confirm and delete the report:'
    );

    if (userInput === null) {
      alert('Deletion cancelled.');
      return;
    }

    const hashedInput = Md5.hashStr(userInput);
    if (hashedInput === 'fcab0453879a2b2281bc5073e3f5fe54') {
      event['nuisance_id'] = nuisanceId;
      // console.log('Click on this', event);
      this.delete.emit(event);
      alert('Successfully deleted.');
    } else {
      alert('Incorrect password.');
    }
  }

  onView() {
    this.router.navigate(['/nuisance', this.nuisance.id]);
  }
}
