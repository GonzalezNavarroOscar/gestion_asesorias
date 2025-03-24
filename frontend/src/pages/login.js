import express from "express"
import ejs from "ejs"

const app = express()

app.set("view engine", "ejs")

app.get('/', (req, res) => res.render("index"))

app.listen(3000)
console.log("hOLA")