const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/", (req, res) => {
  res.json("Welcome to my api");
});

app.get("/exchange-rate/:cryptoCoin/:normalCoin/:amount?", async (req, res) => {
  const { cryptoCoin, normalCoin, amount } = req.params;

  axios
    .get(
      `https://valuta.exchange/es/${cryptoCoin}-to-${normalCoin}?amount=${
        amount ? amount : 1
      }`
    )
    .then((response) => {
      const html = response.data;

      const $ = cheerio.load(html);

      const target = $(".Header__Title-sc-1bugvm2-0.hEqHVp");

      const secondTarget = $(".UpdateTime__ExchangeRate-sc-136xv3i-1.djCdnS");

      const info = $(".Map__Title-sc-1smdtxg-2.iSvpAQ");
      const info2 = $(".Map__Subtitle-sc-1smdtxg-3.eYylbm")
      res.status(200).send({
        status: "ok",
        title: target.text(),
        value: secondTarget.text(),
        composedValue: secondTarget.text()+" "+normalCoin ,
        info: info.text()+" "+info2.text()
      });
    });
});

app.listen(PORT, () => {
  console.log(PORT);
});
