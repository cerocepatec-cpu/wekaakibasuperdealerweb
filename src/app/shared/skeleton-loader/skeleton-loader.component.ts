import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent implements OnInit {
@Input() repeat: number = 4;
@Input() type: 'list' | 'horizontal' | 'grid' = 'list';
  constructor() { }

  ngOnInit() {}

}
