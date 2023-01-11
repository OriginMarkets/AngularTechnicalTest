import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoListResolver } from '../../core/resolvers/todo/todo-list.resolver';
import { EditTodoItemComponent } from './edit-todo-item/edit-todo-item.component';
import { TodoItemResolver } from '../../core/resolvers/todo/todo-item.resolver';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: TodoListComponent,
    resolve: [TodoListResolver],
  },
  {
    path: 'new',
    component: EditTodoItemComponent,
  },
  {
    path: ':id',
    component: EditTodoItemComponent,
    resolve: {item: TodoItemResolver},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
