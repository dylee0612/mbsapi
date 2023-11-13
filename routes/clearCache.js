/* 
설명 : 캐시 삭제 API
작성자 : 이도용
최종수정 : 2023.11.08
*/

const express = require('express');
const router = express.Router();
const axios = require('axios')



// 캐시 삭제
router.get('/', async function(req, res, next) {
  try {
    const url1 = 'http://10.11.32.52:3011/clearCache';
    const url2 = 'http://10.11.32.53:3011/clearCache';



    // Axios를 사용한 HTTP 요청 
    axios.all([
      axios.get(url1),
      axios.get(url2)
    ])
    .then(axios.spread(function (response1, response2) {
      // 여기에서 response1과 response2는 각각의 요청에 대한 응답입니다.
      
      // 요청이 성공한 경우
      res.status(200).json({
        ok: true,
        autocomplete1: response1.data, 
        autocomplete2: response2.data
      });
      
     // logger.info(url1);
     // logger.info(url2);
    }))
    .catch(function (errors) {
      // 여기에서 errors는 각각의 요청 중 실패한 경우의 에러입니다.
     // logger.error(errors);
    //  res.status(400).json({ ok: false, errors });
    });

  } catch (err) {
   // logger.error(err);
  }
});

module.exports = router;
