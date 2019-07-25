async function create(req, res) {
    //logic for creating a resource
    let {id, address, description, pricing} = req.body
    let user = await UserModel.create({ id, address, description, pricing })
        .catch(err => res.status(500).send(err))

    res.redirect("/users")
}

async function index(req, res) {
    //showed a list of all the resources
    let users = await UserModel.find()
    res.render('layout', {
        view: 'user/index',
        title: 'All Users',
        users
    })
    // res.render("author/index", {authors})
}

function make(req, res) {
    //shows the form to create the resource
    res.render('layout', {
        view: 'user/new',
        title: 'New User'
    })
    // res.render("author/new")
}


module.exports = {
    create,
    index,
    make
}