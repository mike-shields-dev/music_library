const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../../src/services/db");
const app = require("../../src/app");

describe("create artist", () => {
  let db;
  beforeEach(async () => {
    db = await getDb();
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artist");
    await db.end();
  });

  describe("/artist", () => {
    describe("POST", () => {
      it("creates a new artist in the database", async () => {
        const res = await request(app).post("/artist").send({
          name: "Test Artist",
          genre: "Test Genre",
        });
        
        const [[artistEntries]] = await db.query(
          "SELECT * FROM Artist WHERE name = 'Test Artist'"
        );
        
        expect(res.status).to.equal(201);
        expect(artistEntries.name).to.equal("Test Artist");
        expect(artistEntries.genre).to.equal("Test Genre");
      });
    });
  });
});
