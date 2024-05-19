const express = require('express');
const fs = require('fs');
const path = require('path');
const expectedBatterySizekWh = 10.9;

const app = express();
const PORT = process.env.PORT || 3000;
const dataFolderPath = 'data'; // Specify the folder containing your JSON files

// Function to read a JSON file
function readJSONFile(filePath) {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

// Function to read all JSON files in a folder
function readAllJSONFiles(folderPath) {
    try {
        const fileNames = fs.readdirSync(folderPath);
        const jsonFiles = fileNames.filter(fileName => path.extname(fileName) === '.json');
        const jsonData = [];

        jsonFiles.forEach(fileName => {
            const filePath = path.join(folderPath, fileName);
            const fileData = readJSONFile(filePath);
            if (fileData) {
                jsonData.push(fileData);
            }
        });

        return jsonData;
    } catch (error) {
        console.error('Error reading JSON files in folder:', error);
        return [];
    }
}

// Extract driving data
function extractElectricDrivingData(jsonData) {
    const drivingDataList = [];

    // Loop through each JSON file data
    jsonData.forEach(fileData => {
        // Loop through each event in the file
        fileData.events.forEach(event => {
            // Filter out only 100% electric drives
            if (event.distanceTraveledElectricRatio === 100 && event.distanceTraveled.value>0) {
                // Calculate total consumption per drive in kWh
                const consumption = event.electricConsumption.value * (event.distanceTraveled.value / 100);
				if(consumption == 0){
					return;
				}
				//console.log("consumption"+consumption);
                // Calculate estimated current battery capacity based on SoC values
                const estimatedCapacity = (event.socStart - event.socEnd) / 100 * expectedBatterySizekWh; 
				//console.log("estimatedCapacity"+estimatedCapacity);
                // Calculate current State of Health based on percentage difference
                const soh = (estimatedCapacity / consumption) * 100;
				//console.log("soh"+soh);

                // Create an object with date and SoH values
                const drivingDataEntry = {
                    date: new Date(event.createdAt),
                    soh: soh,
                    distanceTraveled: event.distanceTraveled.value,
                    electricConsumption: event.electricConsumption.value
                };

                // Add the entry to the drivingDataList
                drivingDataList.push(drivingDataEntry);
            }
        });
    });

    // Sort the drivingDataList by date
    drivingDataList.sort((a, b) => a.date - b.date);

    return drivingDataList;
}


// Extract statistics data
function extractStatisticsData(jsonData) {
    

    var chargeCount = 0;
    var sumPercentageCharged = 0;
    var timeChargedSeconds = 0;    


    // Loop through each JSON file data
    jsonData.forEach(fileData => {
        // Loop through each event in the file
        

        fileData.events.forEach(event => {
            // Get the charging events
            if (event.type === "CHARGE") {
                // Total number of charges
                chargeCount++;
                // Total time charged
                timeChargedSeconds = timeChargedSeconds + event.durationInSec;

                sumPercentageCharged = sumPercentageCharged + event.socDiff;
            }


        });
    });

    const statistics = {
        totalCharges: chargeCount,
        totalTimeChargedSeconds: timeChargedSeconds,
        averageChargedPercentage: sumPercentageCharged/chargeCount
    }


    return statistics;
}


// API endpoint to get driving data
app.get('/getelectricdrivingdata', (req, res) => {
    const jsonData = readAllJSONFiles(dataFolderPath);
    const electricDrivingData = extractElectricDrivingData(jsonData);
    res.json(electricDrivingData);
});

// API endpoint to get driving data
app.get('/getstatistics', (req, res) => {
    const jsonData = readAllJSONFiles(dataFolderPath);
    const statistics = extractStatisticsData(jsonData);
    res.json(statistics);
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
