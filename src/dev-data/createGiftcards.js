const fs = require("fs");

const giftcards = [
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.01288026,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 10224.3,
    usdVndRate: 23286,
    value: 200,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.03179557,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 10163.72,
    usdVndRate: 23286,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.03822025,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 9073,
    usdVndRate: 23310,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.06035217,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 5895,
    usdVndRate: 23205.5,
    value: 450,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.04641182,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 7509.16,
    usdVndRate: 23500,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.04829563,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 7519.21,
    usdVndRate: 23500,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.04863814,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 7550.76,
    usdVndRate: 23600,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.05271416,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 7600.47,
    usdVndRate: 23500,
    value: 550,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.04719327,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 7712.85,
    usdVndRate: 23500,
    value: 500,
  },
  {
    website: "amazon",
    fromAccount: "604fdc268b219f0715099180",
    toAccount: "604fd95ca213d706709c716a",
    price: {
      currency: "btc",
      value: 0.05047056,
    },
    fee: {
      currency: "btc",
      value: 0.0,
    },
    btcUsdRate: 8643.95,
    usdVndRate: 23600,
    value: 600,
  },
];

try {
  fs.writeFileSync(`${__dirname}/giftcard.json`, JSON.stringify(giftcards));
  console.log("Data writen to file...");
} catch (err) {
  console.log(err);
}
