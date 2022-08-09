const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../../src/services/db");
const app = require("../../src/app");
const testArtists = require("./testArtistData");

describe("update artist", () => {
  let db;
  let dbArtists;
  beforeEach(async () => {
    db = await getDb();

    await Promise.all(
      testArtists.map(
        async (testArtist) =>
          await db.query("INSERT INTO Artist SET ?", testArtist)
      )
    );
    [dbArtists] = await db.query("SELECT * FROM Artist");
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artist");
    await db.end();
  });

  describe("/artist/:artistId", () => {
    describe("PATCH", () => {
      it("updates a single artist with the correct id", async () => {
        const targetDbArtist = dbArtists[0];

        const res = await request(app)
          .patch(`/artist/${targetDbArtist.id}`)
          .send({ name: "new name", genre: "new genre" });

        const [[updatedDbArtistRecord]] = await db.query(
          "SELECT * FROM Artist WHERE id = ?",
          [targetDbArtist.id]
        );

        expect(res.status).to.equal(200);
        expect(updatedDbArtistRecord.name).to.equal("new name");
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app)
          .patch("/artist/999999")
          .send({ name: "new name" });

        expect(res.status).to.equal(404);
      });
    });
  });
});
