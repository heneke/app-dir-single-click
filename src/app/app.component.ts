import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app-dir-single-click';

  longRunningObservable(): Observable<string> {
    return of('*** i was created in an observable ***').pipe(
      delay(5000),
    );
  }

  longRunningPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('*** i was created in a promise ***');
      }, 5000);
    });
  }

  syncOperation() {
    return '*** i was created in a sync operation ***';
  }
}
