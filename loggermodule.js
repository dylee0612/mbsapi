const mkLogger = require('./lib/logger');
const fs = require('fs');
const path = require('path');

//const logsFolderPath = 'C:/AIMUSIC/logs';
const logsFolderPath = 'E:/workspace/AIMUSIC/logs';
const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD 형식
const logFileName = `node_app_${currentDate}.log`;
const logFilePath = path.join(logsFolderPath, logFileName);

const loggerOptions = {
  notification: {
    "useSMTP": true,
    "smtpOptions": { "host": "10.10.16.77", "port": 25, "secure": false },
    "sender": "dylee@sbs.co.kr",
    "receiver": "dylee@sbs.co.kr",
    "subjectHeader": "[node_err]"
  },
  logLevel: 'info',
  logFile: logFilePath,
  rotateLogFile: true,
  //rotateLogFilePath: 'C:/AIMUSIC/logs'
  rotateLogFilePath: 'E:/workspace/AIMUSIC/logs'
};

const loggermodule = mkLogger(loggerOptions);

module.exports = loggermodule;

















/*
const mkLogger = require('./lib/logger');
const fs = require('fs');
const path = require('path');

// logs 폴더 경로
const logsFolderPath = 'E:/workspace/AIMUSIC/logs';
//const logsFolderPath = 'C:/AIMUSIC/logs';

// 함수를 사용하여 로그 파일 이름 생성 및 업데이트
function updateLogFileName() {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD 형식
  const logFileName = `node_app_${currentDate}.log`;
  const logFilePath = path.join(logsFolderPath, logFileName);

  return logFilePath;
}

// 초기 로그 파일 경로 생성
let logFilePath = updateLogFileName();

let loggerOptions = {
  notification: {
    "useSMTP": true,
    "smtpOptions": { "host": "10.10.16.77", "port": 25, "secure": false },
    "sender": "dylee@sbs.co.kr",
    "receiver": "dylee@sbs.co.kr",
    "subjectHeader": "[node_err]"
  },
  logLevel: 'info',
  logFile: logFilePath, // logFile 속성을 사용하고 logFilePath를 전달
  rotateLogFile: true,
  rotateLogFilePath: 'E:/workspace/AIMUSIC/logs'
};

let loggermodule = mkLogger(loggerOptions);

// 매일 자정에 updateLogFileName 함수 호출
function scheduleMidnightTask() {
  const now = new Date(); // 현재 서버 시간 가져오기

  // 로그 파일 이름이 현재 날짜와 다를 때만 업데이트
  let newLogFilePath = updateLogFileName();

  if (logFilePath !== newLogFilePath) {
    logFilePath = newLogFilePath; // 로그 파일 경로 업데이트
    loggerOptions.logFile = logFilePath; // loggerOptions에도 업데이트된 경로 설정
    loggermodule = mkLogger(loggerOptions); // 로거 모듈 초기화
  }
  
  // 자정까지 남은 시간 계산
  const tomorrowMidnight = new Date(now);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  tomorrowMidnight.setHours(0, 0, 0, 0);
  const timeUntilMidnight = tomorrowMidnight - now;

  setTimeout(scheduleMidnightTask, timeUntilMidnight);
}

// 애플리케이션이 시작될 때 한 번 호출하고, 이후에는 자정에 주기적으로 호출
scheduleMidnightTask();

module.exports = loggermodule;


*/