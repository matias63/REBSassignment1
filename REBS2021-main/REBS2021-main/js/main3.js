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
rule1.events = 
    [
    "Fill_out_application(0,1,0)",
    "other",
    "Fill_out_application *--> other"
    ];
    // [ // EIP
    //         "A(0,1,0)",        
    //         "B(0,1,0)",        
    //         // "Fill_out_application -->* B",
    //         // "B *--> A",
    //         // "C -->% A",
    //         // "D -->+ A",    
    //         // "D -->* B",
    //         "A *--> B"
    //         // "Fill_out_application -->+ Review",
    //         // "Fill_out_application -->* Review"
    //         // "Fill_out_application --><> Lawyer Review"
    //         ];
      
const rule2 = new Event()
rule2.events = [
    // ///EASIER understanding of milestone setup  
    // "Fill_out_application(0,1,0)",
    // "Lawyer_Review",
    // "other",
    // "Architect_Review",
    // "Fill_out_application -->* other",
    // "other *--> Architect_Review",
    // "other --><> Architect_Review"
    "Lawyer_Review",
    "other(0,1,1)",
    "Architect_Review",
    "other *--> Lawyer_review",
    "other *--> Architect_Review",
    "other --><> Architect_Review",
    "Lawyer_Review --><> Architect_Review"
    ];

const rule3 = new Event()
rule3.events = [
    "application_informed",
    "change_phase_to_abort",
    "reject",
    "reject *--> application_informed",
    "reject *--> change_phase_to_abort"
    ];

const rule4 = new Event()
rule4.events = [
        "first_payment",
        "undo_payment",
        "first_payment -->% first_payment",
        "undo_payment -->+ first_payment"
        ];

const rule5 = new Event()
rule5.events = [
    /// WORKS !!! first_payment doesnt have to be executed to be an accepting trace
    "account_number_changed",
    "first_payment",
    "approve_changed_account",
    "account_number_changed *--> approve_changed_account",
    "approve_changed_account --><> first_payment"
    // "approve_changed_account *--> first_payment",
    ];

const rule6 = new Event()
rule6.events = [
    "change_phase_to_payout",
    "first_payment",
    "change_phase_to_payout *--> first_payment",
    "change_phase_to_payout -->* first_payment"
    ];

const rule7 = new Event()
//// fails trace 9 + 10 (as it should)
rule7.events = [
    "change_phase_to_payout",
    "first_payment",
    "change_phase_to_end_report",
    "change_phase_to_payout *--> first_payment",
    "first_payment --><> change_phase_to_end_report"
    ];

const rule8 = new Event()

rule8.events = [
    "execute_abandon",
    "change_phase_to_abandon",
    "other",
    "execute_abandon *-->% execute_abandon",
    "execute_abandon -->% other"
    ];

// //// WORDLIST
    // account_number_changed
    // approve_changed_account
    // first_payment
    // change_phase_to_payout
    // change_phase_to_end_report
    // execute_abandon
    // change_phase_to_abandon



// function ruleNr1() {
//     pass = 0
//     fail = 0
//     graph =  new DCRGraph();
//     const fillOutApplication = 'Fill_out_application'
//     graph.addEvent(fillOutApplication);
//     for (const ID in trace_dict){
//         const otherEvents = trace_dict[ID];
//         console.log("ADDING EVENT: \n", otherEvents)
//         // for (const e of otherEvents){
//         //     // graph.addEvent(e)
//         //     // console.log(e)
//         // }
//         // console.log("Otherevents:", otherEvents)
//         console.log("Otherevents[0]:", otherEvents[0])
//         if (fillOutApplication !== otherEvents[0]) {
//             console.log("R1 failed");
//             fail += 1
//         }
//         pass += 1
//     }
//     console.log(" RULE1: pass", pass - failed, "failed", failed)
//     console.log(graph.status())
// }

// function ruleNr2() {
//     pass = 0
//     fail = 0
//     graph =  new DCRGraph();
//     graph.addEvent('Architect_review');
//     graph.addEvent('Lawyer_review');
//     if(graph.getEvent('Architect_review').marking.pending && !graph.getEvent('Lawyer_review').marking.pending) {
//         graph.getEvent('Lawyer_review').marking.included = false
//     }
//     if(graph.getEvent('Lawyer_review').marking.pending && !graph.getEvent('Architect_review').marking.pending) {
//         graph.getEvent('Architect_review').marking.included = false
//     }
//     if(graph.getEvent('Lawyer_review').marking.executed || graph.getEvent('Architect_review').marking.executed){
//         // enabled or included ?????
//         graph.getEvent('Lawyer_review').marking.included = true
//         graph.getEvent('Architect_review').marking.included = true
//     }
// }
//     for (const ID in trace_dict){
//         const otherEvents = trace_dict[ID];
//         console.log("ADDING EVENT: \n", otherEvents)
//     }

        // for (const ID in trace_dict){
        //     const otherEvents = Array.from(trace_dict[ID]);
        //     for (const e of otherEvents){
        //         graph.addEvent(e)
        //         console.log(e)
        //     }
    
        // }
        // return graph;
    // }


function dcrGraphCreator(event) {
    
    graph = new DCRGraph();

    for (const e of event.events){
        const parts = e.split(" ");
        if (parts.length == 1){
            const markingParts = parts[0].replace(")","").split(/[,(]/);
            if (markingParts.length == 1) {
                graph.addEvent(markingParts[0])
            }
            else {
                graph.addEvent(markingParts[0], markingParts[0], m= {ex: markingParts[1] == 1, in: markingParts[2] == 1, pe: markingParts[3] == 1})
            }

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
                    // graph.getEvent(targetEventName).marker.included = false;
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
        // DCR = dcrGraphCreator(rule1)
        // DCR = dcrGraphCreator(rule2)
        // DCR = dcrGraphCreator(rule3)
        // DCR = dcrGraphCreator(rule4)
        // DCR = dcrGraphCreator(rule5)
        // DCR = dcrGraphCreator(rule6)
        // DCR = dcrGraphCreator(rule7)
        DCR = dcrGraphCreator(rule8)


        // DCR =  new DCRGraph();
        // ruleNr1(DCR);
        // ruleNr1()
        // ruleNr2()
        
            for (const action of trace_dict[ID]){ // for (action = 1; action < listOfLists.length; action++){
                console.log("action" ,action)
                // check if executing an excluded activity
                // if (!DCR.getEvent(action).marking.included && DCR.execute(action)) {
                // console.log("\n\n",graph.getEvent(action) ,"\n\n")    
                if (DCR.getEvent(action) == undefined)  {
                    DCR.execute("other")
                }
                else {
                    if (!DCR.getEvent(action).marking.included) {
                        console.log("excluded: ", DCR.getEvent(action).marking.included)
                        failed +=1
                        break; 
                    }
                    DCR.execute(action)
                }
            } 
            if (DCR.isAccepting()) {
                passed += 1
                console.log("PASS")
            } else {
                failed +=1
                console.log("FAILS") 
            }
            console.log(DCR.status())
        }
        // rule 4 ||rule 7 || rule 8 can both fail a trace, but also have an isAccepting trace (surcomvent the math) (MILESTONE ERROR!!!!!)
        if (passed + failed > Object.keys(trace_dict).length ) {
            passed -= failed
        }
        console.log("Passed: ", passed, "\nFailed: ",failed)
}

// DCR = dcrGraphCreator(rule1)
check()

