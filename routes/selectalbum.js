/* 
설명 : 앨범 조회 API 
작성자 : 이도용
최종수정 : 2023.09.20
*/
const express = require('express');
const router = express.Router();
const main = require('./function'); 

router.get('/', async function(req, res, next) { 

  try {
  const id = req.query.id;
  const query = 
  `select 
  c.id,
  c.event_time,
  c.iud_type,
  c.key as receipt_no, 
  a.album_name, 
  a.artist as album_artist, 
  a.release_year as album_release_year,
  b1.attach_path||'\\'||b1.attach_name AS image_path,
  b2.attach_path||'\\'||b2.attach_name AS small_image_path,
  a.title_song,
  a.LABEL_NO,
  a.album_type,
  a.PRODUCER,
  a.PLANNER,
  a.ALBUM_PLACE,
  a.REMARK_EXT,
  MUSIC.FNC_GENRENM('M', INTEGER(DECODE(LENGTH(a.genre),'0','0',a.genre)) ) AS genre_nm,
  a.open_dt,
  a.brd_time,
  a.status
  from music.album_mst a
  left outer join  music.album_image b1
  on a.receipt_no = b1.receipt_no and b1.img_type='001'
  left outer join  music.album_image b2
  ON a.receipt_no = b2.receipt_no and b2.img_type='002'
  right outer join  music.ai_album_log c
  ON  a.receipt_no = c.key
  where c.id >= ${id}
  order by c.id asc`;

   const result = await main.query(query);

   if (result.result !== 0){
     res.status(200).json({ ok: true, data: result.result });
     logger.info(query)
   } else {
    logger.error(result.error);
    res.status(400).json({ ok: false, err : result.error })
   }
  } catch (err) {
    logger.error( err)
  }
});

module.exports = router;