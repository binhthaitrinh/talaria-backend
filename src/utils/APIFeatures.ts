import { Query, Document } from "mongoose";

class APIFeatures {
  query: Query<Document[], any>;
  queryOptions: { [key: string]: any };

  constructor(
    query: Query<Document[], any>,
    queryOptions: { [key: string]: any }
  ) {
    this.query = query;
    this.queryOptions = queryOptions;
  }

  filter() {
    const queryObj = { ...this.queryOptions };
    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((field) => delete queryObj[field]);

    // convert to string for advanced filtering such as gte, gt, lt
    var queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match?: string) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryOptions.sort) {
      const sortBy = this.queryOptions.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryOptions.fields) {
      const fields = this.queryOptions.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    // convert string in query to number
    const page = this.queryOptions.page * 1 || 1;
    const limit = this.queryOptions.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
