/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var gTypeSelector = document.getElementById('grant-type');

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'gType'),
  ])
  .spread(function(savedGtype){
    if(savedGtype && /[a-z]+/.test(savedGtype)){
      gTypeSelector.value = savedGtype;
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
    t.closePopup();
  })
})
