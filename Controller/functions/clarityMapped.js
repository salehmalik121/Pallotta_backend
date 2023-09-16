const CPSmapper = (cut)=>{

    const orderArray = ["G" , "VG" , "EX" , "I"]

    const mappedCPS = {};
    mappedCPS.cut = orderArray.indexOf(cut);
    mappedCPS.polish = orderArray.indexOf(polish);
    mappedCPS.sym = orderArray.indexOf(sym);
    
    return mappedCPS;

}

module.exports = CPSmapper