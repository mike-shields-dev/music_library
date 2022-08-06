const { expect } = require("chai")
const request = require("supertest")
const getDb = require("../../src/services/db")
const app = require("../../src/app")
const testArtists = require("./testArtistData")

describe("delete artist", () => {
  let db
  let dbArtists
  beforeEach(async () => {
    db = await getDb()
    await Promise.all(
      testArtists.map(
        async (testArtist) =>
          await db.query("INSERT INTO Artist SET ?", testArtist)
      )
    )
    ;[dbArtists] = await db.query("SELECT * from Artist")
  })

  afterEach(async () => {
    await db.query("DELETE FROM Artist")
    await db.end()
  })

  describe("/artist/:artistId", () => {
    describe("DELETE", () => {
      it("deletes a single artist with the correct id", async () => {
        const targetArtist = dbArtists[0]
        const res = await request(app).delete(`/artist/${targetArtist.id}`).send()

        expect(res.status).to.equal(200)

        const [[isTargetArtistInDb]] = await db.query(
          "SELECT * FROM Artist WHERE id = ?",
          [targetArtist.id]
        )

        expect(!!isTargetArtistInDb).to.be.false
      })

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).delete("/artist/999999").send()

        expect(res.status).to.equal(404)
      })
    })
  })
})
