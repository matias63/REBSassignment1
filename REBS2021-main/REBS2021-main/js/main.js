// import DCRGraph from dcr 


// main.js

const fs = require('fs');
const path = require('path');
const {DCRGraph, Marking, Event} = require('./dcr'); // You don't need to add the '.js' extension
// import {readCSV} from './csv_reader';
const { readCSV } = require('./csv_reader');

// Give local path to .csv file, read it and store the relevant data in output.json
filePathLog = 'enter\\Desktop\\Reactive and eventbased systems\\assignments\\REBSassignment1\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
readCSV(filePathLog)

// Read the JSON file
const jsonData = fs.readFileSync('output.json', 'utf-8');

// Parse the JSON data
const listOfLists = JSON.parse(jsonData);

function createTracing(listOfLists)
{
    
    for (i = 1; i < listOfLists.length; i++){
        if (listOfLists[i-1][0] != listOfLists[i][0]){
            console.log("i: ", i)
        }
        else[
            graph.execute(listOfLists[i-1][1])
        ]
    }
    
}


// Create an instance of YourClass
const graph = new DCRGraph();

const ruleList = new Event()
// const event = new Event();
// event.events = [
ruleList.events = [
    "A(0,1,0)",        
    "B(0,1,0)",        
    // "Fill_out_application -->* B",
    // "B *--> A",
    // "C -->% A",
    // "D -->+ A",    
    // "D -->* B",
    "A -->* B"
    // "Fill_out_application -->+ Review",
    // "Fill_out_application -->* Review"
    // "Fill_out_application --><> Lawyer Review"
    ];
    // "A --><> (B, D)"];


/// iterær over en 1 rulesæt ad gangen og add event(relations) fra rulesæt
/// itererer elementer i liste over Trace ID 1 gang for hver rule 
/// ved et element fra tracelisten execute relation alle relations i rule
/// ved ny rule eller nyt trace ID så nulstil alt
    // // 1. find length of individual traces:
// sum = 0
// for (i = 1; i < listOfLists.length; i++){
//     if (listOfLists[i-1][0] != listOfLists[i][0]){
//         sum += 1
// }
    // // 2. actual thing
// for (i = 0; i < sum; i++){
//     for ( k = 0; k< rules.length; k++){ // for (rule in rules)
//         graph.addEvent(relation) // add relations in ruleset
//     }
//     for (j in listOfLists[i]) {
//         graph.addEvent(marking(listOfLists[j]));
//         graph.execute(graph.getEvent(listOfLists[j]));
//         if ( eventName == Marking) { // Listoflists[j-1][1]
//             graph.execute(relation)
//         }
//     }
// }
function dcrGraphCreator(event, listOfLists) 
{
    for (const e of event.events){
        // console.log("\n\nBefore adding relations: ", graph.status())

        const parts = e.split(" ");
        // console.log("parts: ",parts)
        // console.log("length of parts: ", parts.length)
        if (parts.length == 1){
            const markingParts = parts[0].replace(")","").split(/[,(]/);
            // console.log("marking parts: ",markingParts)
            
            // Adding an event with a marking
            graph.addEvent(markingParts[0], markingParts[0], m= {ex: markingParts[1] == 1, in: markingParts[2] == 1, pe: markingParts[3] == 1})
            // console.log("\n\n:", markingParts[0], markingParts[1],markingParts[2],markingParts[3])
            // console.log("\n\n added marking: ", graph.status())
            
        }
        
        
        else if (parts.length > 2)
        {
            const eventName = parts[0] 
            const relationType = parts[1]
            // for (let i = 2; i < parts.length; i++){
            //     const targetEventName = parts[i].replace("(", "").replace(")","").replace(",", "")
            const targetEventName = parts[2]

            /// OUT-COMMENTED - i think this will bother the implementation of the rules
            // if (!graph.hasEvent(eventName)) {
            //     // console.log("EventName: ", eventName)
            //     // console.log("Event exists NOT: ", !graph.hasEvent(eventName))
            //     graph.addEvent(eventName)
            // }
            // if (!graph.hasEvent(targetEventName)) {
            //     // console.log("TargetEventName: ", targetEventName)
            //     // console.log("Event exists NOT: ", !graph.hasEvent(targetEventName))
            //     graph.addEvent(targetEventName)
            // }
            switch (relationType) {
                case "-->*":
                    graph.addCondition(eventName, targetEventName);
                    console.log("-->*");
                    break;
                case '*-->':
                    graph.addResponse(eventName, targetEventName);
                    break;
                case '-->%':
                    graph.addMilestone(eventName, targetEventName);
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
        console.log("\n\nGraph status after adding relation: ", graph.status())

    }



    /// FIX DATA STRCUTURE
    trace_dict = {}
    for (i = 0; i < listOfLists.length; i++){
        console.log("WHAT",listOfLists[i])
        if (!trace_dict[listOfLists[i][0]]) {
            trace_dict[listOfLists[i][0]] = [listOfLists[i][1]]
        } else {
            trace_dict[listOfLists[i][0]].push(listOfLists[i][1])
        }
    }
    console.log(trace_dict)

    for (const ID in trace_dict){

        // HER ER DEN FÆRDIG MED ID iteration
        if (!graph.isAccepting()) {
            console.log("FAILS") 
        } else {
            console.log("PASS")
        }
    }

    for (i = 1; i < listOfLists.length; i++){
        if (listOfLists[i-1][0] != listOfLists[i][0]){
            console.log("IF")
            // a new trace gets instanciated:
            //  reset trace passed variable
            if (!graph.isAccepting()) {
                console.log("FAILS")
                failed_traces.push(listOfLists[i-1][0]);
                trace_passed = false;
            }
            // console.log("i: ", i)
        }
        else{
            console.log("ELSE")

            // keep going through the same trace
           
            // if (trace_passed == true && graph.getEvent(listOfLists[i-1][1]).enabled()){
            if (trace_passed == true){
                // if trace rule hasnt failed execute next element in trace
                graph.execute(listOfLists[i-1][1]);
                console.log("\n\n executed",graph.status() ,"\n\n")
            }
        }
    }    
    console.log("\n\n Execute Trace: ", graph.status())

}


// dcrGraphCreator(listOfLists)
dcrGraphCreator(ruleList, listOfLists)
