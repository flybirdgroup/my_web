---
id: bigquery_presentation
title: google script + excel+ google drive
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [script, excel, google]
---
### 我们的目标是创建一个脚本可以读取数据,导出成表格形式而且制作出图标,最后做成一个ppt幻灯演示,看起来是不是很牛,这些动作只需要写个脚本就能完成啦

#### 请看演示
<!--truncate-->
#### 我们进入script.google.com,点击getting started,然后再点击Apps script
![png](../img/bigquery/bigquery_presentation/1.png)

#### 我们进入scripts中,我们可以改名成slides demo
![png](../img/bigquery/bigquery_presentation/2.png)

#### 然后我们去到控制台查看big query api 是否已经启动
#### 确认后,我们点击Resources的advanced google services
![png](../img/bigquery/bigquery_presentation/3.png)

#### 我们开启BigQuery API服务
![png](../img/bigquery/bigquery_presentation/4.png)

#### 修改代码文件名字,改成bs-sheets-slides.gs
这里用得是javascript来写
![png](../img/bigquery/bigquery_presentation/5.png)
具体代码如下
```javascript
/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Filename for data results
var QUERY_NAME = "Most common words in all of Shakespeare's works";
// Replace this value with your Google Cloud API project ID
var PROJECT_ID = '<YOUR_PROJECT_ID>';
if (!PROJECT_ID) throw Error('Project ID is required in setup');

/**
 * Runs a BigQuery query; puts results into Sheet. You must enable
 * the BigQuery advanced service before you can run this code.
 * @see http://developers.google.com/apps-script/advanced/bigquery#run_query
 * @see http://github.com/gsuitedevs/apps-script-samples/blob/master/advanced/bigquery.gs
 *
 * @returns {Spreadsheet} Returns a spreadsheet with BigQuery results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 */
function runQuery() {
  // Replace sample with your own BigQuery query.
  var request = {
    query:
        'SELECT ' +
            'LOWER(word) AS word, ' +
            'SUM(word_count) AS count ' +
        'FROM [bigquery-public-data:samples.shakespeare] ' +
        'GROUP BY word ' +
        'ORDER BY count ' +
        'DESC LIMIT 10'
  };
  var queryResults = BigQuery.Jobs.query(request, PROJECT_ID);
  var jobId = queryResults.jobReference.jobId;

  // Wait for BQ job completion (with exponential backoff).
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId);
  }

  // Get all results from BigQuery.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  // Return null if no data returned.
  if (!rows) {
    return Logger.log('No rows returned.');
  }

  // Create the new results spreadsheet.
  var spreadsheet = SpreadsheetApp.create(QUERY_NAME);
  var sheet = spreadsheet.getActiveSheet();

  // Add headers to Sheet.
  var headers = queryResults.schema.fields.map(function(field) {
    return field.name.toUpperCase();
  });
  sheet.appendRow(headers);

  // Append the results.
  var data = new Array(rows.length);
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].f;
    data[i] = new Array(cols.length);
    for (var j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v;
    }
  }

  // Start storing data in row 2, col 1
  var START_ROW = 2;      // skip header row
  var START_COL = 1;
  sheet.getRange(START_ROW, START_COL, rows.length, headers.length).setValues(data);

  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());
}
```
该查询通过查看莎士比亚的作品（属于 BigQuery的公共数据集），得出他所有作品中出现次数最多的前10个单词，并按流行程度从高到低排序。试想一下，手动执行此操作会有多大的乐趣，您应该对BigQuery的有用性有所了解。
### 点击runQuery运行,期间可能需要需要授权认证
![png](../img/bigquery/bigquery_presentation/6.png)
![png](../img/bigquery/bigquery_presentation/7.png)

### 成功运行后,我们可以去drive.google.com中找到excel表格的url链接,点击Most common words那块条框
![png](../img/bigquery/bigquery_presentation/8.png)

### 点击进入后,我们可以看到bigquery的公共集查询的数据现在用表格形式出现了
![png](../img/bigquery/bigquery_presentation/9.png)

### 我们可以去big query 用sql语句操作一遍,得到的数据也很excel表格一样
![png](../img/bigquery/bigquery_presentation/10.png)

### 下一步,我们要通过数据创建图表📈
##### 1 到目前为止,我们编写了一个查询莎士比亚的应用程序,进行了排序,然后将结构显示在表格中,我们现在要createColumnChart()功能,{在最后一行代码之后}bq-sheets-slides.gsrunQuery()
```
/**
 * Uses spreadsheet data to create columnar chart.
 * @param {Spreadsheet} Spreadsheet containing results data
 * @returns {EmbeddedChart} visualizing the results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/embedded-chart
 */
function createColumnChart(spreadsheet) {
  // Retrieve the populated (first and only) Sheet.
  var sheet = spreadsheet.getSheets()[0];
  // Data range in Sheet is from cell A2 to B11
  var START_CELL = 'A2';  // skip header row
  var END_CELL = 'B11';
  // Place chart on Sheet starting on cell E5.
  var START_ROW = 5;      // row 5
  var START_COL = 5;      // col E
  var OFFSET = 0;

  // Create & place chart on the Sheet using above params.
  var chart = sheet.newChart()
     .setChartType(Charts.ChartType.COLUMN)
     .addRange(sheet.getRange(START_CELL + ':' + END_CELL))
     .setPosition(START_ROW, START_COL, OFFSET, OFFSET)
     .build();
  sheet.insertChart(chart);
}
```
#### 2 返回电子表格:在上面的代码中, createColumnChart()函数需要电子表格对象,因此调整应用程序以返回spreadsheet对象,以便可以将其传递给createColumnChart().所以我们在runQuery()函数最后一行添加一下代码
```
Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());

  // Return the spreadsheet object for later use.
  return spreadsheet;
}
```
#### 3 执行createBigQueryPresentation()功能,我们把BigQuery和chart-creation 功能分开是不错的注意.我们可以创建一个createBigQueryPresentation()功能去驱动app,调用两者和调用createColumnChart()函数
```
/**
 * Runs a BigQuery query, adds data and a chart in a Sheet.
 */
function createBigQueryPresentation() {
  var spreadsheet = runQuery();
  createColumnChart(spreadsheet);
}
```
我们把这块代码放到以下代码下面
```
// Filename for data results
var QUERY_NAME = "Most common words in all of Shakespeare's works";
// Replace this value with your Google Cloud API project ID
var PROJECT_ID = 'project-id-4323960745859879834';
if (!PROJECT_ID) throw Error('Project ID is required in setup');
```

### 为了使得代码可以复用性,我们有两步要做
1: 返回spreadsheet对象
2: 创建一个驱动函数
同时如果一个同事需要复用runQuery()函数,但是不想要连接登录呢
我们可以代码修改一下,具体如下:
```javascript
/**
 * Runs a BigQuery query, adds data and a chart in a Sheet.
 */
function createBigQueryPresentation() {
  var spreadsheet = runQuery();
  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());
  createColumnChart(spreadsheet);
}
```
#### 具体呈现如下:

![png](../img/bigquery/bigquery_presentation/11.png)

整段代码具体如下:
``` javascript
/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Filename for data results
var QUERY_NAME = "Most common words in all of Shakespeare's works";
// Replace this value with your Google Cloud API project ID
var PROJECT_ID = 'qwiklabs-gcp-5c0cf6ad321746e4';
if (!PROJECT_ID) throw Error('Project ID is required in setup');

/**
 * Runs a BigQuery query, adds data and a chart in a Sheet.
 */
function createBigQueryPresentation() {
  var spreadsheet = runQuery();
  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());
  createColumnChart(spreadsheet);
}

/**
 * Runs a BigQuery query; puts results into Sheet. You must enable
 * the BigQuery advanced service before you can run this code.
 * @see http://developers.google.com/apps-script/advanced/bigquery#run_query
 * @see http://github.com/gsuitedevs/apps-script-samples/blob/master/advanced/bigquery.gs
 *
 * @returns {Spreadsheet} Returns a spreadsheet with BigQuery results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 */
function runQuery() {
  // Replace sample with your own BigQuery query.
  var request = {
    query:
        'SELECT ' +
            'LOWER(word) AS word, ' +
            'SUM(word_count) AS count ' +
        'FROM [bigquery-public-data:samples.shakespeare] ' +
        'GROUP BY word ' +
        'ORDER BY count ' +
        'DESC LIMIT 10'
  };
  var queryResults = BigQuery.Jobs.query(request, PROJECT_ID);
  var jobId = queryResults.jobReference.jobId;

  // Wait for BQ job completion (with exponential backoff).
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId);
  }

  // Get all results from BigQuery.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  // Return null if no data returned.
  if (!rows) {
    return Logger.log('No rows returned.');
  }

  // Create the new results spreadsheet.
  var spreadsheet = SpreadsheetApp.create(QUERY_NAME);
  var sheet = spreadsheet.getActiveSheet();

  // Add headers to Sheet.
  var headers = queryResults.schema.fields.map(function(field) {
    return field.name.toUpperCase();
  });
  sheet.appendRow(headers);

  // Append the results.
  var data = new Array(rows.length);
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].f;
    data[i] = new Array(cols.length);
    for (var j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v;
    }
  }

  // Start storing data in row 2, col 1
  var START_ROW = 2;      // skip header row
  var START_COL = 1;
  sheet.getRange(START_ROW, START_COL, rows.length, headers.length).setValues(data);

  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());

  // Return the spreadsheet object for later use.
  return spreadsheet;
}

/**
 * Uses spreadsheet data to create columnar chart.
 * @param {Spreadsheet} Spreadsheet containing results data
 * @returns {EmbeddedChart} visualizing the results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/embedded-chart
 */
function createColumnChart(spreadsheet) {
  // Retrieve the populated (first and only) Sheet.
  var sheet = spreadsheet.getSheets()[0];
  // Data range in Sheet is from cell A2 to B11
  var START_CELL = 'A2';  // skip header row
  var END_CELL = 'B11';
  // Place chart on Sheet starting on cell E5.
  var START_ROW = 5;      // row 5
  var START_COL = 5;      // col E
  var OFFSET = 0;

  // Create & place chart on the Sheet using above params.
  var chart = sheet.newChart()
     .setChartType(Charts.ChartType.COLUMN)
     .addRange(sheet.getRange(START_CELL + ':' + END_CELL))
     .setPosition(START_ROW, START_COL, OFFSET, OFFSET)
     .build();
  sheet.insertChart(chart);
}
```

然后我们通过选run-createBigQueryPresentation()函数,我们去到google drive去看我们表格,图片

最后一部分,我们将创建一个新的google ppt,然后再标题幻灯片上填充标题和副标题,然后添加2张新slide,一个用于数据单元格,另外一个用于图表
#### 1 创建幻灯片
``` javascript
/**
 * Create presentation with spreadsheet data & chart
 * @param {Spreadsheet} Spreadsheet with results data
 * @param {EmbeddedChart} Sheets chart to embed on slide
 * @returns {Presentation} Slide deck with results
 */
function createSlidePresentation(spreadsheet, chart) {
  // Create the new presentation.
  var deck = SlidesApp.create(QUERY_NAME);

  // Populate the title slide.
  var [title, subtitle] = deck.getSlides()[0].getPageElements();
  title.asShape().getText().setText(QUERY_NAME);
  subtitle.asShape().getText().setText('via GCP and G Suite APIs:\n' +
    'Google Apps Script, BigQuery, Sheets, Slides');
```

#### 2 添加数据表: 我们通过createSlidePresentation()把单元格数据从google表格导入我们的新ppt中
``` java
  // Data range to copy is from cell A1 to B11
  var START_CELL = 'A1';  // include header row
  var END_CELL = 'B11';
  // Add the table slide and insert an empty table on it of
  // the dimensions of the data range; fails if Sheet empty.
  var tableSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  var sheetValues = spreadsheet.getSheets()[0].getRange(
      START_CELL + ':' + END_CELL).getValues();
  var table = tableSlide.insertTable(sheetValues.length, sheetValues[0].length);

  // Populate the table with spreadsheet data.
  for (var i = 0; i < sheetValues.length; i++) {
    for (var j = 0; j < sheetValues[0].length; j++) {
      table.getCell(i, j).getText().setText(String(sheetValues[i][j]));
    }
  }
```

#### 3 导入图表,在createSlidePresentation()函数中再创建一张ppt,从电子表格中导入图表,返回Presentation对象deck
``` javascript
  // Add a chart slide and insert the chart on it.
  var chartSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  chartSlide.insertSheetsChart(chart);

  // Return the presentation object for later use.
  return deck;
}
```
#### 4 返回图: 我们需要让createColumnChart()返回对象,所以我们在尾端接收createColumnChart():
```javascript
 // Return chart object for later use
  return chart;
}
```

#### 更新createBigQueryPresentation(),因为createColumnChart()返回了图表,所以我们要把这个图表保存到变量,然后把电子表格和图表都传递给createSlidePresentation()函数
```javascript
/**
 * Runs a BigQuery query, adds data and a chart in a Sheet,
 * and adds the data and chart to a new slide presentation.
 */
function createBigQueryPresentation() {
  var spreadsheet = runQuery();
  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());
  var chart = createColumnChart(spreadsheet);
  var deck = createSlidePresentation(spreadsheet, chart);
  Logger.log('Results slide deck created: %s', deck.getUrl());
}
```

最后的版本如下:
``` javescript
// Filename for data results
var QUERY_NAME = "Most common words in all of Shakespeare's works";
// Replace this value with your Google Cloud API project ID
var PROJECT_ID = '<YOUR_PROJECT_ID>';
if (!PROJECT_ID) throw Error('Project ID is required in setup');

/**
 * Runs a BigQuery query; puts results into Sheet. You must enable
 * the BigQuery advanced service before you can run this code.
 * @see http://developers.google.com/apps-script/advanced/bigquery#run_query
 * @see http://github.com/gsuitedevs/apps-script-samples/blob/master/advanced/bigquery.gs
 *
 * @returns {Spreadsheet} Returns a spreadsheet with BigQuery results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 */
function runQuery() {
  // Replace sample with your own BigQuery query.
  var request = {
    query:
        'SELECT ' +
            'LOWER(word) AS word, ' +
            'SUM(word_count) AS count ' +
        'FROM [bigquery-public-data:samples.shakespeare] ' +
        'GROUP BY word ' +
        'ORDER BY count ' +
        'DESC LIMIT 10'
  };
  var queryResults = BigQuery.Jobs.query(request, PROJECT_ID);
  var jobId = queryResults.jobReference.jobId;

  // Wait for BQ job completion (with exponential backoff).
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId);
  }

  // Get all results from BigQuery.
  var rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  // Return null if no data returned.
  if (!rows) {
    return Logger.log('No rows returned.');
  }

  // Create the new results spreadsheet.
  var spreadsheet = SpreadsheetApp.create(QUERY_NAME);
  var sheet = spreadsheet.getActiveSheet();

  // Add headers to Sheet.
  var headers = queryResults.schema.fields.map(function(field) {
    return field.name.toUpperCase();
  });
  sheet.appendRow(headers);

  // Append the results.
  var data = new Array(rows.length);
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].f;
    data[i] = new Array(cols.length);
    for (var j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v;
    }
  }

  // Start storing data in row 2, col 1
  var START_ROW = 2;      // skip header row
  var START_COL = 1;
  sheet.getRange(START_ROW, START_COL, rows.length, headers.length).setValues(data);

  // Return the spreadsheet object for later use.
  return spreadsheet;
}

/**
 * Uses spreadsheet data to create columnar chart.
 * @param {Spreadsheet} Spreadsheet containing results data
 * @returns {EmbeddedChart} visualizing the results
 * @see http://developers.google.com/apps-script/reference/spreadsheet/embedded-chart
 */
function createColumnChart(spreadsheet) {
  // Retrieve the populated (first and only) Sheet.
  var sheet = spreadsheet.getSheets()[0];
  // Data range in Sheet is from cell A2 to B11
  var START_CELL = 'A2';  // skip header row
  var END_CELL = 'B11';
  // Place chart on Sheet starting on cell E5.
  var START_ROW = 5;      // row 5
  var START_COL = 5;      // col E
  var OFFSET = 0;

  // Create & place chart on the Sheet using above params.
  var chart = sheet.newChart()
     .setChartType(Charts.ChartType.COLUMN)
     .addRange(sheet.getRange(START_CELL + ':' + END_CELL))
     .setPosition(START_ROW, START_COL, OFFSET, OFFSET)
     .build();
  sheet.insertChart(chart);

  // Return the chart object for later use.
  return chart;
}

/**
 * Create presentation with spreadsheet data & chart
 * @param {Spreadsheet} Spreadsheet with results data
 * @param {EmbeddedChart} Sheets chart to embed on slide
 * @returns {Presentation} Returns a slide deck with results
 * @see http://developers.google.com/apps-script/reference/slides/presentation
 */
function createSlidePresentation(spreadsheet, chart) {
  // Create the new presentation.
  var deck = SlidesApp.create(QUERY_NAME);

  // Populate the title slide.
  var [title, subtitle] = deck.getSlides()[0].getPageElements();
  title.asShape().getText().setText(QUERY_NAME);
  subtitle.asShape().getText().setText('via GCP and G Suite APIs:\n' +
    'Google Apps Script, BigQuery, Sheets, Slides');

  // Data range to copy is from cell A1 to B11
  var START_CELL = 'A1';  // include header row
  var END_CELL = 'B11';
  // Add the table slide and insert an empty table on it of
  // the dimensions of the data range; fails if Sheet empty.
  var tableSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  var sheetValues = spreadsheet.getSheets()[0].getRange(
      START_CELL + ':' + END_CELL).getValues();
  var table = tableSlide.insertTable(sheetValues.length, sheetValues[0].length);

  // Populate the table with spreadsheet data.
  for (var i = 0; i < sheetValues.length; i++) {
    for (var j = 0; j < sheetValues[0].length; j++) {
      table.getCell(i, j).getText().setText(String(sheetValues[i][j]));
    }
  }

  // Add a chart slide and insert the chart on it.
  var chartSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  chartSlide.insertSheetsChart(chart);

  // Return the presentation object for later use.
  return deck;
}

/**
 * Runs a BigQuery query, adds data and a chart in a Sheet,
 * and adds the data and chart to a new slide presentation.
 */
function createBigQueryPresentation() {
  var spreadsheet = runQuery();
  Logger.log('Results spreadsheet created: %s', spreadsheet.getUrl());
  var chart = createColumnChart(spreadsheet);
  var deck = createSlidePresentation(spreadsheet, chart);
  Logger.log('Results slide deck created: %s', deck.getUrl());
}
```

## 执行后,我们就会看到以下效果:

![png](../img/bigquery/bigquery_presentation/12.png)
![png](../img/bigquery/bigquery_presentation/13.png)
![png](../img/bigquery/bigquery_presentation/14.png)
![png](../img/bigquery/bigquery_presentation/15.png)
![png](../img/bigquery/bigquery_presentation/16.png)

# 是不是超酷呢??