import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stepDefinitionSchema = new Schema({
    processId: {
        type: String,
        required: true
    },
    stepId:{
        type: String,
        required: true
    },
    stepName:{
        type: String,
        required: true
    },
    stepType: {
        type: String,
        required: true
    },
    fieldOrder:{
        type: String,
        required: true
    },
    responses:{
        type: String,
        required: true
    }
},
{
    versionKey: false
});

const stepDefinitionModel = mongoose.model('stepDefinition', stepDefinitionSchema);

export default stepDefinitionModel;

