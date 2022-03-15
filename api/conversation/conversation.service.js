const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const CONVERSATION_COLLECTION = 'conversation';

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(JSON.parse(filterBy.params))
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        const conversation = await collection.find(criteria).toArray()
        // var conversation = await collection.aggregate([
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

        // conversation = conversation.map(message => {
        //     message.byUser = { _id: message.byUser._id, fullname: message.byUser.fullname }
        //     message.aboutUser = { _id: message.aboutUser._id, fullname: message.aboutUser.fullname }
        //     delete message.byUserId
        //     delete message.aboutUserId
        //     return message
        // })

        return conversation
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


async function add(conversation) {
    try {
        console.log('conversation:', conversation);
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        conversation = await collection.insertOne(conversation)

        return conversation;
    } catch (err) {
        // logger.error('cannot insert message', err)
        throw err
    }
}

function _buildCriteria({ filterBy }) {
    const criteria = {}

    console.log(filterBy)
    criteria._id = filterBy._id ? ObjectId(filterBy._id) : null;
    return criteria
}

module.exports = {
    query,
    add
}


