async function query(query) {
  try {
    const result = await musicdb.query(query);
    return { result: result };
  } catch (err) {
    return { error: err, result: 0 };
  }
}

async function body(query, vaules) {
  try {
    const result = await musicdb.query(query, vaules);
    return { result: result };
  } catch (err) {
    return { error: err, result: 0 };
  }
}


module.exports = {
  query,
  body
};
