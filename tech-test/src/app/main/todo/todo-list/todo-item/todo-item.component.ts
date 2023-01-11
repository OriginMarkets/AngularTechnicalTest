import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ReplaySubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { TodoItemModel } from '../../../../core/models/todo-item.model';
import { TodoService } from '../../../../core/services/todo/todo.service';


@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit, OnDestroy {

  @Input() item: TodoItemModel;

  private destroy$: ReplaySubject<void> = new ReplaySubject<void>();
  private editItem$: Subject<'delete' | 'donePatch'> = new Subject<'delete' | 'donePatch'>();

  constructor(
    private router: Router,
    private todoService: TodoService,
  ) {
  }

  ngOnInit(): void {
    this.editItem$.pipe(
      switchMap((type) => {
        if (type === 'delete') {
          return this.todoService.delete(this.item.id);
        }
        const done = this.item.done ? false : new Date().toUTCString() ;
        return this.todoService.update(this.item.id, {done});
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteItem() {
    this.editItem$.next('delete');
  }

  toggleItemDone() {
    this.editItem$.next('donePatch');
  }

  editItem() {
    this.router.navigate(['todo', this.item.id]);
  }
}
