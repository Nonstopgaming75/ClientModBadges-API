const app = require("express")();
app.use(require("cors")());

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cache = new Map();
const EXPIRES = 1000 * 60 * 60;

app.get("/", (_, res) => res.redirect("https://github.com/HypedDomi/ClientModBadges-API"));

app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "No user id provided" });

    let _data = {};
    if (cache.has(userId) && cache.get(userId).expires > Date.now() && cache.get(userId).badges.length) _data.Replugged = cache.get(userId).badges;
    else {
        try {
            const resp = await axios.get(`https://replugged.dev/api/v1/users/${userId}`, { headers: { "Cache-Control": "no-cache" } });
            if (resp.status != 200 || !resp.data?.badges) return;
            const body = resp.data.badges;
            const badges = Object.keys(body).filter(key => body[key] === true);
            if (badges.length) _data.Replugged = badges;
            cache.set(userId, { badges, expires: Date.now() + EXPIRES });
        } catch (error) {
            console.error(`[ERROR] ${error.message}`);
        }
    }

    const filePath = path.join(__dirname, "users", `${userId}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = await fs.promises.readFile(filePath, "utf8");
            _data = { ..._data, ...JSON.parse(data) };
        } catch (error) {
            console.error(error);
        }
    }

    return res.json(_data);
});

app.get("/badges/:clientMod/:badge", (req, res) => {
    Object.keys(req.params).forEach(key => { req.params[key] = req.params[key].toLowerCase(); });
    const { clientMod, badge } = req.params;
    if (!fs.existsSync(path.join(__dirname, "badges", clientMod))) return res.status(404).json({ error: "Client mod not found" });
    const filePath = path.join(__dirname, "badges", clientMod, `${badge.split(" ")[0]}.png`);
    if (fs.existsSync(filePath)) return res.sendFile(filePath);
    else return res.status(404).json({ error: "Badge not found" });
});


const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
