/* 
설명 : 곡명, 가수명 오타수정 API 
작성자 : 이도용
최종수정 : 2023.09.13
*/

const express = require('express');
const router = express.Router();
const main = require('./function'); 

router.put('/', async function(req, res, next) {

  

  try {
    const { receipt_no, reg_no, song_name, artist, modr, mod_dt } = req.body;

    const query_song =
    `UPDATE music.song_mst SET (song_name, artist, modr, mod_dt, src_modr, src_mod_dt) 
    = (?,?,?,?,?,?) 
    WHERE receipt_no = ? and reg_no = ?`;
    const values_song = [song_name, artist, modr, mod_dt, modr, mod_dt, receipt_no, reg_no];
  
    const query_album =
    `UPDATE music.album_mst SET (modr, mod_dt, src_modr, src_mod_dt) 
    = (?,?,?,?) 
    WHERE receipt_no = ?`;
    const values_album = [modr, mod_dt, modr, mod_dt, receipt_no];


    const result1 = await main.body(query_song, values_song);
    const result2 = await main.body(query_album, values_album);

   if (result1.result !== 0 && result2.result !== 0){
    res.status(200).json({ ok: true });
    logger.info(query_song, values_song, query_album, values_album)
  } else {
    logger.error(result1.error);
    res.status(400).json({ ok: false, err : result1.error })
  } 
  } catch (err) {
    logger.error(err)
  }
});

module.exports = router;