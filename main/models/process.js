import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProcessSchema = new Schema({
    processId: {
        type: String,
        required: true
    },
    processDescription:{
        type: String,
        required: true
    },
    processDefinition:{
        type: String,
        required: true
    }
},
{
    versionKey: false
});

const processModel = mongoose.model('processes', ProcessSchema);

export default processModel;

