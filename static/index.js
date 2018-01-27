$(function () {
  let $loader = $('<div class="loader">Cargando...</div>')
  let $tvShowsContainer = $('#app-body').find('.tv-shows')
  $tvShowsContainer.on('click', 'button.like', function (ev){
    let $this= $(this)
    $this.closest('.tv-show').toggleClass('liked');
  })
  
  function renderShows(shows) {

    shows.forEach(function (show) {
      $tvShowsContainer.find('.loader').remove()
      let article = template
        .replace(':url:', show.id)
        .replace(':name:', show.name)
        .replace(':img:', show.image ? show.image.medium : '')
        .replace(':summary:', show.summary)
        .replace(':alt img:', show.name + "  logo")

      let $article = $(article)
      $tvShowsContainer.append($article.fadeIn(1500));
        
    });
  }

  function renderDetail(show) {
    $tvShowsContainer.find('.loader').remove()
    let article = template2
        .replace(':name:', show.name)
        .replace(':img:', show.image ? show.image.medium : '')
        .replace(':summary:', show.summary)
        .replace(':alt img:', show.name + "  logo")
        .replace(':rating:', show.rating.average)
      let $article = $(article)
      $tvShowsContainer.append($article.fadeIn(1500));
  }


  
  // submit search form
  $('#app-body')
    .find('form')
    .submit(function(ev){
      ev.preventDefault()
      let search = $(this)
        .find('input[type="text"]')
        .val() 
      
      $tvShowsContainer.find('.tv-show').remove()
      
      $loader.appendTo($tvShowsContainer)
      
      $.ajax({
        url: "https://api.tvmaze.com/search/shows?",
        data: {q: search},
        success: function (response, textStatus, xhr) {
          $loader.remove()
          let shows =response.map(function(el){
            return el.show
          })
          renderShows(shows)

        }
      });

    })
    
  // template de base
  let template =` 
  <article class="tv-show">
    
    <div class="left"> 
      <img src=":img:" alt=":alt img:">
    </div>
    <div class="right info">
      <input type="button" class="url" value="https://api.tvmaze.com/shows/:url:"><h1>:name:</h1></a>
      <p>:summary:</p>
      <button class= "like">💗</button>
      
    </div>

  </article>`
  
// template de detalles
  let template2 =
    `<article class="tv-show">
    
    <div class="left"> 
      <img src=":img:" alt=":alt img:">
    </div>
    <div class="right info">
      <h1>:name:</h1>
      <p>:summary:</p>
      <button class= "like">💗</button>
      <h3>Puntuación</h3><h4>:rating:/10</h4>
    </div>

  </article>`
  
  
 if (!localStorage.shows) {
    //listados de shows
    $.ajax('https://api.tvmaze.com/shows')
      .then( function(shows) {
        $tvShowsContainer.find('.loader').remove()
        renderShows(shows)
      })      
 }else{
    renderShows(JSON.parse(localStorage.shows))
 }


  $tvShowsContainer.on('click','input.url', function(event) {
    let $this= $(this)
    $tvShowsContainer.find('.tv-show').remove()
    $loader.appendTo($tvShowsContainer)
    $.ajax($this.val())
      .then(function(show) {
        console.log(show)
        renderDetail(show)
      })

    });


  
})


// $('#boton').click(function(){
//   swal({
//     title: "Felicidades!", 
//     text: "Cliqueaste el botón!", 
//     type: "success",
//     confirmButtonColor: "#34a3d6",
//   })

//   $('#boton').css({
//     "background-color": "red",
//     "border-radius": "100px",
//   })
  
// })