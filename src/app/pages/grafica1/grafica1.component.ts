import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Tomates', 'In-Store Sales', 'Mail-Order Sales'];
  public labels2: string[] = ['Tomates2', 'In-Store Sales', 'Mail-Order Sales'];
  public labels3: string[] = ['Tomates3', 'In-Store Sales', 'Mail-Order Sales'];
  public labels4: string[] = ['Tomates4', 'In-Store Sales', 'Mail-Order Sales'];
  public data1: number[] = [100, 450, 100];
  public data2: number[] = [200, 450, 100];
  public data3: number[] = [300, 450, 100];
  public data4: number[] = [400, 450, 100];
}
