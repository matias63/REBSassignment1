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
    "Fill_out_application(0,1,0)",        
    "Review(0,0,1)",        
    // "Fill_out_application -->* B",
    // "B *--> A",
    // "C -->% A",
    // "D -->+ A",    
    // "D -->* B",
    "Fill_out_application *--> Review",
    "Fill_out_application -->* Review"
    // "Fill_out_application --><> Lawyer Review"
    ];
    // "A --><> (B, D)"];



// R1 DCR
// GraphR1.event = [
//     "FillOutApplication -->* Other"
// ]
// console.log(event.events)
// add events
// graph.addEvent("A","A", m = {ex: false, in: false, pe: false})
// graph.addEvent("B","B", m = {ex: false, in: true, pe: true})
// graph.addEvent("C")
// graph.addEvent("D")

// console.log("State before")
// console.log(graph.status())

// // add relations
// graph.addCondition(graph.getEvent("A"), graph.getEvent("B"))
// graph.addResponse(graph.getEvent("B"), graph.getEvent("A"))
// graph.addExclude(graph.getEvent("C"), graph.getEvent("A"))
// graph.addInclude(graph.getEvent("D"), graph.getEvent("A"))
// graph.addCondition(graph.getEvent("D"), graph.getEvent("B"))
// graph.addMilestone(graph.getEvent("A"), graph.getEvent("B"))
// graph.addMilestone(graph.getEvent("A"), graph.getEvent("D"))

// console.log("State after")
// console.log(graph.status())

// KØR EVENT A

// Har graphen ændret sig? burde B se anderledes ud?'
// b er ikke pending længere? og a included 


// Use the instance or class as needed
/*
graph.addEvent(event) 
*/


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
            console.log("\n\n added marking: ", graph.status())
            
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
                    graph.addCondition(graph.getEvent(eventName), graph.getEvent(targetEventName));
                    break;
                case '*-->':
                    graph.addResponse(graph.getEvent(eventName), graph.getEvent(targetEventName));
                    break;
                case '-->%':
                    graph.addMilestone(graph.getEvent(eventName), graph.getEvent(targetEventName));
                    break;
                case '-->+':
                    graph.addInclude(graph.getEvent(eventName), graph.getEvent(targetEventName));
                    break;
                case '--><>':
                    graph.addMilestone(graph.getEvent(eventName),graph.getEvent(targetEventName));
                    break;
                default:
                    break;
            }
        }
        else {
            console.log("\n\n parts not equal to 1 or 3?? \n\n")
        }
        // console.log("\n\nGraph status after adding relation: ", graph.status())

    }

    // Trace passed variable - if false, the whole trace will be noted as failed
    // list of failed traces to be displayed at the end
    var trace_passed = true
    var failed_traces = []
    for (i = 1; i < listOfLists.length; i++){
        if (listOfLists[i-1][0] != listOfLists[i][0]){
            // a new trace gets instanciated:
            //  reset trace passed variable
            trace_passed = true
            // console.log("i: ", i)
        }
        else{
            // keep going through the same trace
            // append failed trace IDs to the failed traces list
            if (trace_passed == false){
                failed_traces.push(listOfLists[i-1][0]);
            }
            // if (trace_passed == true && graph.getEvent(listOfLists[i-1][1]).enabled()){
            if (trace_passed == true){
                // if trace rule hasnt failed execute next element in trace
                graph.execute(listOfLists[i-1][1]);
                listOfLists[i-1][1].executed = 0;
                // console.log("\n\nhere\n\n")
            }
        }
    }    
    console.log("\n\n Execute Trace: ", graph.status())

}


// dcrGraphCreator(listOfLists)
dcrGraphCreator(ruleList, listOfLists)
