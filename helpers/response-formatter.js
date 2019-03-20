const debug = require("./debug")

const responseObj = {
    pictureURL: undefined,
    gamerscore: undefined,
    gamertag: undefined,
    subscriptionType: undefined,
    reputation: undefined,
    realName: undefined,
    bio: undefined,
    tenure: undefined,
    watermarks: undefined,
    location: undefined,
    presenceState: undefined,
    presenceText: undefined,

    _removeEmptyValues: function () {
        const debugPrefix = "rfObj._REV"

        debug.level2(`this: ${JSON.stringify(this)}`, debugPrefix)
        Object.keys(this).forEach((key) => {
            //console.log(`key: ${key} | ${this[key]}`)
            if (this[key] == "") { this[key] = undefined; debug.level1(`removed empty key ${key}`, debugPrefix) }
        });
      }
}

function checkBody(body) {
    const json = body ? JSON.parse(body) : { code: 1 }
    //const json = JSON.parse(body)
    if (json.code !== undefined || (Array.isArray(json) && json[0].ErrorType !== undefined)) {
        return false
    } else {
        return true
    }
}

const myAccount = body => {
    /*
    Missing in this endpoint:
        - Presence (State)
        - Presence (Text)
        - Tenure
        - Watermarks
    */
    const json = JSON.parse(body)
    var obj = Object.assign({}, responseObj);

    // Set the variables
    obj.pictureURL = json.profileUsers[0].settings[0].value
    obj.gamerscore = json.profileUsers[0].settings[1].value
    obj.gamertag = json.profileUsers[0].settings[2].value
    obj.subscriptionType = json.profileUsers[0].settings[3].value
    obj.reputation = json.profileUsers[0].settings[4].value.split("Player")[0]
    obj.realName = json.profileUsers[0].settings[6].value
    obj.bio = json.profileUsers[0].settings[7].value
    obj.location = json.profileUsers[0].settings[8].value

    // Remove empty values
    obj._removeEmptyValues()

    // Return the object
    return obj;
}

const profileUsers = body => {
    /*
    Missing in this endpoint:
        - Presence (State)
        - Presence (Text)
    */
    const json = JSON.parse(body)
    var obj = Object.assign({}, responseObj);

    // Set the variables
    obj.pictureURL = json.profileUsers[0].settings[0].value
    obj.gamerscore = json.profileUsers[0].settings[1].value
    obj.gamertag = json.profileUsers[0].settings[2].value
    obj.subscriptionType = json.profileUsers[0].settings[3].value
    obj.reputation = json.profileUsers[0].settings[4].value.split("Player")[0]
    obj.realName = json.profileUsers[0].settings[6].value
    obj.bio = json.profileUsers[0].settings[7].value
    if (json.profileUsers[0].settings[8].value != 0) obj.tenure = json.profileUsers[0].settings[8].value
    obj.watermarks = json.profileUsers[0].settings[9].value.replace(/\|/g, ", ")
    obj.location = json.profileUsers[0].settings[10].value

    // Remove empty values
    obj._removeEmptyValues()

    // Return the object
    return obj;
}

const playerSummary = body => {
    /*
    Missing in this endpoint:
        - Subscription Type
        - Location
        - Tenure
        - Watermarks
    */
    const json = JSON.parse(body)
    console.log(json)
    var obj = Object.assign({}, responseObj);
    // Set the variables
    obj.pictureURL = json.people[0].displayPicRaw
    obj.gamerscore = json.people[0].gamerScore
    obj.gamertag = json.people[0].gamertag
    obj.reputation = json.people[0].xboxOneRep.split("Player")[0]
    obj.realName = json.people[0].realName
    obj.presenceState = json.people[0].presenceState
    obj.presenceText = json.people[0].presenceText

    // Remove empty values
    obj._removeEmptyValues()

    // Return the object
    return obj;
}

module.exports = { checkBody, myAccount, profileUsers, playerSummary }