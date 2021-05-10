const fs = require('fs');

const accounts = [
  {
    website: 'amazon',
    name: 'trinhthaibinh.ecom@gmail.com',
    currency: 'usd',
    _id: '604fd95ca213d706709c716a',
  },
  {
    website: 'others',
    name: 'VND_ACCOUNT',
    currency: 'vnd',
    balance: 100000000,
    _id: '604fd95ca213d706709c716b',
  },
  {
    website: 'others',
    name: 'USD_ACCOUNT',
    currency: 'usd',
    balance: 1000,
    _id: '604fd95ca213d706709c716c',
  },
  {
    website: 'amazon',
    name: 'thaibinh.trinh@student.csulb.edu',
    currency: 'usd',
    _id: '604fd95ca213d706709c716d',
  },
  {
    website: 'amazon',
    name: 'btrinh27@student.cccd.edu',
    currency: 'usd',
    _id: '604fd95ca213d706709c716e',
  },
  {
    website: 'others',
    name: 'trinhthaibinh.ecom@gmail.com',
    currency: 'btc',
    _id: '604fdc268b219f0715099180',
  },
];

try {
  fs.writeFileSync(`${__dirname}/accounts.json`, JSON.stringify(accounts));
} catch (err) {
  console.log(err);
}
