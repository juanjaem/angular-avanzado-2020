import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() titulo: string = 'Sin Título';
  // tslint:disable-next-line: no-input-rename
  @Input('labels') doughnutChartLabels: Label[] = [];
  // tslint:disable-next-line: no-input-rename
  @Input('data') doughnutChartData: MultiDataSet[] = [];

  public doughnutChartType: ChartType = 'doughnut';

  public colors: Color [] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];

}
