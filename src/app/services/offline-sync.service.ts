import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfflineSyncService {
  private storageKey = 'offlineFormSubmissions';

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async saveFormData(formData: any) {
    let submissions = (await this.storage.get(this.storageKey)) || [];
    submissions.push(formData);
    await this.storage.set(this.storageKey, submissions);
  }

  getFormData(): Observable<any[]> {
    return from(this.storage.get(this.storageKey));
  }

  async syncWithServer() {
    let submissions = (await this.storage.get(this.storageKey)) || [];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Custom-Header': 'CustomHeaderValue',
    });

    for (let submission of submissions) {
      try {
        await this.http
          .post('https://offline-capable-form.free.beeceptor.com', submission, {
            headers,
          })
          .toPromise();
        submissions = submissions.filter((sub: any) => sub !== submission);
        await this.storage.set(this.storageKey, submissions);
      } catch (error) {
        console.error('Error syncing data with server:', error);
      }
    }
  }
}
