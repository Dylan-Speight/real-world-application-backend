const { InvestmentModel } = require("../models/investment_model")

async function create(req, res) {
    //logic for creating a resource
    let {id, address, description, pricing} = req.body
    let user = await InvestmentModel.create({ id, address, description, pricing })
        .catch(err => res.status(500).send(err))

    res.redirect("/investments")
}

async function index(req, res) {
    //showed a list of all the resources
    let investments = await InvestmentModel.find()
    res.render('layout', {
        view: 'investment/index',
        title: 'All Investments',
        investments
    })
    // res.render("author/index", {authors})
}

function make(req, res) {
    //shows the form to create the resource
    res.render('layout', {
        view: 'investment/new',
        title: 'New Investment'
    })
    // res.render("author/new")
}


module.exports = {
    create,
    index,
    make
}