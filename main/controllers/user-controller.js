import * as userService from '../services/user-service.js';
import * as processService from '../services/process-service.js';

// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt';
const saltRounds = 10;

export const post = async ( request, response) => {
    try{
        const newUser = {...request.body};
        console.log(newUser);
        // bcrypt.hash( newUser.password, saltRounds, async (err, hash) => {
        bcrypt.hash(newUser.PASSWORD, saltRounds, async function(err, hash) {

            console.log(err);
            console.log(hash);
            if( err) {
                response.status(500)
                .json ({
                    code: "ServiceError",
                    message: "Error occurred while processing the request"
                });
            } else {
                await userService.save({
                    username:newUser.USERNAME,
                    email:newUser.EMAIL,
                    password: hash,
                    processList:'N/A'
                });
                response.status(200)
                .json({
                    msg:"Success!, the user is created."
                });
            }
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

export const find = async ( request, response) => {
    try {
        const params = {...request.query};
        console.log(params);
        const allUsers = await userService.allData();
        let requiredUserCredentials = allUsers.filter( currentUser => currentUser.username === params.username);
        console.log(requiredUserCredentials);

        if( requiredUserCredentials.length == 0){
            response.status(404)
            .json(false);
        }
        else{
            bcrypt.compare(params.password, requiredUserCredentials[0].password, async (err, result) => {
                console.log(err);
                console.log(result);
                if( err ) {
                    response.status(404)
                    .json({
                        msg:'Invalid Password!'
                    });
                }

                if( result ){
                    if( requiredUserCredentials.processList === 'N/A'){
                        response.status(200)
                        .json({
                            processList : []
                        });
                    } else{
                        let allProcess = await processService.getAllProcess();
                        let requiredList = requiredUserCredentials[0].processList.split(',');
                        let requiredArray = [];
                        for( let i in allProcess){
                            if( requiredList.includes(allProcess[i].processId)){
                                requiredArray.push({
                                    processId: allProcess[i].processId,
                                    processDescription: allProcess[i].processDescription
                                });
                            }
                        }
        
                        response.status(200)
                        .json({
                            processList : requiredArray
                        });
                    }
                }
                else{
                    response.status(404)
                    .json({
                        msg:'Invalid Password!'
                    });
                }
            });
        }
    } catch(err) {
        console.log(err);
        response.status(500)
        .json ({
            code: "ServiceError",
            message: "Error occurred while processing the request"
        });
    }

}