import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import { LocalStorageService } from 'ngx-localstorage';
import { NTVoyagerApiWtp } from 'src/app/services/api.service';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { getCharData, getMarketData, getStockInfo } from 'src/app/reducers/market/market.selector';

@Component({
  selector: 'app-stockchart',
  templateUrl: './stockchart.component.html',
  styleUrls: ['./stockchart.component.css'],
})
export class StockchartComponent {
  chartData: any;
  pesk: any;
  root: any;
  stockChart: any;
  valueSeries: any;
  volumeSeries: any;
  
  constructor(
    private store: Store,
    private lss: LocalStorageService,
    private apiService: NTVoyagerApiWtp,
  ) {
    this.chartData = [];
  }
  
  ngOnInit() {
    this.root = am5.Root.new('chartdiv');
    var pesk: any = this.lss.get('siPesk');
    if(pesk){
      this.apiService.chartDataBasic(pesk, '200').subscribe((res: any) => {
        this.chartData = res;
        this.createChart()
      });
    }
    this.store.select(getStockInfo).subscribe((res) => {
      var pesk: any = this.lss.get('siPesk');
      if(pesk){
        this.apiService.chartDataBasic(pesk, '200').subscribe((res: any) => {
          if(this.root.container.children){
            this.root.container.children._onRemoved(this.stockChart)
          }
          this.chartData = res;
          this.createChart()
        });
      }
    });
    // this.store.select(getStockInfo).subscribe(
    //   (res) => {
    //     var pesk: any = this.lss.get('siPesk');
    //     if(pesk){
    //       this.apiService.chartDataBasic(pesk, '200').subscribe((res: any) => {
    //         console.log(res)
    //       });
    //     }
    //   }
    // )
  }

  createChart() {
    // Create a stock chart
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Instantiating_the_chart
    this.stockChart = this.root.container.children.push(
      am5stock.StockChart.new(this.root, {})
    );

    /**
     * Main (value) panel
     */

    // Create a main stock panel (chart)
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels
    let mainPanel = this.stockChart.panels.push(
      am5stock.StockPanel.new(this.root, {
        wheelY: 'zoomX',
        panX: true,
        panY: true,
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    let dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(this.root, {
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    this.valueSeries = mainPanel.series.push(
      am5xy.LineSeries.new(this.root, {
        name: 'STCK',
        valueXField: 'date',
        valueYField: 'closePrice',
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText: '{valueY}',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'horizontal',
          labelText: '{valueY}',
        }),
      })
    );

    this.valueSeries.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true,
    });

    this.valueSeries.set('fill', am5.color(0x00ff00));
    this.valueSeries.set('stroke', am5.color(0x00ff00));
    this.valueSeries.data.processor = am5.DataProcessor.new(this.root, {
      numericFields: ["closePrice"],
      dateFields: ["date"]
    });
    this.valueSeries.data.setAll(this.chartData);
    this.valueSeries.children.unshift(
      am5.Label.new(this.root, {
        text: 'Value',
      })
    );
    /**
     * Secondary (volume) panel
     */

    // Create a main stock panel (chart)
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels
    let volumePanel = this.stockChart.panels.push(
      am5stock.StockPanel.new(this.root, {
        wheelY: 'zoomX',
        panX: true,
        panY: true,
        height: am5.percent(30),
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let volumeValueAxis = volumePanel.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        numberFormat: '#.#a',
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    let volumeDateAxis = volumePanel.xAxes.push(
      am5xy.GaplessDateAxis.new(this.root, {
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    this.volumeSeries = volumePanel.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'STCK',
        valueXField: 'date',
        valueYField: 'volume',
        xAxis: volumeDateAxis,
        yAxis: volumeValueAxis,
        legendValueText: '{valueY}',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'horizontal',
          labelText: '{valueY}',
        }),
      })
    );
    this.volumeSeries.set('stroke', am5.color(0xff0000));
    this.volumeSeries.set('fill', am5.color(0xff0000));
    this.volumeSeries.children.unshift(
      am5.Label.new(this.root, {
        text: 'Volumn',
      })
    );
    this.volumeSeries.data.processor = am5.DataProcessor.new(this.root, {
      numericFields: ["volume"],
      dateFields: ["date"]
    });
    this.volumeSeries.data.setAll(this.chartData);

    // Set main value series
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
    this.stockChart.set('volumeSeries', this.volumeSeries);

    // Add cursor(s)
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    mainPanel.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        yAxis: valueAxis,
        xAxis: dateAxis,
        snapToSeries: [this.valueSeries],
        snapToSeriesBy: 'y!',
      })
    );

    volumePanel.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        yAxis: volumeValueAxis,
        xAxis: volumeDateAxis,
        snapToSeries: [this.volumeSeries],
        snapToSeriesBy: 'y!',
      })
    );
  }
}
