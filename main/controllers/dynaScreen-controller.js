import { application } from 'express';
import * as processService from '../services/process-service.js';

const getTheId = ( providedId ) => {
    let requiredNum = Number( providedId.substring( providedId.length-2, providedId.length) ) + 1;
    return requiredNum > 9?requiredNum+'':'0'+requiredNum;
}

const getTheStartStep = async (processId) => {
    let requiredArray = await processService.findIds(processService.stepDefinition);
    let currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);

    for( let i in currentProcessArray){
        if( 
            currentProcessArray[i].processId === processId &&
            currentProcessArray[i].stepType === 'bpmn:startEvent'
        ) {
            return currentProcessArray[i].stepId;
        }
    }
    return undefined;
}

//NOTE UPDATE A PROCESS : 
// flowDefinition -> transactionDefinition
export const put = async ( request, response) => {
    try{
        // there will be two scenarios:
        // 1. wether the transaction will continue or not
        let processId = request.params.id;
        let stepId = request.params.stepId;
        let condition = request.params.response;

        let requiredTarget = 'INIT';
        let requiredArray = await processService.findIds(processService.flowDefinition);
        let currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        let isEnd = true;
        for( let i in currentProcessArray ) {
            if( 
                currentProcessArray[i].source === stepId &&
                (
                    currentProcessArray[i].condition == 'N/A' ||
                    currentProcessArray[i].condition == condition
                )
            ){
                isEnd = false;
                requiredTarget = currentProcessArray[i].target
                break;
            }
        }

        // 2. the transaction will be terminated and the following up will new trx. initiated
        if( isEnd ) {
            let requiredArray = await processService.findIds(processService.txnDefinition);
            let currentProcess = requiredArray.filter( currentProcess => (
                currentProcess.processId === processId &&
                currentProcess.status === 'RUNNING'
            ))[0];
            console.log('Now deleting the process: ', currentProcess);
            await processService.deleteById( processService.txnDefinition, currentProcess._id);

            await processService.saveData( {
                processId: processId,
                currentStep: stepId,
                transactionId: currentProcess['transactionId'],
                status: 'COMPLETED'
            }, processService.txnDefinition);

            console.log(getTheId(currentProcess.transactionId));

            await processService.saveData({
                processId: processId,
                currentStep: await getTheStartStep(processId),
                transactionId: 'NEU'+processId+getTheId(currentProcess.transactionId),
                status: 'RUNNING'
            }, processService.txnDefinition);
        } else {
            let requiredArray = await processService.findIds(processService.txnDefinition);
            let currentProcess = requiredArray.filter( 
                currentProcess => currentProcess.processId === processId &&
                currentProcess.status === 'RUNNING'
            )[0];
            await processService.deleteById( processService.txnDefinition, currentProcess._id);

            await processService.saveData( {
                processId: processId,
                currentStep: requiredTarget,
                transactionId: currentProcess.transactionId,
                status: 'RUNNING'
            }, processService.txnDefinition);
        }

        response.status(200)
         .json({
            message: "Successful! The Txn is updated."
         });
    }catch(err){
        console.log(err);
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }
}

//NOTE: GET A PROCESS : 
// NOTE: transactionDefinition -> stepDefinition -> fieldDefinition
export const find = async ( request, response) => {
    try {
        let processId = request.params.id;
        let requiredObject = {};
        let requiredStep = 'INIT';
        let requiredArray = await processService.findIds(processService.txnDefinition);
        let currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in currentProcessArray) {
            if( currentProcessArray[i].status === 'RUNNING') {
                requiredObject = {
                    processId : processId,
                    stepId : currentProcessArray[i].currentStep,
                    transactionId : currentProcessArray[i].transactionId,
                };

                requiredStep = currentProcessArray[i].currentStep;
            }
        }

        requiredArray = await processService.findIds(processService.stepDefinition);
        currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        let requiredFieldsIds = [];
        for( let i in currentProcessArray) {
            if( currentProcessArray[i].stepId === requiredStep ) {
                requiredObject = {
                    ...requiredObject,
                    stepName : currentProcessArray[i].stepName,
                    stepType : currentProcessArray[i].stepType,
                    fields : [],
                    responses : JSON.parse( currentProcessArray[i].responses)
                };
                requiredFieldsIds = JSON.parse( currentProcessArray[i].fieldOrder);
            }
        }
        requiredArray = await processService.findIds(processService.fieldDefinition);
        currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in requiredFieldsIds) {
            for( let j in currentProcessArray) {
                if( currentProcessArray[j].fieldId == requiredFieldsIds[i]){
                    requiredObject = {
                        ...requiredObject,
                        fields : [
                            ...requiredObject.fields,
                            {
                                fieldName: currentProcessArray[j].fieldName,
                                fieldType: currentProcessArray[j].fieldType
                            }
                        ]
                    }
                    break;
                }
            }
        }
        response.status(200)
        .json(requiredObject);
    } catch(err) {
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }

}