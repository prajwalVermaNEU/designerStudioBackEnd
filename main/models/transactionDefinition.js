import mongoose from "mongoose";

const Schema = mongoose.Schema;

const txnDefinitionSchema = new Schema({
    processId: {
        type: String,
        required: true
    },
    currentStep:{
        type: String,
        required: true
    },
    transactionId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }
},
{
    versionKey: false
});

const txnDefinitionModel = mongoose.model('transactionDefinition', txnDefinitionSchema);

export default txnDefinitionModel;

