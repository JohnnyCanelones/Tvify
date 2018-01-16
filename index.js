$(function () {
  let = $tvShowsContainer = $('#app-body').find('.tv-shows')
  
  function renderShows(shows) {
    shows.forEach(function (show) {
      $tvShowsContainer.find('.loader').remove()
      let article = template
      .replace(':name:', show.name)
      .replace(':img:', show.image.medium)
      .replace(':summary:', show.summary)
      .replace(':alt img:', show.name + "  logo")

        let $article = $(article)
        $tvShowsContainer.append($article);
        
    });
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
      let $loader = $('<div class="loader">Cargando...</div>')
      $loader.appendTo($tvShowsContainer)
      
      $.ajax({
        url: "http://api.tvmaze.com/search/shows?",
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
      <h1>:name:</h1>
      <p>:summary:</p>
    </div>
  </article>`
  

  //listados de shows
  $.ajax({
      url: 'http://api.tvmaze.com/shows',
      success : function(shows, textStatus, xhr){
        renderShows(shows)
      }       
  })
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