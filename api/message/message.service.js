const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const CONVERSATION_COLLECTION = 'conversation';

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        const messages = await collection.find(criteria).toArray()
        // var messages = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()

        // messages = messages.map(message => {
        //     message.byUser = { _id: message.byUser._id, fullname: message.byUser.fullname }
        //     message.aboutUser = { _id: message.aboutUser._id, fullname: message.aboutUser.fullname }
        //     delete message.byUserId
        //     delete message.aboutUserId
        //     return message
        // })

        return messages
    } catch (err) {
        // logger.error('cannot find messages', err)
        throw err
    }

}

async function remove(messageId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(messageId) }
        if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove message ${messageId}`, err)
        throw err
    }
}


async function add(conversationId, message) {
    try {

        message.byUserId = ObjectId(message.byUserId)
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        // await collection.insertOne(message)
        await collection.update(
            { "_id": conversationId },
            { "$push": { "messages": message } }
        )
        return message;
    } catch (err) {
        // logger.error('cannot insert message', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


