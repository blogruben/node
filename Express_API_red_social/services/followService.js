const Follow = require("../models/follow");

const followUserIds = async (identityUserId) => {
    try {

        // Sacar info de seguimiento
        let following = await Follow.find({ "user": identityUserId })
            .select({ "followed": 1, "_id": 0 });

        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "followed": 1, "user": 1, "_id": 0 });

        // Procesar array de identificadores
        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed);
        });

        let followedClean = [];

        followers.forEach(follow => {
            followedClean.push(follow.user);
        });


        return {
            following: followingClean, 
            followers: followedClean
        }

    } catch (error) {
        return {}
    }
}


const followThisUser = async (identityUserId, profileUserId) => {
    // Sacar info de seguimiento
    let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId });
    let followers = await Follow.findOne({ "user": profileUserId, "followed": identityUserId });

    return {
        following, 
        followers
    }
}



module.exports = {
    followUserIds,
    followThisUser
}