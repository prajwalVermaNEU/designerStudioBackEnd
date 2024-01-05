import { application } from 'express';
import * as processService from '../services/process-service.js';
import * as userServices from '../services/user-service.js';
import processTemplate from '../templates/processTemplate.json' assert { type: "json" };
import {
    getTheId,
    getTheTargetObject
} from './util.js';


//NOTE: CREATE A NEW PROCESS : completed
export const post = async ( request, response) => {
    try{
        let allProcess = await processService.getAllProcess();
        let requiredProcessIds = allProcess.map( currentProcess => currentProcess.processId);
        let requiredId = getTheId(requiredProcessIds);
        let requiredProcessTemplate = {...processTemplate};
        requiredProcessTemplate.processId = requiredId;

        let requiredProcess = {
            processId: requiredId,
            processDescription: 'INIT',
            processDefinition : JSON.stringify(requiredProcessTemplate)
        }
        console.log(requiredProcess);
        const process = await processService.save(requiredProcess);


        let userName = request.params.id;
        const allUsers = await userServices.allData();
        let currentUser = allUsers.filter( currentUser => currentUser.username === userName)[0];
        if( currentUser.processList === 'N/A'){
            currentUser.processList = process.processId;
        } else {
            currentUser.processList = currentUser.processList + ',' + process.processId;
        }
        await userServices.update(currentUser, currentUser._id);


        response.status(200)
        .json(process);
    } catch(err) {
        console.log(err);
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }
}

//NOTE UPDATE A PROCESS : COMPLETED
export const put = async ( request, response) => {
    try{
        const processId = request.params.id;
        const updatedProcess = {...request.body};
        console.log('yes doing the changes', {
            processId: processId,
            processDescription: updatedProcess.processDescription,
            processDefinition : JSON.stringify(updatedProcess)
        });
        const requiredObject = {
            processId: processId,
            processDescription: updatedProcess.processDescription,
            processDefinition : JSON.stringify(updatedProcess)
        };
        console.log(requiredObject);
        let allProcess = await processService.getAllProcess();
        let currentProcessDetails = allProcess.filter( currentProcess => currentProcess.processId === processId);
        const process = await processService.update(requiredObject, currentProcessDetails[0]._id);
        response.status(200)
         .json(process);
    }catch(err){
        console.log(err);
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }
}

//NOTE: GET A PROCESS : COMPLETED
export const find = async ( request, response) => {
    try {
        const processId = request.params.id;
        const process = await processService.search({processId:processId});
        response.status(200)
        .json(process);
    } catch(err) {
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }

}

//NOTE: DELETE A PROCESS : COMPLETED
export const remove = async ( request, response) => {
    try{
        const processId = request.params.id;
        let allProcess = await processService.getAllProcess();
        let currentProcessDetails = allProcess.filter( currentProcess => currentProcess.processId === processId);
        const process = await processService.remove(currentProcessDetails[0]._id);
        response.status(200)
        .json({
            message: "Successful! The Process is deleted."
        });

    } catch(err) {
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }
}

// NOTE: THIS IS TO UPDATE THE PROCESS : COMPLETED
export const deploy = async ( request, response) => {
    try{
        const processId = request.params.id;
        console.log('Here is the data: ', processId);

        //DELETE ALL THE DATA IN THE TABLE FOR THE CURRENT PROCESS ID
        let requiredArray = await processService.findIds(processService.txnDefinition);
        let currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in currentProcessArray){
            await processService.deleteById( processService.txnDefinition, currentProcessArray[i]._id);
        }

        requiredArray = await processService.findIds(processService.stepDefinition);
        currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in currentProcessArray){
            await processService.deleteById( processService.stepDefinition, currentProcessArray[i]._id);
        }

        requiredArray = await processService.findIds(processService.fieldDefinition);
        currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in currentProcessArray){
            await processService.deleteById( processService.fieldDefinition, currentProcessArray[i]._id);
        }

        requiredArray = await processService.findIds(processService.flowDefinition);
        currentProcessArray = requiredArray.filter( currentProcess => currentProcess.processId === processId);
        for( let i in currentProcessArray){
            await processService.deleteById( processService.flowDefinition, currentProcessArray[i]._id);
        }

        //ADD ALL THE REQUIRED DATA IN THE TABLES FOR THE CURRENT PROCESS ID
        let requiredId = 'INIT';
        let elements = {...request.body.elements};
        for( let key in elements){
            if( 
                elements[key].elementType === 'bpmn:startEvent' ||
                elements[key].elementType === 'bpmn:userTask'
            ){
                await processService.saveData({
                    processId: processId,
                    stepId : elements[key].elementId,
                    stepName : elements[key].elementName,
                    stepType : elements[key].elementType,
                    fieldOrder : JSON.stringify( elements[key].fields ),
                    responses : JSON.stringify( elements[key].responses)
                }, processService.stepDefinition);
            }

            if( elements[key].elementType === 'bpmn:startEvent'){
                requiredId = elements[key].elementId;
            }
        }

        await processService.saveData({
            processId: processId,
            currentStep: requiredId,
            transactionId: 'NEU'+processId+'01',
            status: 'RUNNING'
        }, processService.txnDefinition);

        elements = {...request.body.fieldDefinitions};
        for( let key in elements) {
            await processService.saveData({
                processId: processId,
                fieldId: key,
                fieldName: elements[key].fieldName,
                fieldType : elements[key].fieldType
            }, processService.fieldDefinition)
        }

        let connectors = [ ...request.body.xmlConnectors];
        elements = {...request.body.elements};
        let validElements = [];
        for( let key in elements){
            if( 
                elements[key].elementType === 'bpmn:startEvent' ||
                elements[key].elementType === 'bpmn:userTask'
            ){
                validElements.push(key);
            }
        }

        for( let key in elements){
            if( 
                elements[key].elementType === 'bpmn:startEvent' ||
                elements[key].elementType === 'bpmn:userTask'
            ){
                let requiredObject = getTheTargetObject(connectors, elements[key].elementId, validElements, {...request.body.sequenceFlows});
                for( let i in requiredObject){
                    await processService.saveData({
                        processId : processId,
                        source : elements[key].elementId,
                        target: requiredObject[i].TARGET,
                        condition: requiredObject[i].CONDITION
                    },processService.flowDefinition);
                }
            }
        }

        response.status(200)
        .json({
            message: "Successful! Process is deployed."
        });
    } catch(err) {
        console.log(err);
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }
}