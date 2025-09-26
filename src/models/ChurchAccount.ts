import mongoose, { Schema, model, models } from "mongoose";

const HBCSchema = new Schema({
  jerusalem: { type: Number, default: 0 },
  emmanuel: { type: Number, default: 0 },
  ebenezer: { type: Number, default: 0 },
  agape: { type: Number, default: 0 },
});

const ChurchAccountSchema = new Schema(
  {
    date: { type: String, required: true },
    offerings: {
      mainService: { type: Number, default: 0 },
      hbc: { type: HBCSchema, default: {} },
      sundaySchool: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    expenditure: {
      tithe: { type: Number, default: 0 },
      apostolic: { type: Number, default: 0 },
      bricks: { type: Number, default: 0 },
      banking: { type: Number, default: 0 },
      pastorsUse: { type: Number, default: 0 },
      sundaySchool: { type: Number, default: 0 },
    },
    closing: {
      tithe: { type: Number, default: 0 },
      apostolic: { type: Number, default: 0 },
      transactionFee: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const ChurchAccount =
  models.ChurchAccount || model("ChurchAccount", ChurchAccountSchema);

export default ChurchAccount;
