const express = require("express");
const bp = require("body-parser");
const cp = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const models = require("./models");
const CONFIG = require("./config");
const Passport_admin = require("./passport/passport-admin");
const Passport_player = require("./passport/passport-player");

const app = express();

app.set("view engine", "ejs");

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(cp(CONFIG.COOKIE_SECRET_KEY));

app.use(session({
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(Passport_player.initialize());
app.use(Passport_player.session());

app.use(Passport_admin.initialize());
app.use(Passport_admin.session());



app.use("/", express.static(path.join(__dirname, "public_static")));

app.use(function (req, res, next) {
    /*console.log(req.session);
    console.log(req.user);
    console.log(req.isAuthenticated());*/
    next();
});

app.get("/", (req, res) => res.render("index"));

app.get("/adminloginsignup", (req, res) => res.render("adminloginsignup"));

app.get("/playerloginsignup", (req, res) => res.render("playerloginsignup"));

app.get("/admin", (req, res) => res.render("admin"));

app.get("/user", (req, res) => res.render("user"));

app.get("/addevent", (req, res) => res.render("addevent"));

app.get("/eventregister", (req, res) => res.render("eventregister"));

function checkLoggedIn(req, res, next) {
    if (req.user)
        next();
    else {
        console.log("Invalid Access!!");
        res.redirect("/");
    }
}

app.post("/newevent",checkLoggedIn, (req, res, next) => {
    if(req.user) {
        models.Event.create({
            name: req.body.name,
            venue: req.body.venue,
            details: req.body.details,
            description: req.body.description,
            admin: req.user._id
        })
            .then((event) => {
                if(event != null) {
                    models.Admin.update({_id : req.user._id} , {
                        $push: { event: event._id }
                    })
                }
                else {
                    throw Error("Event not created");
                }
            })
            .catch((err) => {
                console.log(err);
            });
        res.redirect("/addevent");
    }
    else {
        console.log("Admin not logged in");
        res.redirect("/adminloginsignup");
    }
});

app.get("/adminevents",checkLoggedIn, (req, res) => {
    let events = [];
    models.Admin.findById({_id : req.user._id})
        .then(admin => {
            admin.events.forEach(event => {
                models.Event.findById({_id : admin.events._id})
                    .then(event => {
                        events.push(event);
                    })
            });
        });
    res.render("adminevents", {events});
});

app.post("/playerlogin", Passport_player.authenticate("local-player", {
    successRedirect: "/user",
    failureRedirect: "/playerloginsignup"
}));

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.post("/playersignup", (req, res, next) => {
    models.Player.findOne({
        username: req.body.username
    })
        .then(player => {
            if (player === null)
                return models.Player.create({
                    username: req.body.username,
                    password: req.body.password,
                    name: req.body.name,
                    email: req.body.email
                });
            else
                throw Error("Player already Exists");
        })
        .then(player => {
            console.log("User created: ");
            console.log(player);

            Passport_player.authenticate("local-player", {
                successRedirect: "/user",
                failureRedirect: "/playerloginsignup"
            })(req, res, next);

        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

app.post("/adminlogin", Passport_admin.authenticate("local-admin", {
    successRedirect: "/admin",
    failureRedirect: "/adminloginsignup"
}));


app.post("/adminsignup", (req, res, next) => {
    models.Admin.findOne({
        username: req.body.username
    })
        .then(admin => {
            if (admin === null)
                return models.Admin.create({
                    username: req.body.username,
                    password: req.body.password,
                    name: req.body.name,
                    email: req.body.email
                });
            else
                throw Error("Admin already Exists");
        })
        .then(admin => {
            // Redirect to Login/SignUp Page
            console.log("Admin created: ");
            console.log(admin);

            Passport_admin.authenticate("local-admin", {
                successRedirect: "/admin",
                failureRedirect: "/adminloginsignup"
            })(req, res, next);

        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

app.listen(CONFIG.SERVER.PORT, () => {
    console.log(`Server started at http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}/`);
});
