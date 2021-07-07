/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.52116836232359, "KoPercent": 3.478831637676403};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.364456842796193, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.correios.com.br"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.fazenda.df.gov.br"], "isController": false}, {"data": [0.8686006825938567, 500, 1500, "http://www.fazenda.df.gov.br-0"], "isController": false}, {"data": [0.3924914675767918, 500, 1500, "http://www.fazenda.df.gov.br-1"], "isController": false}, {"data": [0.006896551724137931, 500, 1500, "http://www.fazenda.df.gov.br-2"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "https://www.gov.br"], "isController": false}, {"data": [0.22580645161290322, 500, 1500, "https://www.gov.br-2"], "isController": false}, {"data": [0.7224669603524229, 500, 1500, "https://www.gov.br-1"], "isController": false}, {"data": [0.9074889867841409, 500, 1500, "https://www.gov.br-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.correios.com.br-0"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.correios.com.br-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3047, 106, 3.478831637676403, 4391.716770594031, 8, 59955, 2671.0, 10442.000000000002, 15261.999999999998, 21534.52, 39.03407635152447, 3161.556915353574, 6.557405761593646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.correios.com.br", 300, 0, 0.0, 7539.433333333334, 3562, 59955, 6119.0, 10472.200000000004, 14342.149999999998, 39373.06000000004, 5.0035024517162014, 512.6098034248974, 1.2117857500250175], "isController": false}, {"data": ["http://www.fazenda.df.gov.br", 300, 10, 3.3333333333333335, 8923.756666666664, 1984, 36312, 8387.0, 14886.300000000007, 18763.09999999999, 24134.97000000001, 4.046125834513453, 800.5340965127454, 1.456420906669364], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-0", 293, 0, 0.0, 500.7542662116041, 100, 7118, 186.0, 1253.6000000000001, 3136.0000000000005, 3263.02, 5.112010607858189, 2.8355683840463395, 0.6290169302638007], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-1", 293, 3, 1.023890784982935, 2005.1911262798635, 12, 21046, 1425.0, 3120.0, 7415.0, 21029.3, 4.124436936936937, 1.943584820171734, 0.5062893704251126], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-2", 290, 0, 0.0, 6189.844827586207, 1319, 19176, 5575.0, 10660.5, 11720.799999999996, 17707.519999999982, 3.9911918524635284, 812.4998655983347, 0.4950013332645197], "isController": false}, {"data": ["https://www.gov.br", 300, 83, 27.666666666666668, 8650.56333333333, 157, 36110, 4530.5, 21050.9, 21060.9, 28064.83, 4.2020337843516264, 467.98539946459084, 1.0546119947054373], "isController": false}, {"data": ["https://www.gov.br-2", 217, 0, 0.0, 2495.3087557603685, 31, 7789, 2166.0, 5129.200000000002, 5757.3, 7669.999999999996, 3.064149451418405, 464.78022151982515, 0.3590800138380943], "isController": false}, {"data": ["https://www.gov.br-1", 227, 10, 4.405286343612334, 1706.2775330396476, 65, 21056, 304.0, 3061.4, 12169.399999999958, 21053.04, 3.183864678738236, 2.892034158169348, 0.34181125696032094], "isController": false}, {"data": ["https://www.gov.br-0", 227, 0, 0.0, 572.9251101321586, 8, 15054, 32.0, 1022.2, 3074.5999999999995, 15045.72, 3.1851155481345326, 1.343720621869256, 0.35770340628463987], "isController": false}, {"data": ["http://www.correios.com.br-0", 300, 0, 0.0, 63.61666666666667, 8, 204, 39.5, 150.80000000000007, 166.89999999999998, 201.98000000000002, 479.2332268370607, 225.57657747603835, 58.03214856230032], "isController": false}, {"data": ["http://www.correios.com.br-1", 300, 0, 0.0, 7467.306666666664, 3516, 59782, 6028.0, 10446.700000000008, 14326.199999999997, 39209.330000000045, 5.014877469827153, 511.41465775550796, 0.6072703186118819], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 20, 18.867924528301888, 0.6563833278634723], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 73, 68.86792452830188, 2.3957991467016737], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 7, 6.60377358490566, 0.22973416475221528], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 6, 5.660377358490566, 0.1969149983590417], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3047, 106, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 73, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 6, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://www.fazenda.df.gov.br", 300, 10, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-1", 293, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.gov.br", 300, 83, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 73, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 10, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.gov.br-1", 227, 10, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
