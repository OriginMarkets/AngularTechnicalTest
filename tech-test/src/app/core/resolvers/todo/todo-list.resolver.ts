import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';

import { TodoService } from '../../services/todo/todo.service';
import { map, switchMap, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TodoListResolver implements Resolve<boolean> {

  constructor(
    private todoService: TodoService,
  ) {
  }

  resolve(): Observable<boolean> {
    return this.todoService.items$.pipe(
      take(1),
      map(items => !!items),
      switchMap((isLoaded: boolean) => {
        return isLoaded ? of(true) : this.todoService.getAll().pipe(
          map(items => !!items),
          take(1)
        );
      }),
    );
  }
}
