const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // Allow for nested GET review on tour (cheat)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Excuted query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldsLimit()
      .pagination();
    // console.log(features);
    // const docData = await features.query.explain();
    const docData = await features.query;
    // Send response

    res.status(200).json({
      Status: 'success',
      Code: 0,
      RequestTime: req.requestTime,
      Total: docData.length,
      Data: docData,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const docData = await query;

    if (!docData) {
      const message = 'No document found with that ID';
      return next(new AppError(400, -1, message));
    }

    res.status(200).json({
      Status: 'success',
      Code: 0,
      RequestTime: req.requestTime,
      Data: docData,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    console.log(11111, req.body);
    const doc = await Model.create(req.body);

    console.log(22222, doc);

    res.status(200).json({
      Status: 'success',
      Code: 0,
      Data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const dataRequest = req.body;
    const docData = await Model.findByIdAndUpdate(id, dataRequest, {
      new: true,
      runValidators: true,
    });

    if (!docData) {
      const message = 'No document found to update with that ID';
      return next(new AppError(400, -1, message));
    }

    res.status(200).json({
      Status: 'success',
      Code: 0,
      Message: 'Update successfully',
      RequestTime: req.requestTime,
      Data: docData,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const docDelete = await Model.findByIdAndDelete(id);

    if (!docDelete) {
      const message = 'No document found to delete with that ID';
      return next(new AppError(400, -1, message));
    }

    res.status(200).json({
      Status: 'success',
      Code: 0,
      RequestTime: req.requestTime,
    });
  });
