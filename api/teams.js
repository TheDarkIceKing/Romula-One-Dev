const passport = require("passport");
const sqlite = require("sqlite3").verbose();
const router = require("express").Router();
const fs = require("fs");
var navbar = fs.readFileSync("./Website/includes/navbar.html", "utf8");

router.get('/teaminfo', function (req, res){
    readpage('./functions/cache/teammembercache.json', req, res)
})


async function readpage(page, req, res) {
    var page = fs.readFileSync(page, "utf8");
    var loginbutton = await loggedIn(req);
    var navbar = fs.readFileSync("./Website/includes/navbar.html", "utf8");
    var staffnav = fs.readFileSync("./Website/includes/staffnav.html", "utf8");

    page = page.replace(/%navbar%/g, navbar);
    if (req.isAuthenticated()) { page = page.replace(/%staffnav%/, staffnav) } else { page = page.replace(/%staffnav%/, "")}

    page = page.replace(/%loginbutton%/g, loginbutton);
    page = page.replace(/%DOMAIN%/g, process.env.DOMAIN)

    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(page);
    res.end();
}

async function loggedIn(req) {
    if (!req.isAuthenticated())
        return `<button onclick="window.location.href='/dasbboard'" style="font-family: 'Baloo Da'; bottom: 0; position: fixed; color: white; background-color: #5765EC; height: 25px;  border: none; border-radius: 12px; width: 230px; margin-bottom: 5px; margin-left: 10px";>Login with discord</button>`;
    return `<button onclick="window.location.href='/dashboard/logout'" style="font-family: 'Baloo Da'; bottom: 0; position: fixed; color: white; background-color: red; height: 25px;  border: none; border-radius: 12px; width: 230px; margin-bottom: 5px; margin-left: 10px";>Sign Out</button>`;
}

async function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        //    if (await staffverify.check(req.user.id) == false) return res.redirect("../forbidden") 
        return next();
    }
    res.redirect("../dashboard");
}


module.exports = router;