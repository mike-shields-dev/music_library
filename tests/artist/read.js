const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../../src/services/db");
const app = require("../../src/app");
const testArtists = require("./testArtistData");

describe("read artist", () => {
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
    [dbArtists] = await db.query("SELECT * from Artist");
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artist");
    await db.end();
  });

  describe("/artist", () => {
    describe("GET", () => {
      it("returns all artist records in the database", async () => {
        const res = await request(app).get("/artist").send();

        expect(res.status).to.equal(200);

        const responseArtists = res.body;

        expect(responseArtists.length).to.equal(testArtists.length);

        responseArtists.forEach((responseArtist) => {
          const dbArtist = dbArtists.find((a) => a.id === responseArtist.id);

          expect(responseArtist).to.deep.equal(dbArtist);
        });
      });
    });
  });

  describe("/artist/:artistId", () => {
    describe("GET", () => {
      it("returns a single artist with the correct id", async () => {
        const targetArtist = dbArtists[0];

        const res = await request(app).get(`/artist/${targetArtist.id}`).send();

        expect(res.status).to.equal(200);

        const responseArtist = res.body;

        expect(responseArtist).to.deep.equal(targetArtist);
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).get("/artist/999999").send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
