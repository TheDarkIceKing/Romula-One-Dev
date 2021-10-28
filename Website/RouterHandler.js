const router = require("express").Router();
const fs = require("fs");
const sqlite = require("sqlite3").verbose();



router.get("/", (req, res) => {
    readpage("./Website/public/home.html", req, res);
});

router.get("/forbidden", (req, res) => {
    readpage("./Website/specials/forbidden.html", req, res);
});

router.get("/style", (req, res) => {
    var page = fs.readFileSync("./Website/includes/style.css", "utf8");
    res.write(page);
    res.end();
})

router.get("/*", (req, res) => {
    readpage("./Website/specials/404.html", req, res);
});



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
        return `<button onclick="window.location.href='/dashboard'" style="font-family: 'Baloo Da'; bottom: 0; position: fixed; color: white; background-color: #5765EC; height: 25px;  border: none; border-radius: 12px; width: 230px; margin-bottom: 5px; margin-left: 10px";>Login with discord</button>`;
    return `<button onclick="window.location.href='/dashboard/logout'" style="font-family: 'Baloo Da'; bottom: 0; position: fixed; color: white; background-color: red; height: 25px;  border: none; border-radius: 12px; width: 230px; margin-bottom: 5px; margin-left: 10px";>Sign Out</button>`;
}

module.exports = router;