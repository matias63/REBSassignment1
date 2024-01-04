// import DCRGraph from dcr 


//////// READ LOG.csv AND SAVE AS DICT DATA STRUCTURE

const fs = require('fs');
const path = require('path');
const {DCRGraph, Marking, Event} = require('./dcr'); // You don't need to add the '.js' extension
// import {readCSV} from './csv_reader';
const { readCSV } = require('./csv_reader');

function create_trace_dict(listOfLists){
    /// Convert list to dictionary
    trace_dict = {}
    for (i = 0; i < listOfLists.length; i++){
        if (!trace_dict[listOfLists[i][0]]) {
            trace_dict[listOfLists[i][0]] = [listOfLists[i][1]]
        } else {
            trace_dict[listOfLists[i][0]].push(listOfLists[i][1])
        }
    }
    // console.log("Trace dict: ", trace_dict)    // DISPLAY TRACE DICTIONARY
    return trace_dict
}

const rule1 = new Event()
rule1.events = [
    "fill_out_application",
    "other",
    "fill_out_application -->* other"
    ];
      
const rule2 = new Event()
rule2.events = [
    /////// outcommented: goes from passed/failed =  0/594 to   304/ 290   (the outmarked was if it was milestones)
    "lawyer_review",
    // "other",
    "architect_review",
    // "other *--> lawyer_review",
    // "other *--> architect_review",
    "architect_review -->% lawyer_review",
    "lawyer_review -->% architect_review"
    // "architect_review --><> lawyer_review",
    // "lawyer_review --><> architect_review"
    ];

const rule3 = new Event()
rule3.events = [
    "applicant_informed",
    "change_phase_to_abort",
    "reject",
    "reject *--> applicant_informed",
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
    "execute_abandon -->% execute_abandon",
    "execute_abandon -->% other"
    ];

///// CREATE GRAPH
function dcrGraphCreator(event) {
    graph = new DCRGraph();

    for (const e of event.events){
        const parts = e.split(" ");
        if (parts.length == 1){
            const markingParts = parts[0].replace(")","").split(/[,(]/);
            if (markingParts.length == 1) {
                graph.addEvent(markingParts[0])
            } else {
                graph.addEvent(markingParts[0], l= markingParts[0], m= {ex: markingParts[1] == 1, in: markingParts[2] == 1, pe: markingParts[3] == 1})
            }
        } else if (parts.length = 3) {
            const eventName = parts[0] 
            const relationType = parts[1]
            const targetEventName = parts[2]
            switch (relationType) {
                case "-->*":
                    graph.addCondition(eventName, targetEventName);
                    break;
                case '*-->':
                    graph.addResponse(eventName, targetEventName);
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
        } else {
            console.log("\n\n parts not equal to 1 or 3?? \n\n")
        }
    }
    return graph;
}

function check(rules){
    let total_pass = 0
    let total_fail = 0
    let trace_count = 0
    for (let i = 1; i < rules.length+1; i++) {      // Iterate through rules
        const currentRule = rules[i-1];  // Displays element 0 as element 1 for simplicity
        curr_rule_passed = 0
        curr_rule_failed = 0      
        for (const ID in trace_dict){
            DCR = dcrGraphCreator(currentRule);
            trace_count +=1
            for (const action of trace_dict[ID]){ // for (action = 1; action < listOfLists.length; action++){
                if (DCR.getEvent(action) == undefined)  {
                    if (DCR.getEvent("other") == undefined){
                        DCR.addEvent("other")
                    }
                    DCR.execute("other")
                } else {
                    // fail if executing an excluded activity and break to next rule
                    if (!DCR.getEvent(action).marking.included) {
                        curr_rule_failed +=1
                        break; 
                    }
                    DCR.execute(action)
                }
            }
            if (DCR.isAccepting()) {
                curr_rule_passed += 1
            } else {
                curr_rule_failed +=1
            }
        }
        // MILESTONE ERROR!!!!! (fails and passes counting)
        // rule 4 ||rule 7 || rule 8 can both fail a trace, but also have an isAccepting trace (surcomvents the math to consider the error)
        if (curr_rule_passed + curr_rule_failed > Object.keys(trace_dict).length ) {
            curr_rule_passed -= curr_rule_failed
        }
        console.log("Rule:",i, " \t Passed: ", curr_rule_passed, "\t Failed: ",curr_rule_failed)
        total_pass += curr_rule_passed
        total_fail += curr_rule_failed
        }
    console.log("\nTotal \t \t Passed: ", total_pass, "\t Failed: ",total_fail)
    console.log("traces run: ",trace_count/rules.length,"/",(total_pass+total_fail)/rules.length)
    
    }

const args = process.argv.slice(2);
// Ensure there are enough arguments
if (args.length < 2) {
    console.error('Usage: node main3.js <csvFile> <ruleNumbers>');
    process.exit(1);
}

const csvFile = args[0];
const ruleNumbersArg = args[1];

console.log(`\n\nRunning tests for CSV file: ${csvFile}`);

// Read the CSV file
readCSV(csvFile);

// Read the JSON file
const jsonData = fs.readFileSync('output.json', 'utf-8');

// Parse the JSON data
const listOfLists = JSON.parse(jsonData);

// Create trace dictionary
create_trace_dict(listOfLists);

// Parse the rule numbers from the command line arguments
const ruleNumbers = ruleNumbersArg.split(',').map(Number);

// Filter the rules based on the provided rule numbers
const rulelist = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8].filter((rule, index) => ruleNumbers.includes(index + 1));

// Run the checks for the selected rules
check(rulelist);