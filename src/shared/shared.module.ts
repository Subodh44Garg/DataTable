import { NgModule } from '@angular/core';
import { MatTableGridComponent } from './mat-table-grid/mat-table-grid.component';
import { CustomMatTheme } from '../themes/mat.theme';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterColumnsPipe } from './filter-columns.pipe';
import { TreeTableModule } from 'primeng/treetable';
import { MultiSelectModule } from 'primeng/multiselect';
import { PrimengTableGridComponent } from './primeng-table-grid/primeng-table-grid.component';
import { TableColumnResizerDirective } from './directives/table-column-resizer.directive';
import { ResizableMatGridComponent } from './resizeable-mat-grid/resizable-mat-grid.component';
import { ResizableDirective } from './directives/resizable.directive';

@NgModule({
  imports: [CommonModule, CustomMatTheme, ReactiveFormsModule, TreeTableModule, MultiSelectModule, FormsModule],
  declarations: [MatTableGridComponent, FilterColumnsPipe, PrimengTableGridComponent,
    TableColumnResizerDirective, ResizableDirective, ResizableMatGridComponent],
  exports: [MatTableGridComponent, PrimengTableGridComponent, FilterColumnsPipe,
    TableColumnResizerDirective, ResizableDirective, ResizableMatGridComponent,FormsModule]
})
export class SharedModule { }
