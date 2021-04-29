import { Types } from "mongoose";
import { IItemModel, IItemDocument } from "./items.types";
import AppError from "../../utils/AppError";
import { Transaction } from "../transaction/transactions.model";
import { Giftcard } from "../giftcards/giftcard.model";
import { MUL } from "../../constants";

export async function buy(
  this: IItemModel,
  id: string,
  accountId: string
): Promise<IItemDocument | null> {
  try {
    const item = await this.findOne(
      { _id: Types.ObjectId(id) },
      "_id status usShippingFee quantity pricePerItem actPricePerItem, tax"
    );

    if (!item) {
      throw new AppError("cannot find item with that ID", 404);
    }

    let {
      usShippingFee,
      quantity,
      pricePerItem,
      actPricePerItem,
      tax,
      status,
    } = item;

    pricePerItem = actPricePerItem ? actPricePerItem : pricePerItem;
    console.log(status);

    if (status !== "not-yet-ordered") {
      throw new AppError("Item already ordered", 400);
    }

    const totalBill =
      Math.round(
        quantity * pricePerItem * 10000 * (1 + tax) + usShippingFee * 10000
      ) / 10000;

    const transaction = await Transaction.create({
      fromAcct: accountId,
      amountSent: {
        value: totalBill,
        currency: "usd",
      },
      item: id,
    });

    if (!transaction) {
      throw new AppError("Error while creating transaction", 500);
    }

    const giftcards = await Giftcard.find(
      {
        remainingBalance: { $gt: 0 },
        toAccount: accountId,
      },
      {
        remainingBalance: 1,
        partialBalance: 1,
      },
      {
        sort: { createdAt: 1, _id: 1 },
      }
    );

    if (giftcards.length === 0) {
      throw new AppError("gift card balance is not enought", 400);
    }

    let remainingNeeded = totalBill;
    let actualCost = 0;
    let i = 0;
    let currentGcBal = giftcards[0].remainingBalance;
    const promises = [];
    // const partialBalance = [];

    while (i < giftcards.length && remainingNeeded > currentGcBal!) {
      let j = 0;
      let currentPartial = giftcards[i].partialBalance![j];

      while (
        j < giftcards[i].partialBalance!.length &&
        remainingNeeded > currentPartial!.balance!
      ) {
        const actPartial =
          Math.round(currentPartial.balance! * MUL * currentPartial.rate!) /
          MUL;
        actualCost = Math.round(actualCost * MUL + actPartial) / MUL;
        remainingNeeded =
          Math.round(remainingNeeded * MUL - currentPartial!.balance! * MUL) /
          MUL;

        promises.push(
          Giftcard.updateOne(
            { _id: giftcards[i]._id },
            {
              $set: {
                [`partialBalance.${j}.balance`]: 0,
              },
            }
          )
        );
        j += 1;
        currentPartial = giftcards[i]!.partialBalance![j];
      }

      promises.push(
        Giftcard.updateOne(
          { _id: giftcards[i]._id },
          {
            $set: { remainingBalance: 0 },
          }
        )
      );
      i += 1;
      currentGcBal = giftcards[i].remainingBalance;
    }

    if (i >= giftcards.length) {
      throw new AppError(
        "Not enough giftcard balance. Please check again",
        400
      );
    }

    let k = 0;
    const remainingForLastGc = remainingNeeded;
    let currentPartial = giftcards[i].partialBalance![k];

    while (
      k < giftcards[i].partialBalance!.length &&
      remainingNeeded > currentPartial!.balance!
    ) {
      const actPartial =
        Math.round(currentPartial.balance! * MUL * MUL * currentPartial.rate!) /
        MUL;
      actualCost = Math.round(actualCost * MUL + actPartial) / MUL;
      remainingNeeded =
        Math.round(remainingNeeded * MUL - currentPartial.balance! * MUL) / MUL;
      promises.push(
        Giftcard.updateOne(
          {
            _id: giftcards[i]._id,
          },
          {
            $set: {
              [`partialBalance.${k}.balance`]: 0,
            },
          }
        )
      );

      k += 1;
      currentPartial = giftcards[i].partialBalance![k];
    }

    if (
      i >= giftcards.length ||
      k >= giftcards[i].partialBalance!.length ||
      remainingNeeded > giftcards[i].partialBalance![k].balance!
    ) {
      throw new AppError("Not enough giftcard balance", 400);
    }

    // last partial balance
    const actPartial =
      Math.round(remainingNeeded * MUL * MUL * currentPartial!.rate!) / MUL;
    actualCost = Math.round(actualCost * MUL + actPartial) / MUL;
    const remainingPartialBalance =
      Math.round(
        giftcards[i].partialBalance![k].balance! * MUL - remainingNeeded * MUL
      ) / MUL;
    const lastGcBalance = giftcards[i].remainingBalance;
    const lastGcRemaining =
      Math.round(lastGcBalance! * MUL - remainingForLastGc * MUL) / MUL;

    promises.push(
      Giftcard.updateOne(
        {
          _id: giftcards[i]._id,
        },
        {
          $set: {
            [`partialBalance.${k}.balance`]: remainingPartialBalance,
            remainingBalance: lastGcRemaining,
          },
        }
      )
    );

    await Promise.all(promises);
    console.log(actualCost);

    const updatedItem = await this.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          actualCost,
          status: "ordered",
          transaction: transaction._id,
          orderDate: Date.now(),
          orderAccount: accountId,
        },
      },
      { returnOriginal: false }
    );
    //TODO: consider including transaction in parallelized promises
    return updatedItem;
  } catch (err) {
    throw err;
  }
}
