export class TodoItemModel {
  category: string = null;
  description: string = null;
  done: string | boolean = null;
  label: string = null;
  id?: number = null;

  constructor(obj?) {
    for (const field in obj) {
      if (typeof this[field] !== 'undefined') {
        this[field] = obj && obj[field];
      }
    }
  }
}
