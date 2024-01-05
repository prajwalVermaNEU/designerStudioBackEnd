import mongoose from "mongoose";

const Schema = mongoose.Schema;

const flowDefinitionSchema = new Schema({
    processId: {
        type: String,
        required: true
    },
    source:{
        type: String,
        required: true
    },
    target:{
        type: String,
        required: true
    },
    condition:{
        type: String,
        required: true 
    }
},
{
    versionKey: false
});

const flowDefinitionModel = mongoose.model('flowDefinition', flowDefinitionSchema);

export default flowDefinitionModel;

