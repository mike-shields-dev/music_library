const { expect } = require("chai")
const request = require("supertest")
const getDb = require("../../src/services/db")
const app = require("../../src/app")

const testArtists = [
  { name: "Tame Impala", genre: "Rock" },
  { name: "Kylie Minogue", genre: "Pop" },
  { name: "Dave Brubeck", genre: "Jazz" },
]

describe("delete artist", () => {
  let db
  let storedArtists
  beforeEach(async () => {
    db = await getDb()
    await Promise.all(
      testArtists.map(
        async (testArtist) =>
          await db.query("INSERT INTO Artist SET ?", testArtist)
      )
    )
    ;[storedArtists] = await db.query("SELECT * from Artist")
  })

  afterEach(async () => {
    await db.query("DELETE FROM Artist")
    await db.end()
  })

  describe("/artist/:artistId", () => {
    describe("DELETE", () => {
      it("deletes a single artist with the correct id", async () => {
        const targetArtist = storedArtists[0]
        const res = await request(app).delete(`/artist/${targetArtist.id}`).send()

        expect(res.status).to.equal(200)

        const [[isFoundDeletedArtist]] = await db.query(
          "SELECT * FROM Artist WHERE id = ?",
          [targetArtist.id]
        )

        expect(!!isFoundDeletedArtist).to.be.false
      })

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).delete("/artist/999999").send()

        expect(res.status).to.equal(404)
      })
    })
  })
})
