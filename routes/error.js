/* 
설명 : 오류신고 API 
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
    count(*) over() as totalCount from music.com_errorsong limit 1`;
  
    const quert_page= `select 
    ceil( (count(*) over()) / ${limit} ) + 1 as totalPage from music.com_errorsong limit 1`;
  
    const query = `select 
    id, receipt_no, reg_no, error_type, trim(song_name) as song_name, e_content, req_userid, req_usernm, req_dt, req_status, r_content, process_userid, process_usernm, type from music.com_errorsong
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
    id, receipt_no, reg_no, error_type, trim(song_name) as song_name, e_content, req_userid, req_usernm, req_dt, req_status, r_content, process_userid, process_usernm, type from music.com_errorsong
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
    const { id, receipt_no, reg_no, error_type, song_name, e_content, req_dt} = req.body;

    const query =
    `UPDATE music.com_errorsong SET (receipt_no, reg_no, error_type, song_name, e_content, req_dt) 
    = (?,?,?,?,?,?) 
    WHERE id = ?`;
    const values = [receipt_no, reg_no, error_type, song_name, e_content, req_dt, id];

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
    let result;
    const {receipt_no, reg_no, error_type, song_name, e_content, req_userid, req_usernm, req_dt, req_status } = req.body;
    const query_error = 
    `insert into music.com_errorsong 
    ( REPLY, GENRE, RECEIPT_NO, REG_NO, ERROR_TYPE, SONG_NAME, E_CONTENT, REQ_USERID, REQ_USERNM, REQ_DT, REQ_STATUS, TYPE)
    VALUES 
    (0,'0',?,?,?,?,?,?,?,?,?,'M' )`;
    const values_error = [receipt_no, reg_no, error_type, song_name, e_content, req_userid, req_usernm, req_dt, req_status];
  
    const query_direct = 
    `insert into music.com_errorsong 
    ( REPLY, GENRE, RECEIPT_NO, REG_NO, ERROR_TYPE, SONG_NAME, E_CONTENT, REQ_USERID, REQ_USERNM, REQ_DT, R_CONTENT, REQ_STATUS, PROCESS_USERID, PROCESS_USERNM, PROCESS_DT, TYPE)
    VALUES 
    (0,'0',?,?,?,?,?,?,?,?,'처리완료',?,'mbs','mbs',?,'M' )`;
    const values_direct = [receipt_no, reg_no, error_type, song_name, e_content, req_userid, req_usernm, req_dt ,req_status, req_dt];
    
    if(req_status == '001')
    {
    result = await main.body(query_error, values_error); 
    } 
    else if(req_status == '003')
    {
    result = await main.body(query_direct, values_direct); 
    }
    else {
      res.status(200).json({ ok: "req_status false" });
    }

    if (result.result !== 0){
      res.status(200).json({ ok: true });
      if(req_status == '001')
      {
        logger.info(query_error, values_error)
      } 
      else 
      {
        logger.info(query_direct, values_direct)
      }
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
  const query = `delete from music.com_errorsong
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