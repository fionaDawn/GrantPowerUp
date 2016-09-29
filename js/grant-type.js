/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var gTypeSelector = document.getElementById('grant-type');
var purposeInput = document.getElementById('purpose');

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'gType'),
    t.get('card', 'private', 'purpose')
  ])
  .spread(function(savedGtype, savedPurpose){
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
  return t.set('card', 'private', 'gType', gTypeSelector.value)
  .then(function(){
    return t.set('card', 'private', 'purpose', purposeInput.value) 
  })
  .then(function(){
    t.closePopup();
  })
})
