// import libraries
const fs = require('fs');
const path = require('path');

function readCSV(fileName) {

  const filePath = path.join(fileName);

  // Read the CSV file
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
      console.error(err);
      return;
      }
      
      // Parse CSV content
      const rows = data.toLowerCase().split('\n');
      const csvData = rows.map(row => row.split(';').map(cell => cell.trim().replace(/\s+/g, '_')));

      // Extract the first and third columns
      const extractedData = csvData.slice(1).map(row => [row[0], row[2]]);

      // console.log(extractedData);
      fs.writeFileSync('output.json', JSON.stringify(extractedData, null, 2), 'utf8');
  });
}

module.exports =
  {
    readCSV
  }
