// import DCRGraph from dcr 


//////// READ LOG.csv AND SAVE AS DICT DATA STRUCTURE

const fs = require('fs');
const path = require('path');
const {DCRGraph, Marking, Event} = require('./dcr'); // You don't need to add the '.js' extension
// import {readCSV} from './csv_reader';
const { readCSV } = require('./csv_reader');

// Give local path to .csv file, read it and store the relevant data in output.json
/*
filePathLog = 'enter\\Desktop\\Reactive and eventbased systems\\assignments\\REBSassignment1\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
readCSV(filePathLog)
*/
readCSV("log.csv")

// Read the JSON file
const jsonData = fs.readFileSync('output.json', 'utf-8');

// Parse the JSON data
const listOfLists = JSON.parse(jsonData);

/// FIX DATA STRCUTURE
trace_dict = {}
for (i = 0; i < listOfLists.length; i++){
    if (!trace_dict[listOfLists[i][0]]) {
        trace_dict[listOfLists[i][0]] = [listOfLists[i][1]]
    } else {
        trace_dict[listOfLists[i][0]].push(listOfLists[i][1])
    }
}
console.log("Trace dict: ", trace_dict)


///// CREATE GRAPH


const ruleList = new Event()
ruleList.events = [ // EIP
    "A(0,1,0)",        
    "B(0,1,0)",        
    // "Fill_out_application -->* B",
    // "B *--> A",
    // "C -->% A",
    // "D -->+ A",    
    // "D -->* B",
    "A *--> B"
    // "Fill_out_application -->+ Review",
    // "Fill_out_application -->* Review"
    // "Fill_out_application --><> Lawyer Review"
    ];
    // "A --><> (B, D)"];

const rule1 = new Event()
rule1.events = [
    "Fill_out_application(0,1,0)",
    "other_than_fill_out_application",
    "Fill_out_application *--> other_than_fill_out_application"
    ];

function dcrGraphCreator(event) {
    
    graph = new DCRGraph();

    for (const e of event.events){
        const parts = e.split(" ");
        if (parts.length == 1){
            const markingParts = parts[0].replace(")","").split(/[,(]/);
            graph.addEvent(markingParts[0], markingParts[0], m= {ex: markingParts[1] == 1, in: markingParts[2] == 1, pe: markingParts[3] == 1})
            console.log("Added event")
        }
        
        else if (parts.length > 2) {
            console.log("Added relation")
            const eventName = parts[0] 
            const relationType = parts[1]
            const targetEventName = parts[2]
            switch (relationType) {
                case "-->*":
                    graph.addCondition(eventName, targetEventName);
                    console.log("Added condition relation")
                    break;
                case '*-->':
                    graph.addResponse(eventName, targetEventName);
                    console.log("Added response relation")
                    break;
                case '-->%':
                    graph.addExclude(eventName, targetEventName);
                    break;
                case '-->+':
                    graph.addInclude(eventName, targetEventName);
                    break;
                case '--><>':
                    graph.addMilestone(eventName, targetEventName);
                    break;
                default:
                    break;
            }
        }
        else {
            console.log("\n\n parts not equal to 1 or 3?? \n\n")
        }
    }
    return graph;
}


function check(){
    passed = 0
    failed = 0
    for (const ID in trace_dict){
        
        for (const action of trace_dict[ID]){ // for (action = 1; action < listOfLists.length; action++){
            console.log("action" ,action)
            // check if executing an excluded activity
            if (!DCR.getEvent(action).marking.included && DCR.execute(action)) {
                console.log("excluded: ", DCR.getEvent(action).marking.included)
                failed +=1
                break; 
            }
            DCR.execute(action)
        } 
        if (graph.isAccepting()) {
            passed += 1
            console.log("PASS")
        } else {
            failed +=1
            console.log("FAILS") 
        }
    }
    console.log("Passed: ", passed, "\nFailed: ",failed)
}

DCR = dcrGraphCreator(rule1)
check()
console.log(DCR.status())

