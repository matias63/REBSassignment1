// import DCRGraph from dcr 


// main.js

const fs = require('fs');
const path = require('path');
const {DCRGraph, Marking, Event} = require('./dcr'); // You don't need to add the '.js' extension
// import {readCSV} from './csv_reader';
const { readCSV } = require('./csv_reader');

// Give local path to .csv file, read it and store the relevant data in output.json
filePathLog = 'enter\\Desktop\\Reactive and eventbased systems\\assignments\\REBSassignment1\\REBS2021-main\\REBS2021-main\\log.csv';
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



// Save the variable in a .js file
// const jsCode = `const myVariable = ${JSON.stringify(listOfLists)};`;

// fs.writeFileSync('output.js', jsCode, 'utf-8');

// console.log('Variable saved to output.js');

// console.log(jsCode[0])

// Create an instance of YourClass
const graph = new DCRGraph();


const event = new Event();
event.events = [
    "Fill_out_application(0,0,0)",        
    "B(0,1,1)",        
    "Fill_out_application -->* B",
    "B *--> A",
    "C -->% A",
    "D -->+ A",    
    "D -->* B",
    "A --><> B",
    "A --><> D"
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

function dcrGraphCreator(csvFile) 
{
    for (const e of event.events){
        console.log("\n\nBefore adding relations: ", graph.status())

        const parts = e.split(" ");
        // console.log("parts: ",parts)
        // console.log("length of parts: ", parts.length)
        if (parts.length == 1){
            const markingParts = parts[0].replace(")","").split(/[,(]/);
            // console.log("marking parts: ",markingParts)
            
            // Adding an event with a marking
            graph.addEvent(markingParts[0], markingParts[0], m= {ex: markingParts[1] == 1, in: markingParts[2] == 1, pe: markingParts[3] == 1})

        }
        
        
        else if (parts.length > 2)
        {
            const eventName = parts[0] 
            const relationType = parts[1]
            // for (let i = 2; i < parts.length; i++){
            //     const targetEventName = parts[i].replace("(", "").replace(")","").replace(",", "")
            const targetEventName = parts[2]

            if (!graph.hasEvent(eventName)) {
                // console.log("EventName: ", eventName)
                // console.log("Event exists NOT: ", !graph.hasEvent(eventName))
                graph.addEvent(eventName)
            }
            if (!graph.hasEvent(targetEventName)) {
                // console.log("TargetEventName: ", targetEventName)
                // console.log("Event exists NOT: ", !graph.hasEvent(targetEventName))
                graph.addEvent(targetEventName)
            }
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
            // do this another place
            // if (graph.getEvent(eventName).enabled()){
            //     graph.execute(graph.getEvent(eventName));
            // }
            
            
        }
                // }
                
        else {
            console.log("\n\n parts not equal to 1 or 3?? \n\n")
        }
        console.log("\n\nGraph status after adding relation: ", graph.status())

    }
    // console.log("Graph status: ", graph.status())
    for (i = 1; i < listOfLists.length; i++){
        if (listOfLists[i-1][0] != listOfLists[i][0]){
            console.log("i: ", i)
        }
        else{
            if (graph.getEvent(listOfLists[i-1][1]).enabled()){
                graph.execute(listOfLists[i-1][1]);
            // console.log("\n\nhere\n\n")
            }
        }
    }    
    // console.log(graph.status())
}
// fs.readFile(read_path, 'utf8', (err, data) => {
//     if (err) {
//     console.error(err);
//     return;
//     }
// });
// for (const i of csv)
// console.log(data)

dcrGraphCreator(listOfLists)