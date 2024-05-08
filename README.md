# Eco Coach Visualizer



## Overview

The Eco Coach Visualizer is a simple data visualisation tool using NodeJS, google charts and HTML JavaScript front-end for Mercedes Benz Eco Coach app data. It provides a simple interface to visualize driving data from the Mercedes Benz Me Eco Coach app. The goal of the tool is to display the existing data in a new way to provide more insight and to calculate derivative data no displayed in the app itself. 

## Features

- Visualize State Of Health (SoH) of the battery over time.
- ...

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/phev-data-visualization.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the server:

   ```bash
   node server.js
   ```

4. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Data Format

The tool expects your Eco Coach Json driving data in any number of .json files located in a folder called 'data' in the root of the application. This data can be obtained by intercepting the api calls between the app and server. You can achieve this, for example, by installing the app in the Android Emulator and intercepting traffic using `https://httptoolkit.com/`.
This is the structure of the JSON the app expects:
```json
{
  "points": 194275,
  "events": [
    {
      "id": "2f8f96b8-e2b9-4cb9-b2e9-aeac4f316dc0",
      "createdAt": "2023-12-10T15:47:18.556Z",
      "type": "DRIVE",
      "startTime": "2023-12-10T15:23:21.276Z",
      "endTime": "2023-12-10T15:47:16.890Z",
      "durationInSec": 1435,
      "fuelType": "Plugin",
      "distanceTraveled": {
        "value": 17,
        "unit": "KM",
        "special": null
      },
      "distanceTraveledElectricRatio": 100,
      "fuelConsumption": {
        "value": 0,
        "unit": "L100KM",
        "special": null
      },
      "electricConsumption": {
        "value": 15.4352941176471,
        "unit": "KWH100KM",
        "special": null
      },
      "co2Emissions": {
        "value": 0,
        "unit": "KG",
        "special": null
      },
      "co2Savings": {
        "value": 1.9379999999999997,
        "unit": "KG",
        "special": null
      },
      "co2SavingsLongRange": {
        "value": 1.14,
        "unit": "METRIC_T",
        "special": null
      },
      "co2EmissionsOther": {
        "value": 1.9379999999999997,
        "unit": "KG",
        "special": null
      },
      "co2EmissionsDiffPercent": -100,
      "driveScore": 0,
      "temperatureAvg": {
        "value": 9.32692307692308,
        "unit": "CELSIUS",
        "special": null
      },
      "socStart": 27,
      "socEnd": 4,
      "socDiff": -23,
      "renewableEnergyShare": null,
      "points": 75,
      "hintKey": "PHEV_DRIVING_VERY_GOOD",
      "hintListTitle": "Perfectly driven",
      "hintDetailsTitle": "We are impressed!",
      "coachingHintMessage": "This is what winners look like! This is how you make optimal use of the strengths of your plug-in hybrid. That's what you get full points for.",
      "rating": 3,
      "isNew": false,
      "isValid": true
    },...
  ],
  "activeChallenges": [],
  "completedChallenges": []
  ...
}
```

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.
