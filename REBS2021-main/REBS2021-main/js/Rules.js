const { DCRGraph } = require('./dcr'); // Adjust the path based on your file structure

// Rule 1: Fill out application should always be the first event of the case.
// function rule1(dcrGraph) {
//     const fillOutApplication = dcrGraph.addEvent('Fill_out_application');
//     // const otherEvents = dcrGraph.events.values();
//     const otherEvents = dcrGraph.events;
//     console.log(otherEvents)
//     for (const event of otherEvents) {
//         if (event !== fillOutApplication) {
//             dcrGraph.addExclude(fillOutApplication.name, event.name);
//         }
//     }
// }

function rule1(dcrGraph) {
    const fillOutApplication = dcrGraph.addEvent('Fill_out_application');
    const otherEvents = dcrGraph.events.values();
    // const otherEvents = dcrGraph.events;
    // console.log(otherEvents)
    
    if (otherEvents[1] !== fillOutApplication) {
        console.log("R1 failed")
        // dcrGraph.addExclude(fillOutApplication.name, event.name);
    }
    
}

// Rule 2: Lawyer Review and Architect Review should never occur together.
function rule2(dcrGraph) {
    const lawyerReview = dcrGraph.getEvent('Lawyer_Review');
    const architectReview = dcrGraph.getEvent('Architect_Review');

    if (lawyerReview && architectReview) {
        dcrGraph.addExclude(lawyerReview.name, architectReview.name);
    }
}

// Rule 3: Reject should always eventually be followed by Applicant informed and Change phase to Abort.
function rule3(dcrGraph) {
    const reject = dcrGraph.getEvent('Reject');
    const applicantInformed = dcrGraph.getEvent('Applicant_informed');
    const changePhaseToAbort = dcrGraph.getEvent('Change_phase_to_Abort');

    if (reject && applicantInformed && changePhaseToAbort) {
        dcrGraph.addResponse(reject.name, applicantInformed.name);
        dcrGraph.addResponse(reject.name, changePhaseToAbort.name);
    }
}

// Rule 4: First payment should only occur once unless Undo payment is executed afterwards, in which case it may be repeated once.
function rule4(dcrGraph) {
    const firstPayment = dcrGraph.getEvent('First_payment');
    const undoPayment = dcrGraph.getEvent('Undo_payment');

    if (firstPayment && undoPayment) {
        dcrGraph.addExclude(undoPayment.name, firstPayment.name);
        dcrGraph.addResponse(undoPayment.name, firstPayment.name);
    }
}

// Rule 5: If Account number changed happens, then afterwards Approve changed account needs to be executed before one can execute First payment.
function rule5(dcrGraph) {
    const accountNumberChanged = dcrGraph.getEvent('Account_number_changed');
    const approveChangedAccount = dcrGraph.getEvent('Approve_changed_account');
    const firstPayment = dcrGraph.getEvent('First_payment');

    if (accountNumberChanged && approveChangedAccount && firstPayment) {
        dcrGraph.addCondition(accountNumberChanged.name, approveChangedAccount.name);
        dcrGraph.addExclude(firstPayment.name, approveChangedAccount.name);
    }
}

// Rule 6: Change Phase to Payout should always eventually be followed by First payment.
function rule6(dcrGraph) {
    const changePhaseToPayout = dcrGraph.getEvent('Change_Phase_to_Payout');
    const firstPayment = dcrGraph.getEvent('First payment');

    if (changePhaseToPayout && firstPayment) {
        dcrGraph.addResponse(changePhaseToPayout.name, firstPayment.name);
    }
}

// Rule 7: After Change Phase to Payout has happened, Change Phase to End Report should not happen before we do First Payment. If Change Phase to Payout did not happen, then Change Phase to End Report is not restricted by First payment.
function rule7(dcrGraph) {
    const changePhaseToPayout = dcrGraph.getEvent('Change_Phase_to_Payout');
    const changePhaseToEndReport = dcrGraph.getEvent('Change_Phase_to_End_Report');
    const firstPayment = dcrGraph.getEvent('First_payment');

    if (changePhaseToPayout && changePhaseToEndReport && firstPayment) {
        dcrGraph.addCondition(changePhaseToPayout.name, changePhaseToEndReport.name);
        dcrGraph.addExclude(firstPayment.name, changePhaseToEndReport.name);
    }
}

// Rule 8: Execute Abandon may happen at any time; after it is executed, only Change phase to Abandon may happen.
function rule8(dcrGraph) {
    const executeAbandon = dcrGraph.getEvent('Execute_Abandon');
    const changePhaseToAbandon = dcrGraph.getEvent('Change_phase_to_Abandon');

    if (executeAbandon && changePhaseToAbandon) {
        dcrGraph.addResponse(executeAbandon.name, changePhaseToAbandon.name);
    }
}

module.exports = {
    rule1,
    rule2,
    rule3,
    rule4,
    rule5,
    rule6,
    rule7,
    rule8,
};
