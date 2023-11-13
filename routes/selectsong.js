/* 
설명 : 곡 조회 API 
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
    a.key, 
    c.SONG_NAME,
    MUSIC.FNC_GETCOMCD(UPPER('form_type'),c.form_type ) AS form_type,
    c.version,
    trim(c.artist) || music.fnc_artist_feat(c.receipt_no, c.reg_no) || music.fnc_artist_002(c.receipt_no, c.reg_no) || music.fnc_artist_003(c.receipt_no, c.reg_no) || music.fnc_artist_004(c.receipt_no, c.reg_no) || music.fnc_artist_005(c.receipt_no, c.reg_no) AS song_artist,
    d.artist_type,
    trim(c.artist) AS main_artist,
    MUSIC.FNC_GENRENM('M', INTEGER(DECODE(LENGTH(c.genre),'0','0',c.genre)) ) AS genre_nm,
    c.RELEASE_YEAR as song_release_year,
    e.com_cd_nm AS lang_type,
    c.RUNTIME,
    c.LYRICS,
    c.TRACK_NO,
    c.attach_path as WAV_FILE_PATH,
    c.ATTACH_NAME as WAV_FILE_NAME,
    c.status,
    c.subtitle,
    c.dlbr_cont1,
    c.lyricist,
    c.SONGWRITER,
    c.ARRANGEMENT,
    c.MUSICAL_INSTRUMENT,
    c.musical_range,
    c.orchestra,
    c.size AS SONG_SIZE,
    c.down_limit_id,
    c.etc,
    c.DLBR_RSLT
    from  music.ai_song_log a
    left outer join music.song_mst c
    ON  a.RECEIPT_NO = c.receipt_no AND A.REG_NO = c.reg_no
    LEFT OUTER JOIN music.artist_mst d
    ON c.artist = d.artist
    LEFT OUTER JOIN music.comcod e 
    ON c.LANG_TYPE = e.com_cd and e.com_cd_div = 'LANG_TYPE'
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