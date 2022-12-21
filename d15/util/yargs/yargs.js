const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).options({
    'port': {
        alias: 'p',
        description: 'port to bind on',
        default: 8080
    },
    'mode': {
        alias: 'mod',
        default: 'FORK'
    }
}).argv

module.exports = argv;