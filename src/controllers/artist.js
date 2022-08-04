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
    res.status(500).json(err)
  } finally {
    await db.end()
  }
}

exports.read = async (req, res) => {
  const db = await getDb()
  try {
    const [artists] = await db.query("SELECT * FROM Artist")
    res.status(200).json(artists)
  } catch (err) {
    console.log(err)
    res.sendStatus(500).json(err)
  } finally {
    await db.end()
  }
}

exports.readOne = async (req, res) => {
  const db = await getDb()
  const { artistId } = req.params
  try {
    const [[artist]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
      artistId,
    ])
    if (!artist) {
      res.sendStatus(404)
    }
    res.status(200).json(artist)
  } catch (err) {
    console.log(err)
    res.sendStatus(500).json(err)
  } finally {
    await db.end()
  }
}

exports.updateOne = async (req, res) => {
  const db = await getDb()
  const { artistId } = req.params
  const { name, genre } = req.body
  console.log({ artistId, name, genre })

  try {
    const [[artist]] = await db.query(
      `
      SELECT * FROM Artist WHERE id = ?
      `,
      [artistId]
    )
    if (!artist) {
      res.sendStatus(404)
    }
    if (name) {
      await db.query(
        `
        UPDATE Artist SET name = ? WHERE id = ?
        `,
        [name, artistId]
      )
    }
    if (genre) {
      await db.query(
        `
        UPDATE Artist SET genre = ? WHERE id = ?
        `,
        [genre, artistId]
      )
    }
  } catch (err) {
    res.sendStatus(500).json(err)
  }
}
