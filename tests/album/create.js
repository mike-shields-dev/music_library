const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../../src/services/db");
const app = require("../../src/app");

describe("create album", () => {
  let db;
  let dbArtist;

  beforeEach(async () => {
    db = await getDb();

    await db.query("INSERT INTO Artist SET ?", {
      name: "Tipper",
      genre: "IDM",
    });
    [[dbArtist]] = await db.query(`SELECT * FROM Artist`);
  });

  afterEach(async () => {
    await Promise.all([
      db.query("DELETE FROM Artist"),
      db.query("DELETE FROM Album"),
      db.end(),
    ]);
  });

  describe("/artist/:artistId/album", () => {
    describe("POST", () => {
      it("returns 404 if artist id does not exist", async () => {
        const res = await request(app).post("/artist/999999/album");

        expect(res.status).to.equal(404);
      });

      it("creates an album in the database", async () => {
        const testAlbum = {
          title: "Insolito",
          year: 2022,
        };

        const res = await request(app)
          .post(`/artist/${dbArtist.id}/album`)
          .send(testAlbum);

        const [[dBAlbum]] = await db.query("SELECT * FROM Album");
        
        expect(res.status).to.equal(201);
        expect(dBAlbum.title).to.equal(testAlbum.title);
        expect(dBAlbum.year).to.equal(testAlbum.year);
        expect(dBAlbum.artistId).to.equal(dbArtist.id);
      });
    });
  });
});
