import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, HostListener, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, CdkDragStart } from '@angular/cdk/drag-drop';
import { DataService } from '../services/data-service.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface IColumnResize {
  name: string;
  [key: string]: any;
}
interface IType {
  name?: any;
  proj_name?: any;
  client_name?: any;
  status?: any;
  type?: any;
  analysis_type?: any;
  comments?: any;
  owner?: any;
  created?: any;
  modified?: any;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-resizable-mat-grid',
  templateUrl: './resizable-mat-grid.component.html',
  styleUrls: ['./resizable-mat-grid.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ResizableMatGridComponent implements OnInit {

  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  columnsForFilter: IColumnResize[];
  analysesListDataSource: MatTableDataSource<any>;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  expandedElement: PeriodicElement | null;
  columnsToDisplay = new FormControl([...this.displayedColumns]);

  @ViewChildren(MatPaginator) queryPaginator: QueryList<MatPaginator>;
  paginator: MatPaginator;

  @ViewChildren(MatSort) querySort: QueryList<MatSort>;
  sort: MatSort;

  previousIndex: number;
  selectColumnToShow: string[];

  /**
   * Resize columns
   */
  @ViewChild(MatTable, { static: true, read: ElementRef }) private matTableRef: ElementRef;
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  thElm: any;
  startOffset: any;

  /**
   * For data API's
   */
  clientsIds: number[];
  offset = 0;
  limit = 30;
  sortBy = 'created';
  sortDir = 'desc';
  searchObj: any;
  analysesList: any[];
  totalAnalyses: number;
  initialAnalysesList: any[];
  tableName: string = 'analysesTable';
  columnList: any[];
  columnListHeaderValue: string[];
  columnListFilterValue: string[];
  filterModel: any = {};
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.setFilterColumns();
    this.selectColumnToShow = [...this.displayedColumns];

    // hide or show columns in table
    this.columnsToDisplay.valueChanges.subscribe(
      data => {
        this.displayedColumns = [...data];
        this.setFilterColumns();
      }
    );
    this.getClientIds();
    this.searchObj = this.createObject(this.filterModel);
  }

  ngAfterViewInit() {
    this.queryPaginator.changes.subscribe((com: QueryList<MatPaginator>) => {
      this.paginator = com.first;
      this.analysesListDataSource.paginator = this.paginator;
      //this.paginator.getNumberOfPages();
    });
    this.querySort.changes.subscribe((com: QueryList<MatSort>) => {
      this.sort = com.first;
      this.analysesListDataSource.sort = this.sort;
    });
    // this.boundColumnDraggerToTh();
    // this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  /**
   * To get clientIds
   */
  getClientIds(): any {

  // Get client ids
    // this.dataService.getClientIds().subscribe(res => {
    //   const clientList = [...res];
    //   this.clientsIds = clientList.map(val => val.id);
    //   this.getAnalyses();
    //   this.getTableColumnConfig();
    // });
  }

  /**
   * To get analyses data
   */
  getAnalyses() {
    this.dataService.getAnalyses(this.clientsIds, this.sortBy, this.sortDir, this.searchObj, this.offset, this.limit)
      .subscribe((data: any) => {
        if (data) {
          this.initialAnalysesList = data.data;
          this.totalAnalyses = data.totalAnalyses;
          this.analysesList = this.initialAnalysesList.map(val => val.data);
          this.analysesListDataSource = new MatTableDataSource<any>(this.analysesList);
        }
      });
  }

  /** To get table configuration object */
  getTableColumnConfig() {
    // GEt column config object
    // this.dataService.getTableColumnConfig(this.tableName).subscribe((colData: any) => {
    //   this.columnList = colData;
    //   this.columnListHeaderValue = this.columnList.map(val => val.value);
    //   this.columnListFilterValue = this.columnList.map(val => val.filterName);
    // });
  }

  createObject(objAnalysis) {
    return Object.keys(objAnalysis).reduce((f, c) => {
      if (objAnalysis[c] != '') {
        f[c] = this.filterModel[c];
      }
      return f;
    }, {});
  }

  /** Callback for sort change */
  sortChange(event) {
    this.sortBy = event.active;
    this.sortDir = event.direction;
    this.getAnalyses();
  }

  filterTable() {
    this.searchObj = this.createObject(this.filterModel);
    this.getAnalyses();
  }

  setFilterColumns() {
    this.columnsForFilter = this.displayedColumns.map(val => {
      return {
        name: `${val}-filter`
      };
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.analysesListDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.analysesListDataSource.data.forEach(row => this.selection.select(row));
  }

  isHidden(column: string) {
    return this.columnsToDisplay.value.indexOf(column) === -1;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  drag(event: CdkDragStart, index: number) {
    this.previousIndex = index;
  }


  drop(event: CdkDragDrop<string[]>, index: number) {
    moveItemInArray(this.columnListHeaderValue, this.previousIndex, index);
    moveItemInArray(this.columnListFilterValue, this.previousIndex, index);
    moveItemInArray(this.columnList, this.previousIndex, index);
  }
  /**
   * Return array for filter columns
   */
  get getFilterColumns() {
    return this.columnsForFilter.map(val => val.name);
  }



}
