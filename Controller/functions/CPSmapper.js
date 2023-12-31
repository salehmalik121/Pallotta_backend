const CPSmapper = (cut , polish , sym , clarity)=>{

    const orderArray = ["G" , "VG" , "EX" , "I"]
    const clarityOrder = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"];

    const mappedCPS = {};
    mappedCPS.cut = orderArray.indexOf(cut);
    mappedCPS.polish = orderArray.indexOf(polish);
    mappedCPS.sym = orderArray.indexOf(sym);
    mappedCPS.cls = clarityOrder.indexOf(clarity);

    return mappedCPS;

}

module.exports = CPSmapper