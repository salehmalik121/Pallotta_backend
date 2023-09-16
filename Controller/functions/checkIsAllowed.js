
const checkIsValid = (deletedList , stoneId) =>{


    let isValid = true;
    
    deletedList.forEach(element => {
        if(element.stoneId === stoneId){
            isValid = false;
        }
    });

    return isValid;

}

module.exports = checkIsValid;