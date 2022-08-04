const { Router } = require("express")
const artistController = require("../controllers/artist")

const router = Router()

router.post("/", artistController.create)

module.exports = router
