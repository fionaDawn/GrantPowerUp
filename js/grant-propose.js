/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var inititativeSelector = document.getElementById('initiative');
var clientSelector = document.getElementById('client');
var gTypeSelector = document.getElementById('grant-type');
var purposeInput = document.getElementById('purpose');

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'initiative'),
    t.get('card', 'private', 'client'),
    t.get('card', 'private', 'gType'),
    t.get('card', 'private', 'purpose')
  ])
  .spread(function(savedInitiative, savedClient, savedGtype, savedPurpose){
    if(savedInitiative && /[a-z]+/.test(savedInitiative)){
      inititativeSelector.value = savedInitiative;
    }
    if(savedClient && /[a-z]+/.test(savedClient)){
      clientSelector.value = savedClient;
    }
    if(savedGtype && /[a-z]+/.test(savedGtype)){
      gTypeSelector.value = savedGtype;
    }
    if(savedPurpose && /[a-z]+/.test(savedPurpose)){
      purposeInput.value = savedPurpose;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('card', 'private', 'initiative', inititativeSelector.value)
  .then(function(){
    return t.set('card', 'private', 'client', clientSelector.value) 
  })
  .then(function(){
    return t.set('card', 'private', 'gType', gTypeSelector.value)
  })
  .then(function(){
    return t.set('card', 'private', 'purpose', purposeInput.value)
  })
  .then(function(){
    t.closePopup();
  })
})
