const debug = require("./debug");

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
  followers: undefined,
  following: undefined,

  _removeEmptyValues: function() {
    const debugPrefix = "rfObj._REV";

    debug.level2(`this: ${JSON.stringify(this)}`, debugPrefix);
    Object.keys(this).forEach(key => {
      //console.log(`key: ${key} | ${this[key]}`)
      if (this[key] == "") {
        this[key] = undefined;
        debug.level1(`removed empty key ${key}`, debugPrefix);
      }
    });
  }
};

function checkBody(body) {
  const json = body ? JSON.parse(body) : { code: 1 };
  //const json = JSON.parse(body)
  if (
    json.code !== undefined ||
    (Array.isArray(json) && json[0].ErrorType !== undefined)
  ) {
    return false;
  } else {
    return true;
  }
}

const px_profile = body => {
  /*
      XBL-API.PROUSER123.ME FORMAT
      ----------------------------

      Missing in this endpoint:
          - Presence (State)
          - Presence (Text)
          - Following
          - Followers
  */
  const json = JSON.parse(body);
  var obj = Object.assign({}, responseObj);

  // Set the variables
  obj.pictureURL = json.profileUsers[0].settings[5].value;
  obj.gamerscore = json.profileUsers[0].settings[3].value;
  obj.gamertag = json.profileUsers[0].settings[4].value;
  obj.subscriptionType = json.profileUsers[0].settings[6].value;
  obj.reputation = json.profileUsers[0].settings[8].value.split("Player")[0];
  obj.realName = json.profileUsers[0].settings[13].value;
  obj.bio = json.profileUsers[0].settings[11].value;
  if (json.profileUsers[0].settings[7].value != 0)
    obj.tenure = json.profileUsers[0].settings[7].value;
  obj.watermarks = json.profileUsers[0].settings[12].value.replace(/\|/g, ", ");
  obj.location = json.profileUsers[0].settings[10].value;

  // Remove empty values
  obj._removeEmptyValues();

  // Return the object
  return obj;
};

const px_profile_fsummary = (body, fsummary) => {
  /*
      XBL-API.PROUSER123.ME FORMAT
      ----------------------------

      Missing in this endpoint:
          - Presence (State)
          - Presence (Text)
  */
  const json = JSON.parse(fsummary);

  const obj = px_profile(body);

  obj.followers = json.followers;
  obj.following = json.following;

  // Remove empty values
  obj._removeEmptyValues();

  // Return the object
  return obj;
};

module.exports = {
  checkBody,
  px_profile,
  px_profile_fsummary
};
