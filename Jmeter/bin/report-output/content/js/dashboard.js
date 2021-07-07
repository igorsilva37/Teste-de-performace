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

    var data = {"OkPercent": 90.40758959943781, "KoPercent": 9.592410400562192};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4075895994378074, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://www.correios.com.br"], "isController": false}, {"data": [0.008333333333333333, 500, 1500, "http://www.fazenda.df.gov.br"], "isController": false}, {"data": [0.8569023569023569, 500, 1500, "http://www.fazenda.df.gov.br-0"], "isController": false}, {"data": [0.6397306397306397, 500, 1500, "http://www.fazenda.df.gov.br-1"], "isController": false}, {"data": [0.05319148936170213, 500, 1500, "http://www.fazenda.df.gov.br-2"], "isController": false}, {"data": [0.15333333333333332, 500, 1500, "https://www.gov.br"], "isController": false}, {"data": [0.676923076923077, 500, 1500, "https://www.gov.br-2"], "isController": false}, {"data": [0.6264705882352941, 500, 1500, "https://www.gov.br-1"], "isController": false}, {"data": [0.9264705882352942, 500, 1500, "https://www.gov.br-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://www.correios.com.br-0"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.correios.com.br-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2846, 273, 9.592410400562192, 4429.173576950103, 11, 36158, 2026.5, 14840.700000000052, 21177.0, 24891.77, 39.55359748724862, 2952.8699099802993, 6.28787737307687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://www.correios.com.br", 300, 0, 0.0, 5333.190000000002, 2205, 10196, 4674.5, 8663.5, 9075.499999999998, 9782.92, 28.328611898016998, 2874.995758085458, 6.860835694050992], "isController": false}, {"data": ["http://www.fazenda.df.gov.br", 300, 33, 11.0, 8333.446666666667, 1352, 35656, 5844.0, 21387.200000000004, 25003.35, 31748.740000000013, 7.857311228097744, 1457.335746387274, 2.7404674854639746], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-0", 297, 0, 0.0, 443.27609427609417, 104, 3147, 161.0, 1565.1999999999966, 2186.399999999999, 2677.4799999999996, 24.278590697294206, 13.467030777405379, 2.9874047147061225], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-1", 297, 15, 5.05050505050505, 1770.0370370370367, 16, 21298, 209.0, 2364.7999999999997, 21127.5, 21269.34, 9.08812729498164, 5.27899565865973, 1.0702144851591187], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-2", 282, 15, 5.319148936170213, 4073.0, 1010, 26508, 3157.5, 4948.7, 21119.1, 21253.710000000003, 7.561943580392578, 1482.8176116861525, 0.8879721605840394], "isController": false}, {"data": ["https://www.gov.br", 300, 170, 56.666666666666664, 13188.176666666666, 290, 36158, 21037.5, 21395.0, 23752.35, 36106.97, 4.5263888469778815, 306.61834667989376, 0.7381903685989317], "isController": false}, {"data": ["https://www.gov.br-2", 130, 0, 0.0, 743.4999999999998, 107, 2360, 524.5, 1947.8000000000006, 2170.2, 2330.8599999999997, 4.193818956061682, 634.5652592505968, 0.49146315891347825], "isController": false}, {"data": ["https://www.gov.br-1", 170, 40, 23.529411764705884, 5451.958823529412, 125, 21296, 484.5, 21191.6, 21236.8, 21287.48, 2.5693730729701953, 3.542481797125325, 0.22065790120004836], "isController": false}, {"data": ["https://www.gov.br-0", 170, 0, 0.0, 726.7529411764706, 11, 15113, 82.5, 304.70000000000005, 4861.949999999954, 15079.63, 3.7586504234009155, 1.585680647372261, 0.42211406122178247], "isController": false}, {"data": ["http://www.correios.com.br-0", 300, 0, 0.0, 56.09666666666667, 12, 150, 36.5, 110.0, 112.94999999999999, 147.97000000000003, 409.2769440654843, 192.64793656207368, 49.56087994542974], "isController": false}, {"data": ["http://www.correios.com.br-1", 300, 0, 0.0, 5263.93, 2173, 10147, 4598.5, 8627.5, 8967.9, 9766.660000000002, 28.639618138424822, 2893.078199582339, 3.468078758949881], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 80, 29.304029304029303, 2.8109627547434997], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 130, 47.61904761904762, 4.567814476458187], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 3, 1.098901098901099, 0.10541110330288124], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:443 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 28, 10.256410256410257, 0.9838369641602249], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 2, 0.7326007326007326, 0.07027406886858749], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 30, 10.989010989010989, 1.0541110330288124], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2846, 273, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 130, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 80, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:443 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 28, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://www.fazenda.df.gov.br", 300, 33, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:443 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.fazenda.df.gov.br:80 [www.fazenda.df.gov.br/131.72.223.136] failed: Connection timed out: connect", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-1", 297, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:80 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["http://www.fazenda.df.gov.br-2", 282, 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.economia.df.gov.br:443 [www.economia.df.gov.br/131.72.220.90] failed: Connection timed out: connect", 14, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, null, null, null, null, null, null], "isController": false}, {"data": ["https://www.gov.br", 300, 170, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:80 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 130, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 40, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.gov.br-1", 170, 40, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gov.br:443 [www.gov.br/161.148.164.31] failed: Connection timed out: connect", 40, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
