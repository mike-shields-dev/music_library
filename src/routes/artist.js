const { Router } = require("express")
const artistController = require("../controllers/artist")

const router = Router()

router.post("/", artistController.create)
router.get("/", artistController.read)
router.get("/:artistId", artistController.readOne)

module.exports = router
