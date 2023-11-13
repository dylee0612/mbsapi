/* 
설명 : 참여아티스트 조회 API 
작성자 : 이도용
최종수정 : 2023.09.20
*/
const express = require('express');
const router = express.Router();
const main = require('./function'); 

router.get('/', async function(req, res, next) {

  try {
    const id = req.query.id;
    const query = `select 
    a.id,
    a.event_time,
    a.iud_type,
    a.receipt_no||a.reg_no as key, 
    a.SEQ_NO,
    c.ARTIST,
    c.attend_type,
    c.musical_instrument,
    c.musical_range
    from  music.ai_attend_log a
    left outer join music.song_dtl c
    ON  a.RECEIPT_NO = c.receipt_no AND A.REG_NO = c.reg_no and a.seq_no = c.seq_no
    where   a.id >= ${id}
    order by a.id asc`;

    const result = await main.query(query);
    if (result.result !== 0){
      res.status(200).json({ ok: true, data: result.result });
      logger.info(query)
    } else {
      logger.error(result.error);
      res.status(400).json({ ok: false, err : result.error })
    }
   } catch (err) {
    logger.error(err)
   }
 });


module.exports = router;