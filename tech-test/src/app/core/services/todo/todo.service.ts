import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { TodoItemModel } from '../../models/todo-item.model';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private api = environment.api + '/tasks';

  items$: BehaviorSubject<TodoItemModel[]> = new BehaviorSubject<TodoItemModel[]>(null);

  constructor(
    private http: HttpClient,
  ) {
  }

  getAll(): Observable<TodoItemModel[]> {
    return this.http.get<TodoItemModel[]>(this.api).pipe(
      map(items => {
        const readyItems: TodoItemModel[] = items && items.map(item => new TodoItemModel(item)) || [];
        this.updateItemsList(readyItems);
        return readyItems;
      }),
    );
  }

  get(id: number): Observable<TodoItemModel> {
    return this.http.get<TodoItemModel>(`${this.api}/${id}`).pipe(
      map(item => new TodoItemModel(item))
    );
  }

  create(itemData: TodoItemModel): Observable<TodoItemModel> {
    return this.http.post<TodoItemModel>(this.api, itemData).pipe(
      map(item => new TodoItemModel(item)),
      withLatestFrom(this.items$),
      map(([item, existedItems]: [TodoItemModel, TodoItemModel[]]) => {
        const updatedItemsList = [item, ...existedItems];
        this.updateItemsList(updatedItemsList);
        return item;
      }),
    );
  }

  update(id: number, itemData): Observable<TodoItemModel> {
    return this.http.patch<TodoItemModel>(`${this.api}/${id}`, itemData).pipe(
      map(item => new TodoItemModel(item)),
      withLatestFrom(this.items$),
      map(([item, existedItems]: [TodoItemModel, TodoItemModel[]]) => {
        const updatedItemsList = existedItems.map(existed => item.id === existed.id ? item : existed);
        this.updateItemsList(updatedItemsList);
        return item;
      }),
    );
  }

  delete(id: number): Observable<TodoItemModel> {
    return this.http.delete<TodoItemModel>(`${this.api}/${id}`).pipe(
      withLatestFrom(this.items$),
      map(([item, existedItems]: [any, TodoItemModel[]]) => {
        const updatedItemsList = existedItems.filter(existed => id !== existed.id);
        this.updateItemsList(updatedItemsList);
        return item;
      }),
    );
  }

  private updateItemsList(list: TodoItemModel[]): void {
    this.items$.next(list);
  }
}
