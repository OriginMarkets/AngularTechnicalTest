import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';

import { TodoService } from '../../services/todo/todo.service';


@Injectable({
  providedIn: 'root'
})
export class TodoItemResolver implements Resolve<boolean> {

  constructor(
    private todoService: TodoService,
    private router: Router,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id: number = route.params?.id;
    return this.todoService.get(id).pipe(
      filter(data => !!data),
      take(1),
      catchError(() => {
        this.router.navigate(['todo', 'list']);
        return EMPTY;
      }),
    );
  }
}
