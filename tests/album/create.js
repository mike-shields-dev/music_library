const { expect } = require("chai")
const request = require("supertest")
const getDb = require("../../src/services/db")
const app = require("../../src/app")

describe("create album", () => {
  let db
  beforeEach(async () => {
    db = await getDb()
  })

  afterEach(async () => {
    await db.query("DELETE FROM Album")
    await db.end()
  })

  describe("/album", () => {
    describe("POST", () => {
      it("creates a new album in the database", async () => {
        const res = await request(app).post("/album").send({
          name: "Test Album",
          artistId: 1,
          year: 2022,
        })
        expect(res.status).to.equal(201)

        const [[albumEntries]] = await db.query(
          'SELECT * FROM Album WHERE name = "Test Album"'
        )

        expect(albumEntries.name).to.equal("Test Album")
        expect(albumEntries.artistId).to.equal(1)
      })
    })
  })
})
