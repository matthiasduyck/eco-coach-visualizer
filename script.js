$(document).ready(function() {
	console.log("Start getting data");
    // Fetch battery SoH data from API
    $.get('/getelectricdrivingdata', function(jsonData) {
	console.log("got data:");
	console.log(jsonData);
        // Use data to generate Google Charts visualization
        google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawCharts);

        function drawCharts() {
        	// Convert date strings to JavaScript Date objects
			jsonData.forEach(function(entry) {
				entry.date = new Date(entry.date);
			});

			function drawSOHchart() {
				var soh_data_table = new google.visualization.DataTable();
				soh_data_table.addColumn('date', 'Date');
				soh_data_table.addColumn('number', 'SoH');

				

				soh_data_table.addRows(
					jsonData
						.filter(entry => entry.soh >= 0)//we can have negative soh when driving downhill and regenerative braking
						.filter(entry => entry.distanceTraveled>3)//also filter out any short distances
						.map(entry => [entry.date, entry.soh]));

				var options = {
					title: 'Battery State of Health Over Time',
					curveType: 'function',
					legend: { position: 'bottom' },
					hAxis: {
						//format: 'yyyy-MM-dd_HH:mm' // Date format for horizontal axis labels
						
					},
					vAxis: {
						viewWindow: {
				            min: 0, // Minimum value on the x-axis
				            max: 150 // Maximum value on the x-axis
				        }
					},
					explorer: {
						axis: 'horizontal',
						keepInBounds: true,
						maxZoomIn: 4.0
					}
					//trendlines: { 0: {} }
				};


				var chart = new google.visualization.LineChart(document.getElementById('soh_chart_div'));

				chart.draw(soh_data_table, options);
			}
			drawSOHchart();

			function drawEfficiencyChart() {
				var efficiency_data_table = new google.visualization.DataTable();
				efficiency_data_table.addColumn('date', 'Date');
				efficiency_data_table.addColumn('number', 'Electric Consumption');

				

				efficiency_data_table.addRows(
					jsonData
						.filter(entry => entry.soh >= 0)//we can have negative soh when driving downhill and regenerative braking
						.filter(entry => entry.distanceTraveled>3)//also filter out any short distances
						.map(entry => [entry.date, entry.electricConsumption]));

				var options = {
					title: 'Electric Consumption Over Time',
					curveType: 'function',
					legend: { position: 'bottom' },
					hAxis: {
						//format: 'yyyy-MM-dd_HH:mm' // Date format for horizontal axis labels
						
					},
					vAxis: {
						viewWindow: {
				            min: 10, // Minimum value on the x-axis
				            max: 40 // Maximum value on the x-axis
				        }
					}
				};


				var chart = new google.visualization.LineChart(document.getElementById('consumption_chart_div'));

				chart.draw(efficiency_data_table, options);
			}
			drawEfficiencyChart();

			
		}
    });


    // Fetch battery SoH data from API
    $.get('/getstatistics', function(jsonData) {
		console.log("got data:");
		console.log(jsonData);	
    });
});