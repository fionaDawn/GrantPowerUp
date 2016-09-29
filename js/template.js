/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var parkMap = {
  acad: 'Acadia National Park',
  arch: 'Arches National Park',
  badl: 'Badlands National Park',
  brca: 'Bryce Canyon National Park',
  crla: 'Crater Lake National Park',
  dena: 'Denali National Park',
  glac: 'Glacier National Park',
  grca: 'Grand Canyon National Park',
  grte: 'Grand Teton National Park',
  olym: 'Olympic National Park',
  yell: 'Yellowstone National Park',
  yose: 'Yosemite National Park',
  zion: 'Zion National Park'
};

var popupEndorse = function(t) {
  return t.popup({
      title: 'Choose Endorsment State',
      items: [{
          text: 'Endorse',
          callback: function (t) {
            t.popup({
              url: './endorse.html',
              height: 184
            })
          }
        }]
    })
}

var popupPropose = function(t) {
  return t.popup({
      title: 'Actions',
      items: [{
          text: 'Update Grant',
          callback: function (t) {
            t.popup({
              url: './grant-propose.html',
              height: 184
            })
          }
        }]
    })
}

var cardButtonCallback = function(t) {
  return t.list('name')
  .get('name')
  .then(function(listName){


    if (listName == 'Qualify') {
      popupEndorse(t);
    } else if (listName == 'Propose') {
      popupPropose(t);
    } else {
      [];
    }
  })

}

var getBadges = function(t){
  var stateVal = '';
  var initiative, client, grantType, purpose;
  return Promise.all([
    t.get('card', 'private', 'pipz'),
    t.get('card', 'private', 'initiative'),
    t.get('card', 'private', 'client'),
    t.get('card', 'private', 'gType'),
    t.get('card', 'private', 'purpose')
  ])
  .spread(function(savedPipz, savedInitiative, savedClient, savedGtype, savedPurpose){
    if(savedPipz && /[a-z]+/.test(savedPipz)){
      stateVal = savedPipz;
    } else if(savedInitiative && /[a-z]+/.test(savedInitiative)){
      initiative = savedInitiative;
      client = savedClient;
      grantType = savedGtype;
      purpose = savedPurpose;
    }

  }).then(function(){
    if (stateVal !== '') {
      if (stateVal == 'does not fulfill')
        badgeColor = 'red';
      else if (stateVal == 'fulfills')
        badgeColor = 'green';
      else if (stateVal == 'strongly fulfills')
        badgeColor = 'yellow';

      return [{
          text: stateVal,
          color: badgeColor,
          icon: WHITE_ICON
        }];
      } else if (initiative) {
        return [{
            text: 'Initiative: ' + initiative
          },
          {
            text: 'Client: ' + client
          },
          {
            text: 'Grant Type: ' + grantType
          },
          {
            text: 'Purpose: ' + purpose
          }];
      } else {
        return [];
      }
  })
};

var formatNPSUrl = function(t, url){
  if(!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)){
    return null;
  }
  var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
  if(parkShort && parkMap[parkShort]){
    return parkMap[parkShort];
  } else{
    return null;
  }
};

var boardButtonCallback = function(t){
  return t.boardBar({
    url: './board-bar.html',
    height: 200
  });
};

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options){
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment){
      return attachment.url.indexOf('http://www.nps.gov/yell/') == 0;
    });

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    if(claimed && claimed.length > 0){
      // if the title for your section requires a network call or other
      // potentially length operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      return [{
        id: 'Yellowstone', // optional if you aren't using a function for the title
        claimed: claimed,
        icon: GRAY_ICON,
        title: 'Example Attachment Section: Yellowstone @erwinencabo ',
        content: {
          type: 'iframe',
          url: t.signUrl('./section.html', { arg: 'you can pass your section args here' }),
          height: 230
        }
      }];
    } else {
      return [];
    }
  },
  'attachment-thumbnail': function(t, options){
    var parkName = formatNPSUrl(t, options.url);
    if(parkName){
      // return an object with some or all of these properties:
      // url, title, image, openText, modified (Date), created (Date), createdBy, modifiedBy
      return {
        url: options.url,
        title: 'Test Name',
        image: {
          url: './images/nps.svg',
          logo: false // false if you are using a thumbnail of the content
        },
        openText: 'Open in NPS'
      };
    } else {
      throw t.NotHandled();
    }
  },
  'board-buttons': function(t, options){
    return [{
      icon: WHITE_ICON,
      text: 'Grant',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t);
  },
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Grant',
      callback: cardButtonCallback
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  'card-from-url': function(t, options) {
      return {
        name: 'Test',
        desc: 'An awesome park: ' + options.url
      };
    // return {
    //   name: 'Test name',
    //   desc: 'Hi @fiona'
    // }
  },
  'format-url': function(t, options) {
    var parkName = formatNPSUrl(t, options.url);
    if(parkName){
      return {
        icon: GRAY_ICON,
        text: parkName
      };
    } else {
      throw t.NotHandled();
    }
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
