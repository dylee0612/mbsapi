/* 
설명 : 희망음반 및 음원신청 API 
작성자 : 이도용
최종수정 : 2023.09.13
*/

const express = require('express');
const router = express.Router();
const main = require('./function'); 


 //전체조회  
 router.get('/all', async function(req, res, next) {


  try {
    const page = req.query.page || 1; // 페이지 번호
    const limit = req.query.limit || 10; // 한 페이지당 항목 수
    const offset = (page - 1) * limit; // 오프셋 계산
  
    const query_count= `select 
    count(*) over() as totalCount from music.com_request limit 1`;
  
    const quert_page= `select 
    ceil( (count(*) over()) / ${limit} ) + 1 as totalPage from music.com_request limit 1`;
  
    const query = `select 
    id, MUSIC.FNC_GENRENM('M', INTEGER(DECODE(LENGTH(genre),'0','0',genre)) ) AS genre, q_content, r_content, req_userid, req_usernm, req_dt, req_status, process_userid, process_usernm, process_dt from music.com_request
    order by req_dt desc LIMIT ${limit} OFFSET ${offset}`;

    const totalcount = await main.query(query_count);
    const totalpage = await main.query(quert_page);
    const result = await main.query(query);	
    if (result.result !== 0){
      res.status(200).json({ ok: true, totalcount: totalcount.result[0].TOTALCOUNT,  totalpage: totalpage.result[0].TOTALPAGE, data : result.result });
      logger.info(query)
    } else {
      logger.error(result.error);
      res.status(400).json({ ok: false, err : result.error })
    }
  } catch (err) {
    logger.error(err)
    
  }
});

// 특정 값 조회 
router.get('/', async function(req, res, next) {

  try {
    const id = req.query.id;
    const query = `select 
    id, MUSIC.FNC_GENRENM('M', INTEGER(DECODE(LENGTH(genre),'0','0',genre)) ) AS genre, q_content, r_content, req_userid, req_usernm, req_dt, req_status, process_userid, process_usernm, process_dt from music.com_request
    WHERE ID = ${id} `;

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


// 업데이트
router.put('/', async function(req, res, next) {


  try {
    const { id, genre, q_content, req_dt} = req.body;

    const query =
    `UPDATE music.com_request SET (genre, q_content, req_dt) 
    = (?,?,?) 
    WHERE id = ?`;
    const values = [genre, q_content, req_dt, id];

    const result = await main.body(query, values);
    if (result.result !== 0){
      res.status(200).json({ ok: true });
      logger.info(query, values)
    } else {
      logger.error(result.error);
      res.status(400).json({ ok: false, err : result.error })
    }
  } catch (err) {
    logger.error(err)
  }
});

// 삽입
router.post('/', async function(req, res, next) {

  try {
    const {genre, q_content, req_userid, req_usernm, req_dt } = req.body;

    const query = 
    `insert into music.com_request 
    ( reply, genre, q_content, r_content, req_userid, req_usernm, req_dt, req_email, req_phone, req_status, process_userid, process_usernm, process_dt)
    VALUES 
    (0,?,?,'',?,?,?,'' ,'', '001','','','')`;
    const values = [genre, q_content, req_userid, req_usernm, req_dt];

    const result = await main.body(query, values); 
    if (result.result !== 0){
      res.status(200).json({ ok: true });
      logger.info(query, values)
    } else {
      logger.error(result.error);
      res.status(400).json({ ok: false, err : result.error })
    }
  } catch (err) {
    logger.error(err)
  }
});


// 삭제
router.delete('/', async function(req, res, next) {

  try {

    const id = req.query.id;
    const query = `delete from music.com_request
    WHERE ID = ${id}`;
  

   const result = await main.query(query);
   if (result.result !== 0){
    res.status(200).json({ ok: true });
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