function readFile(event) {
    let file = event.target.files[0];
    
    let reader = new FileReader();
    
    reader.onload = function(e) {
        let csvData = e.target.result;
        processCSVData(csvData);
    }
    
    reader.readAsText(file);
}

function processCSVData(data) {
    let rows = data.split("\n");
    rows.forEach(row => {
        let columns = row.split(",");  // Splitting by comma for simplicity, consider using a CSV parsing library for advanced features
        console.log(columns);
    });
}


readFile("C:/\Users/\enter/\Desktop/\Reactive and eventbased systems/\assignments/\assignment 1/\REBS2021-main/\REBS2021-main/\log.csv")