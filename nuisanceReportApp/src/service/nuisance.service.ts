import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import {
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { Location_, NuisanceReport, NuisanceStatus } from 'src/types/nuisance';

@Injectable({
  providedIn: 'root',
})
export class NuisanceService {
  nuisances: NuisanceReport[];
  uniqueLocations: Location_[] = []; // For dynamic select list in form
  private currentSortMethod: string = '';
  private activeSortButton: string | null = null;
  private nuisanceKeyMap = new Map<string, string>(); // Mapping of nuisanceId to key

  constructor(private http: HttpClient) {
    this.nuisances = [
      // {
      //   id: '1',
      //   reporterName: 'Hello',
      //   reporterPhone: '2041112222',
      //   troublemakerName: 'X',
      //   location: {
      //     placeName: 'Metrotown',
      //     longitude: -123.0076,
      //     latitude: 49.2276,
      //   },
      //   pictureUrl: 'https://picsum.photos/200/300',
      //   extraInfo: 'This is cool',
      //   timeReported: new Date().getTime(),
      //   status: NuisanceStatus.OPEN,
      // },
      // {
      //   id: '2',
      //   reporterName: 'Hi',
      //   reporterPhone: '2041112223',
      //   troublemakerName: 'Y',
      //   location: {
      //     placeName: 'Stanley Park',
      //     longitude: -123.148155,
      //     latitude: 49.300054,
      //   },
      //   pictureUrl: '',
      //   extraInfo: 'He is bad',
      //   timeReported: new Date().getTime(),
      //   status: NuisanceStatus.RESOLVED,
      // },
      // {
      //   id: '3',
      //   reporterName: 'Hi',
      //   reporterPhone: '2041112223',
      //   troublemakerName: 'Z',
      //   location: {
      //     placeName: 'SFU Burnaby',
      //     longitude: -122.9199,
      //     latitude: 49.2781,
      //   },
      //   pictureUrl: '',
      //   extraInfo: 'He is ok',
      //   timeReported: 0,
      //   status: NuisanceStatus.RESOLVED,
      // },
    ];

    // Initialize the nuisance key map from local storage
    const storeMap = localStorage.getItem('nuisanceKeyMap');
    if (storeMap) {
      this.nuisanceKeyMap = new Map(JSON.parse(storeMap));
    }
  }

  get(): Observable<NuisanceReport[]> {
    // API GET: from the storage collection
    return this.http
      .get<{ key: string; data: NuisanceReport }[]>(
        'https://272.selfip.net/apps/Np1xLyA6LS/collections/nuisances_collection/documents/'
      )
      .pipe(
        map((response) => {
          this.nuisances = response.map((item) => item.data);

          // Get and map the key and data Id
          response.forEach((item) => {
            this.nuisanceKeyMap.set(item.data.id, item.key);
          });

          this.updateUniqueLocations();
          this.applySorting();
          return this.nuisances;
        }),
        catchError((error) => {
          console.error('Error fetching nuisances:', error);
          return throwError(() => error);
        })
      );
  }

  getNuisanceById(nuisanceId: string): Observable<NuisanceReport> {
    // let nuisance = this.nuisances.find((n) => n.id === nuisanceId);
    const keyIdToRetrieve = this.nuisanceKeyMap.get(nuisanceId);
    if (!keyIdToRetrieve) {
      console.error('No matching key found for the given nuisance ID');
    }

    return this.http
      .get<{ key: string; data: NuisanceReport }>(
        `https://272.selfip.net/apps/Np1xLyA6LS/collections/nuisances_collection/documents/${keyIdToRetrieve}/`
      )
      .pipe(
        map((response) => response.data as NuisanceReport),
        catchError((error) => {
          console.error('GET request error', error);
          return throwError(() => error);
        })
      );
  }

  add(nuisance: NuisanceReport) {
    nuisance.timeReported = new Date().getTime();

    const key = uuidv4();
    // API POST: add nuisance to the document in the storage collection
    this.http
      .post(
        'https://272.selfip.net/apps/Np1xLyA6LS/collections/nuisances_collection/documents/',
        {
          key: key,
          data: nuisance,
        }
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.nuisanceKeyMap.set(nuisance.id, key);
          localStorage.setItem(
            'nuisanceKeyMap',
            JSON.stringify(Array.from(this.nuisanceKeyMap.entries()))
          );

          this.nuisances.push(nuisance);

          // Add to uniqueLocations(for dropdown select) if not already present
          this.updateUniqueLocations();
          this.applySorting();
        },
        error: (error) => console.error('POST request error: ', error),
      });
  }

  updateStatusById(
    nuisanceId: string,
    nuisance: NuisanceReport
  ): Observable<any> {
    if (nuisance.status === NuisanceStatus.OPEN) {
      nuisance.status = NuisanceStatus.RESOLVED;
    } else {
      nuisance.status = NuisanceStatus.OPEN;
    }

    const keyIdToUpdate = this.nuisanceKeyMap.get(nuisanceId);
    if (!keyIdToUpdate) {
      console.error('No matching key found for the given nuisance ID');
    }

    return this.http
      .put(
        `https://272.selfip.net/apps/Np1xLyA6LS/collections/nuisances_collection/documents/${keyIdToUpdate}/`,
        {
          key: keyIdToUpdate,
          data: nuisance,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Update request error', error);
          return throwError(() => error);
        })
      );
  }

  delete(nuisanceIdToBeDeleted: string): Observable<any> {
    // API DELETE: the data in the storage
    const keyIdToDelete = this.nuisanceKeyMap.get(nuisanceIdToBeDeleted);
    if (!keyIdToDelete) {
      console.error('No matching key found for the given nuisance ID');
    }

    return this.http
      .delete(
        `https://272.selfip.net/apps/Np1xLyA6LS/collections/nuisances_collection/documents/${keyIdToDelete}/`
      )
      .pipe(
        tap(() => {
          this.nuisances = this.nuisances.filter(
            (n) => n.id !== nuisanceIdToBeDeleted
          );
          localStorage.setItem(
            'nuisanceKeyMap',
            JSON.stringify(Array.from(this.nuisanceKeyMap.entries()))
          );
          this.updateUniqueLocations();
          this.applySorting();
        }),
        map(() => this.nuisances),
        catchError((error) => {
          console.error('DELETE request error', error);
          return throwError(() => error);
        })
      );
  }

  getUniqueLocations(): Location_[] {
    return this.uniqueLocations;
  }

  private updateUniqueLocations() {
    const updatedLocations: Location_[] = [];

    this.nuisances.forEach((nuisance) => {
      const locationExists = updatedLocations.some(
        (loc) => loc.placeName === nuisance.location.placeName
      );
      if (!locationExists) {
        updatedLocations.push(nuisance.location);
      }
    });

    this.uniqueLocations = updatedLocations;
  }

  setCurrentSortMethod(method: string) {
    this.currentSortMethod = method;
    this.applySorting();
  }

  private applySorting() {
    switch (this.currentSortMethod) {
      case 'location':
        this.nuisances.sort((a, b) =>
          a.location.placeName.localeCompare(b.location.placeName)
        );
        break;
      case 'name':
        this.nuisances.sort((a, b) =>
          a.troublemakerName.localeCompare(b.troublemakerName)
        );
        break;
      case 'time':
        this.nuisances.sort(
          (a, b) =>
            new Date(a.timeReported).getTime() -
            new Date(b.timeReported).getTime()
        );
        break;
    }
  }

  setActiveSortButton(buttonId: string | null) {
    this.activeSortButton = buttonId;
  }

  getActiveSortButton(): string | null {
    return this.activeSortButton;
  }
}
