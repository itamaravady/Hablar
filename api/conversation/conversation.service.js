const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const CONVERSATION_COLLECTION = 'conversation';

async function query(filterBy = {}) {

    try {
        const criteria = _buildCriteria(JSON.parse(filterBy))
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)
        const conversation = await collection.find(criteria).toArray();
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
        conversation.users.forEach(user => {
            user._id = ObjectId(user._id);
        });
        const collection = await dbService.getCollection(CONVERSATION_COLLECTION)

        // const criteria = _buildCriteria({ filterBy: { users: conversation.users } })
        // const existConversation = await collection.findOne(criteria);
        const existConversations = await collection.aggregate(
            [
                {
                    $match: { "users": { "$elemMatch": { _id: conversation.users[0]._id } } }
                },
                {
                    $match: { "users": { "$elemMatch": { _id: conversation.users[1]._id } } }
                }
            ]
        ).toArray();


        // console.log('existConversations._id:', existConversations[0]?._id);
        if (existConversations.length) {
            return existConversations[0]
        }
        const insertedResult = await collection.insertOne(conversation);
        conversation._id = insertedResult.insertedId;
        return conversation;
    } catch (err) {
        // logger.error('cannot insert message', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    //Filter by conversation ID
    criteria._id = filterBy._id ? ObjectId(filterBy._id) : null;
    //Filter by users
    //TODO JSON stringify the users before adding to criteria
    if (filterBy.users) {
        console.log(filterBy.users);
        let str = JSON.stringify(filterBy.users);
        criteria.users = { $all: str }

        // let jsonIds = filterBy.users.map(user => {
        // return { _id: ObjectId(user._id) }
        // })
    }

    return criteria
}

module.exports = {
    query,
    add
}


