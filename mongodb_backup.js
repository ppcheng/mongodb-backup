var mongodbUri = require('mongodb-uri');
var program    = require('commander');
var exec       = require('child_process').exec;

program
  .version('0.0.1')
  .description('Pull down a local copy of a target cloud mongodb database and restore it to localhost.')
  .option('-l, --url <url>', 'mongodb connection string')
  .parse(process.argv);

if (program.url) {
    var mongoUriObj = mongodbUri.parse(program.url);
    console.log('The parsed mongodb connection string is as follows:');
    console.log(mongoUriObj);
    
    var cmd = 'mongodump';
    cmd += ' ' + '--host ' + mongoUriObj.hosts[0].host + ':' + mongoUriObj.hosts[0].port;
    cmd += ' ' + '--db ' + mongoUriObj.database;
    cmd += ' ' + '-u ' + mongoUriObj.username;
    cmd += ' ' + '-p' + mongoUriObj.password;
    console.log(cmd);
    exec(cmd, function(err, stdout, stderr) {
        if (err !== null) {
            console.log('error:' + err);
        }        
        console.log('stdout: ' + stdout);
        console.log('stderr:' + stderr);
        
        var restorecmd = 'mongorestore --host localhost:27017 --db ' + mongoUriObj.database;
        restorecmd += ' --drop dump/' + mongoUriObj.database; 
        exec(restorecmd, function(err, stdout, stderr) {
            if (err) {
                console.log('error:' + err);
            }        
            console.log('stdout: ' + stdout);
            console.log('stderr:' + stderr);            
        })
    });
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}