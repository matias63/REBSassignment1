const {DCRGraph, Marking, Event} = require('./dcr'); // You don't need to add the '.js' extension

const { rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8 } = require('./Rules'); // Adjust the path based on your file structure

const fs = require('fs');

const { readCSV } = require('./csv_reader');

// Give local path to .csv file, read it and store the relevant data in output.json
// filePathLog = 'enter\\Desktop\\Reactive and eventbased systems\\assignments\\REBSassignment1\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
filePathLog = 'Mads-\\OneDrive - University of Copenhagen\\Uni\\2023\\REB\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
readCSV(filePathLog)

// Read the JSON file
const jsonData = fs.readFileSync('output.json', 'utf-8');

// Parse the JSON data
// const listOfLists = JSON.parse(jsonData);


// ...

function checkRules(listOfLists) {
    let dcrGraph = new DCRGraph();

    
    // Add events and define DCR rules
    // rule1(dcrGraph);
    // rule2(dcrGraph);
    // rule3(dcrGraph);
    // rule4(dcrGraph);
    // rule5(dcrGraph);
    // rule6(dcrGraph);
    // rule7(dcrGraph);
    // rule8(dcrGraph);

    const violatedRules = [];

    let currentTrace = null;

    for (const [traceId, event] of listOfLists) {
        if (currentTrace !== traceId) {
            // Start of a new trace, reset DCR markings
            dcrGraph = new DCRGraph();
            dcrGraph.addEvent(event)
            rule1(dcrGraph);
            // rule2(dcrGraph);
            // rule3(dcrGraph);
            // rule4(dcrGraph);
            // rule5(dcrGraph);
            // rule6(dcrGraph);
            // rule7(dcrGraph);
            // rule8(dcrGraph);

            currentTrace = traceId;
        }

        // Execute the event in the DCR graph
        dcrGraph.execute(event);

        // Check if any rule is violated after processing each event in the trace
        // for (let i = 1; i <= 8; i++) {
        for (let i = 1; i <= 1; i++) {
            const ruleFunction = eval(`rule${i}`);
            const ruleGraph = new DCRGraph();
            ruleFunction(ruleGraph);
            if (!ruleGraph.isAccepting()) {
                violatedRules.push({
                    traceId,
                    event,
                    rule: `Rule ${i} is violated.`,
                });
            }
        }
    }

    return violatedRules;
}

// ...


// Example usage with your provided list of lists
// const listOfLists = [
//   ["14b-460_1", "Fill_out_application"],
//   // ... (other events)
//   ["14b-460_1", "Change_phase_to_Abandon"],
//   // ... (other events)
// ];

const listOfLists =[ 
//     [
//     "14b-460_1",
//     "Fill_out_application"
//   ]
//   ,wa
  [
    "14b-460_1",
    "Approved_-_to_board"
  ]
//   ,
//   [
//     "14b-460_1",
//     "Change_phase_to_Review"
//   ],
//   [
//     "14b-460_1",
//     "Inform_application_of_board_review"
//   ],
//   [
//     "14b-460_1",
//     "Register_Decision"
//   ],
//   [
//     "14b-460_1",
//     "Change_phase_to_Board_meeting"
//   ],
//   [
//     "14b-460_1",
//     "Register_Decision"
//   ],
//   [
//     "14b-460_1",
//     "Change_phase_to_Board_meeting"
//   ],
//   [
//     "14b-460_1",
//     "Execute_abandon"
//   ],
//   [
//     "14b-460_1",
//     "Change_phase_to_Abandon"
//   ],
//   [
//     "14b-460_1",
//     "Execute_abandon"
//   ],
//   [
//     "14b-460_1",
//     "Change_phase_to_Abandon"
//   ]
];

const violations = checkRules(listOfLists);

if (violations.length === 0) {
    console.log("No rule violations found.");
} else {
    console.log("Rule violations:");
    console.log(violations);
}
