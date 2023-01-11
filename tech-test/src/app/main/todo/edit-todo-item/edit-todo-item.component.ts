import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReplaySubject, Subject } from 'rxjs';
import { switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';

import { TodoService } from '../../../core/services/todo/todo.service';
import { TodoItemModel } from '../../../core/models/todo-item.model';


@Component({
  selector: 'app-edit-todo-item',
  templateUrl: './edit-todo-item.component.html',
  styleUrls: ['./edit-todo-item.component.scss']
})
export class EditTodoItemComponent implements OnInit, OnDestroy {

  form: FormGroup;
  existedData: TodoItemModel;
  private destroy$: ReplaySubject<void> = new ReplaySubject<void>();
  private submit$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
  ) { }

  ngOnInit(): void {
    this.existedData = this.route.snapshot.data?.item;
    this.initForm();
    this.subscribeToSubmitEvent();
    this.patchForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.form = new FormGroup({
      label: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
  }

  patchForm() {
    if (this.existedData) {
      const patchData = {
        label: this.existedData.label,
        description: this.existedData.description,
        category: this.existedData.category,
      };
      this.form.setValue(patchData);
    }
  }

  submitForm() {
    this.submit$.next(true);
  }

  subscribeToSubmitEvent() {
    this.submit$.pipe(
      withLatestFrom(this.form.valueChanges),
      switchMap(([, formData]) => {
        const id: number = this.existedData && this.existedData.id;
        return id ? this.todoService.update(id, formData) : this.todoService.create(formData);
      }),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.navigateToList();
    });
  }

  navigateToList() {
    this.router.navigate(['todo', 'list']);
  }
}
