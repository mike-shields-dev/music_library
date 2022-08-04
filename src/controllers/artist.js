const getDb = require("../services/db")

exports.create = async (req, res) => {
  const db = await getDb()
  const { name, genre } = req.body
  try {
    await db.query("INSERT INTO Artist SET ?", {
      name,
      genre,
    })
    res.sendStatus(201)
  } catch (err) {
    console.log(err)
    res.sendStatus(500).json(err)
  } finally {
    await db.end()
  }
}
