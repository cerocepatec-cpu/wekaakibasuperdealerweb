import { Component, OnInit,Input,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-members-autocomplete',
  templateUrl: './members-autocomplete.component.html',
  styleUrls: ['./members-autocomplete.component.scss'],
})
export class MembersAutocompleteComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
   @Input() placeholder = 'Rechercher…';
  @Input() icon = 'search-outline';
  @Input() results: any[] = [];
  @Input() labelKey = 'name';
  @Input() subLabelKey = 'phone';

  @Output() search = new EventEmitter<string>();
  @Output() selectItem = new EventEmitter<any>();

  query = '';
  activeIndex = -1;
  isOpen = false;

  onInput(ev: any) {
    this.query = ev.target.value;
    this.activeIndex = -1;

    if (this.query.length >= 2) {
      this.isOpen = true;
      this.search.emit(this.query);
    } else {
      this.isOpen = false;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.results.length - 1
      );
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    }

    if (event.key === 'Enter' && this.activeIndex >= 0) {
      event.preventDefault();
      this.select(this.results[this.activeIndex]);
    }

    if (event.key === 'Escape') {
      this.close();
    }
  }

  select(item: any) {
    this.query = item[this.labelKey];
    this.isOpen = false;
    this.selectItem.emit(item);
  }

  close() {
    this.isOpen = false;
  }

  highlight(text: string) {
    if (!this.query) return text;

    return text.replace(
      new RegExp(this.query, 'gi'),
      match => `<span class="font-medium text-primary">${match}</span>`
    );
  }

}
