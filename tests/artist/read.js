const { expect } = require("chai")
const request = require("supertest")
const getDb = require("../../src/services/db")
const app = require("../../src/app")

const testArtists = [
  { name: "Tame Impala", genre: "Rock" },
  { name: "Kylie Minogue", genre: "Pop" },
  { name: "Dave Brubeck", genre: "Jazz" },
]

describe("read artist", () => {
  let db
  let storedArtists

  beforeEach(async () => {
    db = await getDb()
    await Promise.all(
      testArtists.map(
        async (testArtist) => await db.query("INSERT INTO Artist SET ?", testArtist)
      )
    )
    ;[storedArtists] = await db.query("SELECT * from Artist")
  })

  afterEach(async () => {
    await db.query("DELETE FROM Artist")
    await db.end()
  })

  describe("/artist", () => {
    describe("GET", () => {
      it("returns all artist records in the database", async () => {
        const res = await request(app).get("/artist").send()

        expect(res.status).to.equal(200)
        expect(res.body.length).to.equal(testArtists.length)

        res.body.forEach((artistRecord) => {
          const expected = storedArtists.find((a) => a.id === artistRecord.id)

          expect(artistRecord).to.deep.equal(expected)
        })
      })
    })
  })

  describe("/artist/:artistId", () => {
    describe("GET", () => {
      it("returns a single artist with the correct id", async () => {
        const expected = storedArtists[0]
        const res = await request(app).get(`/artist/${expected.id}`).send()

        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(expected)
      })

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).get("/artist/999999").send()

        expect(res.status).to.equal(404)
      })
    })
  })
})
