const tracer = require('tracer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

function getTodyFileName(logsFolderPath) {
     const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD 형식
   // const currentDate = Date.now().toString().substr(0,9);
    const logFileName = `node_app_${currentDate}.log`;
    const logFilePath = path.join(logsFolderPath, logFileName);  
    return logFilePath;
}

function mkLogger(opts){

    const {logLevel, logFile, rotateLogFile, rotateLogFilePath} = opts;
    const {
        sender, 
        receiver, 
        subjectHeader, 
        smtpOptions={}
    } = opts.notification;

    const mailer = nodemailer.createTransport(smtpOptions);
    const mailNotification = function(level, tracerData){	
        if(tracerData.title === level){
            const subject = `${subjectHeader} : ${tracerData.message}`;
            const body = tracerData.output;
            const mailOPtions = {
                    from : sender,
                    to : receiver,
                    subject : subject,
                    text : body
            };
            mailer.sendMail(mailOPtions,function(err,result){
                if(err){
                    return console.log(err);
                } 
                console.log('Mail Sent Successfully');
            });
        }
    };
 
    const consoleOpts =  {
        format : "{{timestamp}} [{{title}}] {{message}} (in {{file}}:{{line}})",	
        dateformat: 'yyyy-mm-dd HH:MM:ss.l',
        level:logLevel,
        stackIndex : 0,
        transport : [
            function(data){
                if(rotateLogFile) return;
                fs.appendFile(logFile, data.output + '\n', function(err){  
                    if(err) {
                        throw err;
                    }
                });
            },
            function(data){
                console.log(data.output);
            },
            function(data){
                if(!rotateLogFile) return;
                const logFile = getTodyFileName(rotateLogFilePath);
                fs.appendFile(logFile, data.output + '\n', function(err){  
                    if(err) {
                        throw err;
                    }
                });
            }    
        ]
    }

    if(opts.notification.useSMTP) {
        consoleOpts.transport.push((data) => {
            mailNotification('error', data);
        })
    }

    const logTracer = tracer.console(consoleOpts); 
    return logTracer
}

module.exports = mkLogger;