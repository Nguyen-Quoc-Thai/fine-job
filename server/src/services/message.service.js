const httpStatus = require('http-status');
const { Message } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a message (current sup for text msg)
 * @param {Object} userBody
 * @returns {Promise<Message>}
 */
const createMessage = async (userBody) => {
  // Format user body to fix job
  const msg = {
    status: 'sent',
    msg: userBody.message || '',
    type: 'text',
    sender: userBody.sender,
  };

  try {
    const { userID_1, userID_2 } = userBody;
    const message = await Message.findOne({
      $or: [
        { userID_1: userID_1, userID_2: userID_2 },
        { userID_1: userID_2, userID_2: userID_1 },
      ],
    });
    if (message) {
      message.messages.push(msg);
      await message.save();
      return message;
    } else {
      userBody.messages = [];
      userBody.messages.push(msg);
      const newConversation = await Message.create(userBody);
      return newConversation;
    }
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
};

/**
 * Delete message by id
 * @param {Object} filter - Mongo filter
 * @param {ObjectId} msgID
 * @returns {Promise<QueryResult>}
 */
const deleteMessage = async (filter) => {
  const { userID_1, userID_2, msgID, senderID } = filter;

  try {
    const message = await Message.findOne({
      $or: [
        { userID_1: userID_1, userID_2: userID_2 },
        { userID_1: userID_2, userID_2: userID_1 },
      ],
    });

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Two users never texted each other');
    }

    // Check valid msgID
    const validIndex = message.messages.findIndex((ele) => ele.id === msgID);
    if (validIndex < 0) {
      throw new Error('Message not found');
    }

    // Users can delete own messages
    const validRole = message.messages[validIndex].sender === senderID;
    if (!validRole) {
      throw new Error('This message was not sent by you');
    }

    // Update message status
    message.messages[validIndex].status = 'deleted';
    await message.save();
    return message;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error.message);
  }
};

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options) => {
  // Not yet supported for paginate msg
  // filter.messages = { $slice: [(options.page - 1) * options.limit, options.limit] };
  const { userID_1, userID_2 } = filter;
  try {
    const message = await Message.findOne({
      $or: [
        { userID_1: userID_1, userID_2: userID_2 },
        { userID_1: userID_2, userID_2: userID_1 },
      ],
    });
    return message;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
};

module.exports = {
  createMessage,
  queryMessages,
  deleteMessage,
};