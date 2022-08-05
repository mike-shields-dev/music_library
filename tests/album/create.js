const { expect } = require("chai")
const request = require("supertest")
const getDb = require("../../src/services/db")
const app = require("../../src/app")

describe("create album", () => {
  let db
  let existingArtist

  beforeEach(async () => {
    db = await getDb()
    
    await db.query("INSERT INTO Artist SET ?", {
      name: "Tipper",
      genre: "IDM",
    })
    ;[[existingArtist]] = await db.query(`SELECT * FROM Artist`)
  })

  afterEach(async () => {
    await Promise.all([
      db.query("DELETE FROM Artist"),
      db.query("DELETE FROM Album"),
      db.end(),
    ])
  })

  describe("/artist/:artistId/album", () => {
    describe("POST", () => {
      it("returns 404 if artist id does not exist", async () => {
        const res = await request(app).post("/artist/999999/album")

        expect(res.status).to.equal(404)
      })

      it("creates an album in the database", async () => {
        const album = {
          title: "Insolito",
          year: 2022,
          artistId: existingArtist.id,
        }

        const res = await request(app)
          .post(`/artist/${existingArtist.id}/album`)
          .send(album)

        expect(res.status).to.equal(201)

        const [[albumEntries]] = await db.query("SELECT * FROM Album")

        expect(albumEntries.title).to.equal(album.title)
        expect(albumEntries.year).to.equal(album.year)
      })
    })
  })
})
