// import libraries
const fs = require('fs');
const path = require('path');

function readCSV(fileName) {
    // Define the base path
    const basePath = 'C:\\Users\\';

    // Combine the base path with the dynamic part (fileName)
    const filePath = path.join(basePath, fileName);

    // Read the CSV file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        return;
        }

        // Parse CSV content
        const rows = data.split('\n');
        const csvData = rows.map(row => row.split(';'));

        // Extract the first and third columns
        const extractedData = csvData.slice(1).map(row => [row[0], row[2]]);

        console.log(extractedData);
        // Do something with the extracted data
        // Additional actions with extractedData can be added here
        // For example, you could save the data to a file, process it further, etc.
        // For demonstration, let's write it to a JSON file:
        fs.writeFileSync('output.json', JSON.stringify(extractedData, null, 2), 'utf8');
  });
}

// Specify the dynamic part of the file path
// const fileNameComputer1 = 'Mads-\\OneDrive - University of Copenhagen\\Uni\\2023\\REB\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
const fileNameComputer1 = 'enter\\Desktop\\Reactive and eventbased systems\\assignments\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';

// Call the readCSV function with the file name
readCSV(fileNameComputer1);
