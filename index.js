const app = require("./src/app")

const APP_PORT = 4000

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`)
})
