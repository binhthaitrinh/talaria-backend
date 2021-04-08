const fs = require("fs");

const items = [
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    link:
      "https://www.sephora.com/product/the-ordinary-deciem-niacinamide-10-zinc-1-P427417?skuId=2031391&icid2=products%20grid:p427417:product",
    pricePerItem: 10.99,
    quantity: 5,
    estWgtPerItem: 0.34,
    website: "sephora",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
  {
    name: "POWER SERIES BAND",
    link:
      "https://shop.whoop.com/products/power-series-band?variant=31854970404953",
    pricePerItem: 15,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "others",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
  {
    name:
      "Qualia Mind Nootropics | Top Brain Supplement for Memory, Focus, Mental Energy, and Concentration with Ginkgo biloba, Alpha GPC, Bacopa monnieri, Celastrus paniculatus, DHA & More.(154 Ct)",
    link:
      "https://www.amazon.com/Nootropics-Supplement-Concentration-Celastrus-paniculatus/dp/B07B5PC8PH",
    pricePerItem: 169,
    quantity: 1,
    estWgtPerItem: 0.34,
    website: "amazon",
    type: "others",
  },
];

try {
  fs.writeFileSync(`${__dirname}/items.json`, JSON.stringify(items));
} catch (err) {
  console.log(err);
}
