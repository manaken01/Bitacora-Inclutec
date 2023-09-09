import {MatDialog} from '@angular/material/dialog';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Chart, Highcharts} from 'angular-highcharts';

import {ProjectsService} from '../../../services/projects.service';
import {WorklogService} from '../../../services/worklog.service';
import {EncryptService} from '../../../services/encrypt.service';
import {GraphicsConstants, Patterns} from '../../../common/graphics.constant';
import {CommonConstants} from '../../../common/common.constant';
import {LargeNotificationComponent} from '../../../utils/large-notification/large-notification.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public chart: Chart = new Chart();
  public typeChart: string;
  public typeSelected: string;
  public totalHours: any;
  public collaborators: string;

  public projectList: any;
  public charData: any;
  public years = [];
  public yearSelected: any;
  public phasesFilter: boolean;
  public personalFilter: boolean;
  public projectSelected: any;
  public projectName: string;
  public roleAdmin: boolean;
  public hideGraph: boolean;

  public highcharts;
  public chartOptions;
  public yAxis: any;
  public xAxis: any;
  public plotOptions: any;
  public titleStyle: any;
  public subtitleStyle: any;
  public backgroundStyle: any;
  public yAxisStyle: any;
  public xAxisStyle: any;
  public toolTipStyle: any;
  public itemStyle: any;
  public highContrast: any;
  public patthern: any;
  public seriesColor: any;
  public titleChart: any;
  public descriptionChart: string;
  public selectedOptionContrast: boolean;
  public selectedOptionPattern: boolean;
  Patterns: Patterns;

  /**
   * Constructor stadistics
   * @param ProjectService
   * @param encryptService
   * @param worklogService
   * @param dialog
   */
  constructor(
    private projectService: ProjectsService,
    private encryptService: EncryptService,
    private worklogService: WorklogService,
    public dialog: MatDialog,
  ) {
    this.totalHours = 0;
    this.collaborators = '';
    this.phasesFilter = false;
    this.personalFilter = false;
    this.hideGraph = false;
    this.roleAdmin = true;
    this.years = CommonConstants.years;
    this.yAxis = [];
    this.xAxis = [];
    this.highContrast = 'desactivado';
    this.patthern = 'desactivado';
    this.typeChart = 'column';
    this.typeSelected = 'column';
    this.plotOptions = GraphicsConstants.barPlotOptions;
    this.titleStyle = GraphicsConstants.initialStyle.titleStyle;
    this.subtitleStyle = GraphicsConstants.initialStyle.subtitleStyle;
    this.backgroundStyle = GraphicsConstants.initialStyle.backgroundStyle;
    this.yAxisStyle = GraphicsConstants.initialStyle.yAxis;
    this.xAxisStyle = GraphicsConstants.initialStyle.xAxis;
    this.toolTipStyle = GraphicsConstants.initialStyle.tooltipStyle;
    this.itemStyle = GraphicsConstants.initialStyle.itemStyle;
    this.seriesColor = '#207073';
    this.titleChart = '';
    this.descriptionChart = '';
    this.yearSelected = '';
    this.projectSelected = '';
    this.projectName = '';
    this.selectedOptionContrast = true;
    this.selectedOptionPattern = true;
    this.Patterns = new Patterns('custom-pattern');
  }

  ngOnInit() {
    this.projectsList();
    const currentDate = new Date();
    this.yearSelected = currentDate.getFullYear();
    this.totalCollaborators();
    this.loadGeneralChartData();
    this.displayChart();
    this.validateRole();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Validates the role of the user so it can display the option to see his personal or general data of the institution
   */
  validateRole() {
    const userRole = this.encryptService.desencrypt('role');
    if (userRole !== 'Administrador') {
      this.changedFilter(1);
      this.roleAdmin = false;
    }
  }

  /**
   * Gets all the projects for the users to choose which one filter
   */
  projectsList() {
    this.projectService
      .getAllProjects()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.projectList = response;
      });
  }
  /**
   * Gets the total of active collaborators on all projects
   */
  totalCollaborators() {
    this.worklogService
      .getTotalCollaborators()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.collaborators = response.toString();
      });
  }
  /**
   * Gets the total of active collaborators on all projects
   */
  collaboratorsPerProject(idProject) {
    this.worklogService
      .getCollaboratorsPerProject(idProject)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.collaborators = response.toString();
      });
  }

  changedFilter(filter) {
    if (filter == 0 || filter == 2) {
      this.personalFilter = false;
      if (!this.phasesFilter) {
        this.loadGeneralChartData();
      } else {
        this.filterGeneralChartData();
      }
    } else {
      this.personalFilter = true;
      if (!this.phasesFilter) {
        this.loadPersonalChartData();
      } else {
        this.filterPersonalChartData();
      }
    }
  }

  /**
   * Changes the year to the one selected
   * @param year
   */
  yearChanged(year: any) {
    const currentDate = new Date();
    if (year != 0) {
      this.yearSelected = year;
    } else {
      this.yearSelected = currentDate.getFullYear();
    }
    if (!this.phasesFilter) {
      if (this.personalFilter) {
        this.loadPersonalChartData();
      } else {
        this.loadGeneralChartData();
      }
    } else {
      if (this.personalFilter) {
        this.filterPersonalChartData();
      } else {
        this.filterGeneralChartData();
      }
    }
  }
  /**
   * Changes the year to the one selected
   * @param year
   */
  projectChanged(project: any) {
    this.projectSelected = project;
    if (project == 0) {
      this.phasesFilter = false;
      this.totalCollaborators();
      if (this.personalFilter) {
        this.loadPersonalChartData();
      } else {
        this.loadGeneralChartData();
      }
    } else {
      this.phasesFilter = true;
      this.findProjectName(this.projectSelected);
      this.collaboratorsPerProject(project);
      if (this.personalFilter) {
        this.filterPersonalChartData();
      } else {
        this.filterGeneralChartData();
      }
    }
  }

  /**
   * Returns the name of the project based on the id it gets
   */
  findProjectName(idProject) {
    this.projectList.forEach((project) => {
      if (project.idProjectsPk == idProject) {
        this.projectName = project.projectName;
      }
    });
  }

  /**
   * Changes the constrast option.
   */
  changeOptionsConstrast() {
    if (this.selectedOptionContrast) {
      this.highContrast = 'activado';
      this.setOptionConstrast();
      this.selectedOptionContrast = false;
    } else {
      this.highContrast = 'desactivado';
      this.reverseChartConstrast();
      this.selectedOptionContrast = true;
    }
  }

  /**
   * Set the styles options of the chart to the ones with hightcontrast
   */
  setOptionConstrast() {
    this.titleStyle = GraphicsConstants.highContrast.titleStyle;
    this.subtitleStyle = GraphicsConstants.highContrast.subtitleStyle;
    this.backgroundStyle = GraphicsConstants.highContrast.backgroundStyle;
    this.yAxisStyle = GraphicsConstants.highContrast.yAxis;
    this.xAxisStyle = GraphicsConstants.highContrast.xAxis;
    this.toolTipStyle = GraphicsConstants.highContrast.tooltipStyle;
    this.itemStyle = GraphicsConstants.highContrast.itemStyle;
    this.seriesColor = '';
    this.displayChart();
  }

  /**
   * Reverse all the style properties of the chart to the initial one.
   */
  reverseChartConstrast() {
    const blackColor = 'black';
    const greenColor = '#207073';
    GraphicsConstants.initialStyle.titleStyle.color = blackColor;
    this.titleStyle = GraphicsConstants.initialStyle.titleStyle;
    GraphicsConstants.initialStyle.subtitleStyle.color = blackColor;
    this.subtitleStyle = GraphicsConstants.initialStyle.subtitleStyle;
    GraphicsConstants.initialStyle.yAxis.color = blackColor;
    this.yAxisStyle = GraphicsConstants.initialStyle.yAxis;
    GraphicsConstants.initialStyle.xAxis.color = blackColor;
    this.xAxisStyle = GraphicsConstants.initialStyle.xAxis;
    GraphicsConstants.initialStyle.tooltipStyle.color = blackColor;
    this.toolTipStyle = GraphicsConstants.initialStyle.tooltipStyle;
    GraphicsConstants.initialStyle.itemStyle.color = blackColor;
    this.itemStyle = GraphicsConstants.initialStyle.itemStyle;
    this.seriesColor = greenColor;
    this.displayChart();
  }

  /**
   * Changes the options of patterns also know as texture
   */
  changeOptionsPattern() {
    if (this.selectedOptionPattern) {
      this.patthern = 'activado';
      this.selectedOptionPattern = false;
      if (!this.phasesFilter) {
        if (this.personalFilter) {
          this.loadPersonalChartData();
        } else {
          this.loadGeneralChartData();
        }
      } else {
        if (this.personalFilter) {
          this.filterPersonalChartData();
        } else {
          this.filterGeneralChartData();
        }
      }
    } else {
      this.patthern = 'desactivado';
      this.selectedOptionPattern = true;
      if (!this.phasesFilter) {
        if (this.personalFilter) {
          this.loadPersonalChartData();
        } else {
          this.loadGeneralChartData();
        }
      } else {
        if (this.personalFilter) {
          this.filterPersonalChartData();
        } else {
          this.filterGeneralChartData();
        }
      }
    }
  }

  /**
   * Process the data for the yAxis of the graph and also sets the pattern.
   * @param charData
   */
  processPattern(charData) {
    this.xAxis = [];
    this.yAxis = [];
    let data;
    charData.forEach((element, index) => {
      this.xAxis.push(element.projectName);
      data = {
        name: element.projectName,
        y: element.hours,
        color:
          this.patthern == 'activado'
            ? `url(#highcharts-default-pattern-${index})`
            : this.seriesColor,
      };
      this.yAxis.push(data);
    });
    this.displayChart();
  }

  /**
   * Gets the data to load into the chart with all active projects
   */
  loadGeneralChartData() {
    this.totalHours = 0;
    const startDate = this.yearSelected + '/1/1';
    const endDate = this.yearSelected + '/12/31';
    this.titleChart = 'Horas por proyecto en el año ' + this.yearSelected;
    this.worklogService
      .getGeneralGraph(startDate, endDate)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.charData = response;
        if (response.length > 0) {
          this.hideGraph = false;
          response.forEach((val) => {
            this.totalHours += val.hours;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2,
          );
          this.chartTypeChange(this.typeSelected);
        } else {
          this.hideGraph = true;
          this.openNotificacition(
            'No se encontraron registros sobre algún proyecto en el año seleccionado.',
            'Sin registros',
            'warning',
          );
        }
      });
  }

  /**
   * Gets the data to load into the chart with the user active projects
   */
  loadPersonalChartData() {
    this.totalHours = 0;
    const startDate = this.yearSelected + '/1/1';
    const endDate = this.yearSelected + '/12/31';
    this.titleChart = 'Horas por proyecto en el año ' + this.yearSelected;
    const idUser = this.encryptService.desencrypt('idUser');
    this.worklogService
      .getPersonalGraph(idUser, startDate, endDate)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.charData = response;
        if (response.length > 0) {
          this.hideGraph = false;
          response.forEach((val) => {
            this.totalHours += val.hours;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2,
          );
          this.chartTypeChange(this.typeSelected);
        } else {
          this.hideGraph = true;
          this.openNotificacition(
            'No se encontraron registros en el año seleccionado.',
            'Sin registros',
            'warning',
          );
        }
      });
  }
  /**
   * Filters the general data of all projects
   */
  filterGeneralChartData() {
    this.totalHours = 0;
    const startDate = this.yearSelected + '/1/1';
    const endDate = this.yearSelected + '/12/31';
    this.titleChart =
      'Horas por fase de ' +
      this.projectName +
      ' en el año ' +
      this.yearSelected;
    this.worklogService
      .getFilterGeneralGraph(startDate, endDate, this.projectSelected)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.charData = response;
        if (response.length > 0) {
          this.hideGraph = false;
          response.forEach((val) => {
            this.totalHours += val.hours;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2,
          );
          this.chartTypeChange(this.typeSelected);
        } else {
          this.hideGraph = true;
          this.openNotificacition(
            `No se encontraron registros en el proyecto ${this.projectName}`,
            'Sin registros',
            'warning',
          );
        }
      });
  }

  /**
   * Filters the general data of all projects
   */
  filterPersonalChartData() {
    this.totalHours = 0;
    const startDate = this.yearSelected + '/1/1';
    const endDate = this.yearSelected + '/12/31';
    const idUser = this.encryptService.desencrypt('idUser');
    this.titleChart =
      'Horas por fase de ' +
      this.projectName +
      ' en el año ' +
      this.yearSelected;
    this.worklogService
      .getFilterPersonalGraph(idUser, startDate, endDate, this.projectSelected)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((response) => {
        this.charData = response;
        if (response.length > 0) {
          this.hideGraph = false;
          response.forEach((val) => {
            this.totalHours += val.hours;
          });
          this.totalHours = (Math.round(this.totalHours * 100) / 100).toFixed(
            2,
          );
          this.chartTypeChange(this.typeSelected);
        } else {
          this.hideGraph = true;
          this.openNotificacition(
            `No se encontraron registros en el proyecto ${this.projectName}`,
            'Sin registros',
            'warning',
          );
        }
      });
  }

  /**
   * Gets the type of chart that has been selected and it defines the plotOptions of the
   * chart based on its type and the type itself, and process the data so it can be valid to the type chart.
   * It also stores the type selected.
   * @param type
   */
  chartTypeChange(type: any) {
    this.typeSelected = type;
    if (type == 'pie') {
      this.typeChart = 'pie';
      this.plotOptions = GraphicsConstants.piePlotOptions;
      if (!this.phasesFilter) {
        this.processPieProject(this.charData);
      } else {
        this.processPiePhases(this.charData);
      }
    }
    if (type == 'donut') {
      this.typeChart = 'pie';
      this.plotOptions = GraphicsConstants.donutPlotOptions;
      if (!this.phasesFilter) {
        this.processPieProject(this.charData);
      } else {
        this.processPiePhases(this.charData);
      }
    }
    if (type == 'bar') {
      this.typeChart = 'bar';
      this.plotOptions = GraphicsConstants.barPlotOptions;
      if (!this.phasesFilter) {
        this.processDataProjects(this.charData);
      } else {
        this.processDataPhases(this.charData);
      }
    }
    if (type == 'column') {
      this.typeChart = 'column';
      this.plotOptions = GraphicsConstants.columnPlotOptions;
      if (!this.phasesFilter) {
        this.processDataProjects(this.charData);
      } else {
        this.processDataPhases(this.charData);
      }
    }
  }

  /**
   * Fills the xAxis and yAxis with the data of 'chartData'
   * @param charData
   */
  processDataProjects(charData: any) {
    this.xAxis = [];
    this.yAxis = [];
    let data;
    charData.forEach((element, index) => {
      this.xAxis.push(element.projectName);
      data = {
        name: element.projectName,
        y: element.hours,
        color:
          this.patthern == 'activado'
            ? `url(#highcharts-default-pattern-${index})`
            : this.seriesColor,
      };
      this.yAxis.push(data);
    });
    this.createDescription();
    this.displayChart();
  }
  /**
   * Fills the xAxis and yAxis with the data of 'chartData'
   * @param charData
   */
  processDataPhases(charData: any) {
    this.xAxis = [];
    this.yAxis = [];
    let data;
    charData.forEach((element, index) => {
      this.xAxis.push(element.phaseName);
      data = {
        name: element.phaseName,
        y: element.hours,
        color:
          this.patthern == 'activado'
            ? `url(#highcharts-default-pattern-${index})`
            : this.seriesColor,
      };
      this.yAxis.push(data);
    });
    this.createDescription();
    this.displayChart();
  }

  /**
   * Fills the xAxis and yAxis with the data of 'chartData' in a way thats its
   * sorted so the view of the graph pie and donut look good
   * @param charData
   */
  processPieProject(charData: any) {
    this.xAxis = [];
    this.yAxis = [];
    let data;
    charData.forEach((element, index) => {
      data = {
        name: element.projectName,
        y: element.hours,
        color:
          this.patthern == 'activado'
            ? `url(#highcharts-default-pattern-${index})`
            : '',
      };
      this.yAxis.push(data);
    });
    this.createDescription();
    this.displayChart();
  }
  /**
   * Fills the xAxis and yAxis with the data of 'chartData' in a way thats its
   * sorted so the view of the graph pie and donut look good
   * @param charData
   */
  processPiePhases(charData: any) {
    this.xAxis = [];
    this.yAxis = [];
    let data;
    charData.forEach((element, index) => {
      data = {
        name: element.phaseName,
        y: element.hours,
        color:
          this.patthern == 'activado'
            ? `url(#highcharts-default-pattern-${index})`
            : '',
      };
      this.yAxis.push(data);
    });
    this.createDescription();
    this.displayChart();
  }
  /**
   * Defines all of the chart properties
   */
  displayChart() {
    this.highcharts = Highcharts;
    let chart = new Chart({
      defs: this.Patterns.def,
      chart: {
        type: this.typeChart,
        description: this.descriptionChart,
        backgroundColor:
          this.highContrast == 'activado' ? this.backgroundStyle : 'white',
      },
      title: {
        text: this.titleChart,
        style: this.titleStyle,
      },
      subtitle: {
        text: 'Horas empleadas',
        style: this.subtitleStyle,
      },
      credits: {
        text: 'IncluTec',
        href: 'https://www.tec.ac.cr/inclutec',
      },
      accessibility: {
        enabled: true,
        describeSingleSeries: true,
      },
      xAxis: {
        categories: this.xAxis,
        crosshair: true,
        labels: {
          style: this.xAxisStyle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Horas',
        },
        labels: {
          style: this.yAxisStyle,
        },
      },
      tooltip: {
        borderColor: this.highContrast == 'activado' ? 'white' : '',
        backgroundColor:
          this.highContrast == 'activado'
            ? 'rgba(0, 0, 0, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} h</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
        style: this.toolTipStyle,
      },
      plotOptions: this.plotOptions,
      series: [
        {
          name: 'Horas invertidas',
          data: this.yAxis,
        },
      ],
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS',
            ],
          },
        },
      },
    });
    this.chart = chart;
  }

  /**
   * Create the description of the charts thats displaying at the moment
   */
  createDescription() {
    const dataOrdered = this.getHighestData(this.charData);
    const graphicName = this.getGraphicName(this.typeChart);
    let highest = '';
    let highestHours = '';
    let filterWord;
    if (!this.phasesFilter) {
      filterWord = 'proyecto';
      if (dataOrdered.length > 0) {
        highest = dataOrdered[0].projectName;
        highestHours = dataOrdered[0].hours;
      }
    } else {
      filterWord = 'fases del proyecto: ' + this.projectName;
      if (dataOrdered.length > 0) {
        highest = dataOrdered[0].phaseName;
        highestHours = dataOrdered[0].hours;
      }
    }
    this.descriptionChart = `Se presenta un gŕafico de ${graphicName} que compara las horas invertidas por ${filterWord}. 
    El mayor es ${highest} con ${highestHours} horas. Seguido de `;
    if (!this.phasesFilter) {
      dataOrdered.slice(1, dataOrdered.length).forEach((element) => {
        this.descriptionChart += `${element.projectName} con ${element.hours} horas, `;
      });
    } else {
      dataOrdered.slice(1, dataOrdered.length).forEach((element) => {
        this.descriptionChart += `${element.phaseName} con ${element.hours} horas, `;
      });
    }
  }

  /**
   * Returns the name of the graph based on its type
   * @param graphicName
   */
  getGraphicName(graphicName) {
    if (graphicName == 'pie') {
      return 'pastel';
    } else if (graphicName == 'donut') {
      return 'dona';
    } else if (graphicName == 'bar') {
      return 'barras';
    } else if (graphicName == 'column') {
      return 'columnas';
    }
  }

  /**
   * Gets the highest value of the array
   * @param pJson
   */
  getHighestData(pJson): [any] {
    return pJson.sort((n1, n2) => n2.hours - n1.hours);
  }

  /**
   * Opens the large notification modal and sends the properties
   * @param message
   * @param title
   * @param type
   */
  openNotificacition(message, title, type) {
    const dialogRef = this.dialog.open(LargeNotificationComponent, {
      width: '650px',
      data: {
        title: title,
        message: message,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
