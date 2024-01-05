import Process from '../models/process.js';
import txnDefinitionModel from '../models/transactionDefinition.js';
import stepDefinitionModel from '../models/stepDefinition.js';
import fieldDefinitionModel from '../models/fieldDefinition.js';
import flowDefinitionModel from '../models/flowDefinition.js';
export const txnDefinition = 'txnDefinition';
export const stepDefinition = 'stepDefinition';
export const fieldDefinition = 'fieldDefinition';
export const flowDefinition = 'flowDefinition';

export const search = async (params={}) => {
    console.log(params);
    const requiredProcess = await Process.find(params).exec();
    return requiredProcess;
}

export const save = async (newProcess) => {
    const process = new Process(newProcess);
    return process.save();
}

export const update = async(updatedProcess, id) =>{
    const process = await Process.findByIdAndUpdate(id, updatedProcess).exec();
    return process;
}

export const getAllProcess = async () => {
    return Process.find({});
}

export const remove = async(id)=>{
    return Process.findByIdAndDelete(id).exec();
}

export const findIds = async ( tableName ) => {
    switch(tableName){
        case txnDefinition : {
            return txnDefinitionModel.find({});
        }

        case stepDefinition : {
            return stepDefinitionModel.find({});
        }

        case fieldDefinition : {
            return fieldDefinitionModel.find({});
        }

        case flowDefinition : {
            return flowDefinitionModel.find({});
        }

        default :{
            console.log("ERROR! coming to the default option ...");
        }
    }
}

export const deleteById = ( tableName, id) => {
    switch(tableName){
        case txnDefinition : {
            return txnDefinitionModel.findByIdAndDelete(id).exec();
        }

        case stepDefinition : {
            return stepDefinitionModel.findByIdAndDelete(id).exec();
        }

        case fieldDefinition : {
            return fieldDefinitionModel.findByIdAndDelete(id).exec();
        }

        case flowDefinition : {
            return flowDefinitionModel.findByIdAndDelete(id).exec();
        }

        default :{
            console.log("ERROR! coming to the default option ...");
        }
    }
}

export const saveData = async ( currentObject, tableName) => {
    
    switch(tableName){
        case txnDefinition : {
            const requiredObject = new txnDefinitionModel(currentObject);
            return requiredObject.save();
        }

        case stepDefinition : {
            const requiredObject = new stepDefinitionModel(currentObject);
            return requiredObject.save();
        }

        case fieldDefinition : {
            const requiredObject = new fieldDefinitionModel(currentObject);
            return requiredObject.save();
        }

        case flowDefinition : {
            const requiredObject = new flowDefinitionModel(currentObject);
            return requiredObject.save();
        }

        default :{
            console.log("ERROR! coming to the default option ...");
        }
    }

}
