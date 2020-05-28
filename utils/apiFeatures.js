class APIFeatures {
  constructor(query, queryString) {
    // query: Tour.find(), queryString: req.query
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build query
    // 1: Filtering
    // ex: api?difficulty=easy&price[lte]=500

    const queryObj = { ...this.queryString };
    const excludedFields = ['fields', 'sort', 'page', 'limit'];
    excludedFields.forEach((elm) => delete queryObj[elm]);

    // Advanced filter
    let queryStr = JSON.stringify(queryObj) ;
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2: Sorting
    // ex: api?sort=-price,ratingsAverage

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fieldsLimit() {
    // 3: Field limiting
    // ex: api?fields=name,duration

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    // 4: Pagination
    // ex: api?page=1&limit=5

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
