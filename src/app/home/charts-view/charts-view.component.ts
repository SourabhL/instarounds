import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-charts-view',
  styleUrls: ['./charts-view.component.scss'],
  templateUrl: './charts-view.component.html'
})
export class ChartsViewComponent implements OnInit, AfterViewInit {
  @Input() chartData: any;
  @Input() header: string;
  @Input() idthing: string;
  @Input() type: string;

  constructor() {

  }

  ngOnInit() {
    this.type = this.type ? this.type : 'pie';
  }

  ngAfterViewInit() {
    if (this.type && this.type === 'bar') {
      this.plotVerticalBarChart(this.chartData);
    } else {
      this.plotSimplePieChart(this.chartData);
    }
  }


  changeChartType(event: any) {
    console.log(event.target.value);
    if (event.target.value === 'pie') {
      this.plotSimplePieChart(this.chartData);
    } else if (event.target.value === 'bar') {
      this.plotVerticalBarChart(this.chartData);
    }
  }

  plotSimplePieChart(data: any) {
    const listData = [];
    data.pie[1].series.forEach((series, index) => {
      if (index === 0) {
        const obj = {
          name: series.adYear,
          y: Number(series.ptCount),
          sliced: true,
          selected: true
        };
        listData.push(obj);
      } else {
        const obj = {
          name: series.adYear,
          y: Number(series.ptCount)
        };
        listData.push(obj);
      }
    });
    console.log(listData);
    let myChart = HighCharts.chart(this.idthing, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
            style: {
              color: 'black'
            }
          }
        }
      },
      series: [{
        name: data.pie[0].plotOptions.titleText,
        colorByPoint: true,
        type: undefined,
        data: listData
      }]
    });
  }

  plotVerticalBarChart(data: any) {
    const listData = [];
    data.bar[0].series.data.forEach((series) => {
      listData.push(Number(series));
    });
    console.log(listData);
    let myChart = HighCharts.chart(this.idthing, {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: data.bar[0].series.xAxis
      },
      yAxis: {
        title: {
          text: data.bar[0].plotOptions.titleText + '  (%)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      series: [
        {
          name: data.bar[0].plotOptions.titleText,
          type: undefined,
          data: listData
        }
      ]
    });
  }
}
