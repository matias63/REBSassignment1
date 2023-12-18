import DCRGraph from dcr 


const graph = DCRGraph(events)

const events = [
"A(0,0,0)",        
"B(0,1,1)",        
"A -->* B",
"B *--> A",
"C -->% A",
"D -->+ A",    
"D -->* B",
"A --><> (B, D)"
];



for (const e of events){
    const parts = events[e].split("/\s+/");
    if (length(parts) == 1){
        const markingParts = events[e].split("(",",",")")
        e.marking = new Marking(markingParts[1], markingParts[2], markingParts[3])
        // markingParts[0] = e.marking
        e.name = markingParts[0]
    }


    elif (length(parts) > 3)
    {
        const eventName = parts[0] 
        const relationType = parts[1]
        for (let i = 2; i < length(parts); i++){
            const targetEventName = parts[i].replace("(", "").replace(")","").replace(",", "")
            switch (relationType) {
                case "-->*":
                    graph.addCondition(eventName, targetEventName);
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
                    graph.addMilestone(eventName,targetEventName)
                default:
                    break;
            }
        }
    }
}

