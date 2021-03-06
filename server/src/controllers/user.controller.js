const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'lastName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const modifyEducation = catchAsync(async (req, res) => {
  const user = await userService.modifyEducation(req.params.userId, req.body);
  res.send(user);
});

const deleteEducation = catchAsync(async (req, res) => {
  const user = await userService.deleteEducation(req.params.userId, req.body);
  res.send(user);
});

const modifyAccomplishment = catchAsync(async (req, res) => {
  const user = await userService.modifyAccomplishment(req.params.userId, req.body);
  res.send(user);
});

const deleteAccomplishment = catchAsync(async (req, res) => {
  const user = await userService.deleteAccomplishment(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendConnReq = catchAsync(async (req, res) => {
  await userService.sendConnReq(req.body, req.user, req.params.receiverID);
  res.status(httpStatus.CREATED).send({});
});

const acceptConnReq = catchAsync(async (req, res) => {
  await userService.acceptConnReq(req.body, req.user, req.params.receiverID, req.query.notificationID);
  res.status(httpStatus.CREATED).send({});
});

const deleteConnReq = catchAsync(async (req, res) => {
  await userService.deleteConnReq(req.body, req.user, req.params.receiverID, req.query.notificationID);
  res.status(httpStatus.CREATED).send({});
});

const deleteFriend = catchAsync(async (req, res) => {
  await userService.deleteFriend(req.body, req.user, req.params.receiverID);
  res.status(httpStatus.CREATED).send({});
});

const getConnStatus = catchAsync(async (req, res) => {
  const result = await userService.getConnStatus(req.user, req.params.receiverID);
  res.status(httpStatus.CREATED).send(result);
});

const postSearchUsers = (req, res) => {
  const filter = pick(req.query, ['q']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  userService.searchUsers(filter, options, res);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  modifyEducation,
  modifyAccomplishment,
  deleteAccomplishment,
  deleteEducation,
  deleteUser,
  sendConnReq,
  acceptConnReq,
  deleteConnReq,
  deleteFriend,
  postSearchUsers,
  getConnStatus,
};
