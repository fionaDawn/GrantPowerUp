/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var pipzSelector = document.getElementById('pipz');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'pipz'),
  ])
  .spread(function(savedPipz){
    if(savedPipz && /[a-z]+/.test(savedPipz)){
      pipzSelector.value = savedPipz;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'shared', 'pipz', pipzSelector.value)
  .then(function(){
    t.closePopup();
  })
})
