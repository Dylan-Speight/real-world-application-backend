const express = require("express")
const router = express.Router()
const UserController = require("./controllers/user_controller")
const InvestmentController = require("./controllers/investment_controller")

app.get('/', function (req, res) {
    res.send('hello world')
  })

router.get("/users", UserController.index)

router.post("/users", UserController.create)

router.get("/users/new", UserController.make)

router.get("/investments", InvestmentController.index)

router.post("/investments", InvestmentController.create)

router.get("/investments/new", InvestmentController.make)



module.exports = router
