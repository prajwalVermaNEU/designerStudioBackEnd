export const getTheId = ( allProcessIds ) => {
    console.log(allProcessIds);
    let requiredNum = allProcessIds.map( currentId => Number(currentId.substring(1,4)));
    requiredNum.sort(function(n1,n2){return n1-n2});
    console.log(requiredNum);
    if( requiredNum[requiredNum.length -1]+1 > 9){
        return 'H0' + (requiredNum[requiredNum.length-1] + 1);
    }
    return 'H00' + (requiredNum[requiredNum.length-1] + 1);
}

export const getTheTargetObject = ( connectors, currentElement, validElements, allConditions) => {
    let requiredArray = [];
    for( let i in connectors){
        if( connectors[i][0].source === currentElement){
            if( validElements.includes( connectors[i][1].target ) ){
                requiredArray.push({
                    TARGET : connectors[i][1].target,
                    CONDITION: allConditions[connectors[i][1].elementId]?allConditions[connectors[i][1].elementId]:'N/A'
                });
            }
        }
    }
    return requiredArray;
}