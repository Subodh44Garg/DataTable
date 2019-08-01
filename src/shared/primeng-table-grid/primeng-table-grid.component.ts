import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CoreService, PeriodicElement } from '../services/core.service';

@Component({
  selector: 'app-primeng-table-grid',
  templateUrl: './primeng-table-grid.component.html',
  styleUrls: ['./primeng-table-grid.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class PrimengTableGridComponent implements OnInit {

  cols: any[];
  selectedColumns: any[];
  elements: PeriodicElement[];
  rowData: any;

  constructor(private coreService: CoreService) { }

  ngOnInit() {
    // this.cols = this.coreService.tableColumns;
    this.elements = this.coreService.tableRows;
    this.getDate();
  }
  getDate() {
    this.coreService.getData().subscribe(data => {
      this.rowData = data['data']['data'];
      this.getTableColumns(this.rowData[0]);
    });
  }

  getTableColumns(obj) {
    this.cols = Object.keys(obj.data);
    this.selectedColumns = [...this.cols];
  }
}
