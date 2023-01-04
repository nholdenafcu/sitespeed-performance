const environments = ['stg', 'tst'];
const loginScript = require('../scripts/login');

module.exports = async function(context, commands) {
    for(let environment of environments) {
        await loginScript(context, commands, environment);
    }  
}