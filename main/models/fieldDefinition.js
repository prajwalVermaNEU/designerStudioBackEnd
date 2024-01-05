import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fieldDefinitionSchema = new Schema({
    processId: {
        type: String,
        required: true
    },
    fieldId:{
        type: String,
        required: true
    },
    fieldName: {
        type: String,
        required: true
    },
    fieldType:{
        type: String,
        required: true
    }
    
},
{
    versionKey: false
});

const fieldDefinitionModel = mongoose.model('fieldDefinition', fieldDefinitionSchema);

export default fieldDefinitionModel;

