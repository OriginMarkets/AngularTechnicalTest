import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TodoService } from '../../../core/services/todo/todo.service';
import { TodoItemModel } from '../../../core/models/todo-item.model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  todos$: Observable<TodoItemModel[]> = this.todoService.items$;

  constructor(
    private todoService: TodoService,
    private router: Router,
  ) { }

  createItem() {
    this.router.navigate(['todo', 'new']);
  }
}
