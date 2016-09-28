/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var purposeInput = document.getElementById('purpose');

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'purpose')
  ])
  .spread(function(savedPurpose){
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
  return t.set('card', 'private', 'purpose', purposeInput.value)
  .then(function(){
    t.closePopup();
  })
})
