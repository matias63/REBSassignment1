

function R8 (trace) 
{
    tracesAccepted = 0
    abandonExecutedAlready = false
    for (event in trace) {
        if (event == "Execute_Abandon" && abandonExecutedAlready == true) {
            console.log("error....")
        }
        else {
            tracesAccepted ++;
        }
    }
}


