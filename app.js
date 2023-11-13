const createError = require('http-errors');
const express = require('express');
const ipfilter = require('express-ipfilter').IpFilter
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const errorRouter = require('./routes/error');
const updatesongRouter = require('./routes/updatesong');
const requestRouter = require('./routes/request');
const clearCacheRouter = require('./routes/clearCache');
const app = express();
global.musicdb = require('./dbConnection');
global.logger = require('./loggermodule'); 

// engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

async function main(service) {
  try {
    const result = await musicdb.query(`SELECT IP FROM music.ALLOWEDIPS where allow = '${service}' `)
    const ipAddresses = result.map(row => row.IP);
    return ipAddresses;
  } catch (err) {
    logger.error(err);
  }
}

const ipFilterMiddleware = (service) => { // 라우터별로 다른 인자를 받을 수 있음
  return async (req, res, next) => {
    // IP 주소 배열을 가져올 비동기 함수 호출 (예: main 함수)
    async function getIPAddresses(service) {
      let ipAddresses;
      try {
        const result = await main(service); 
        if (Array.isArray(result)) {
          // main() 함수에서 IP 주소를 가져왔을 때만 업데이트
          ipAddresses = result;
        }
      } catch (err) {
        logger.error(err);
      }
      // IP 필터 적용
      const ipFilter = ipfilter(ipAddresses, {
        mode: 'allow',
        errorMessage: 'Not Allowed IP ( call 02-2113-6892 )'
      });

       // 에러 핸들링 미들웨어 함수
       const errorHandler = (err) => {
        if (err) {
          // 에러가 발생한 경우 클라이언트에게 에러 메시지 응답
          res.status(403).json({ error: err.message });
        } else {
          // 허용된 IP 주소인 경우 다음 미들웨어로 이동
          next();
        }
      };
      // ipFilter 함수를 실행하고 errorHandler 함수를 콜백으로 전달
      ipFilter(req, res, errorHandler);
    }
    await getIPAddresses(service);
  };
};

app.use('/', indexRouter);
app.use('/error',ipFilterMiddleware('aimusic') ,errorRouter);
app.use('/updatesong', ipFilterMiddleware('aimusic'), updatesongRouter);
app.use('/request', ipFilterMiddleware('aimusic'), requestRouter);
app.use('/clearCache', ipFilterMiddleware('aimusic'), clearCacheRouter);

// 에러 핸들링 
app.use((err, req, res, next) => {
  logger.error('Error level', err);
  res.status(400).json({ ok: false, err })
});




module.exports = app;


