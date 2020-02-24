import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Output} from '@angular/core';
import {fromEvent, isObservable, Observable, of, Subscription} from 'rxjs';
import {exhaustMap, take, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Directive({
  selector: '[appSingleClick]'
})
export class SingleClickDirective implements AfterViewInit, OnDestroy {

  @Input('appSingleClick')
  clickHandler?: () => any | Promise<any> | Observable<any>;

  private subscription = Subscription.EMPTY;

  constructor(private readonly el: ElementRef<HTMLButtonElement>) {
  }

  ngAfterViewInit() {
    this.subscription = fromEvent<MouseEvent>(this.el.nativeElement, 'click').pipe(
      tap((e) => {
        this.el.nativeElement.disabled = true;
      }),
      exhaustMap(() => {
        return this.wrapHandler().pipe(
          take(1),
        );
      }),
      tap(
        () => this.el.nativeElement.disabled = false,
        () => this.el.nativeElement.disabled = false,
        () => this.el.nativeElement.disabled = false,
      )
    ).subscribe((result) => {
      console.log('handler result (if any)', result);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private wrapHandler(): Observable<any> {
    if (!this.clickHandler) {
      return of(undefined);
    }

    if (typeof this.clickHandler !== 'function') {
      throw new Error('Single click handler must be a function!');
    }

    const result = this.clickHandler();

    let obs: Observable<any>;

    if (result.then && typeof result.then === 'function') {
      obs = fromPromise(result);
    } else if (isObservable(result)) {
      obs = result;
    } else {
      obs = of(result);
    }

    return obs.pipe(
      take(1)
    );
  }
}
