const fs = require("fs");

const accounts = [
  {
    website: "amazon",
    name: "trinhthaibinh.ecom@gmail.com",
    currency: "usd",
  },
  {
    website: "others",
    name: "VND_ACCOUNT",
    currency: "vnd",
    balance: 100000000,
  },
  {
    website: "others",
    name: "USD_ACCOUNT",
    currency: "usd",
    balance: 1000,
  },
  {
    website: "amazon",
    name: "thaibinh.trinh@student.csulb.edu",
    currency: "usd",
  },
  {
    website: "amazon",
    name: "btrinh27@student.cccd.edu",
    currency: "usd",
  },
  {
    website: "walmart",
    name: "trinhthaibinh.ecom@gmail.com",
    currency: "usd",
  },
];

try {
  fs.writeFileSync(`${__dirname}/accounts.json`, JSON.stringify(accounts));
} catch (err) {
  console.log(err);
}
