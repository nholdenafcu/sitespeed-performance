const environments = ['stg', 'tst'];
const loginScript = require('../scripts/login');

module.exports = async function(context, commands) {
    // For each environment in the environments list, run the loginScript found in the `../scripts` directory
    for(let environment of environments) {
        await loginScript(context, commands, environment);
    }  
}