$(function () {
  let $loader = $('<div class="loader">Cargando...</div>')
  let $tvShowsContainer = $('#app-body').find('.tv-shows')
  console.log($tvShowsContainer)
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
        .replace(':id:', show.id)
        .replace(':name:', show.name)
        .replace(':summary:', show.summary)
        .replace(':img:', show.image ? show.image.medium : '')
        .replace(':alt img:', show.name + "  logo")
        .replace(':rating:', show.rating.average)
      let $article = $(article)
      $tvShowsContainer.append($article.fadeIn(1500));
  }

  function renderSeasons(seasons) {
    seasons.forEach(function (show) {
     let article = seasonsTemplate
          .replace(':id:', show.id)
          .replace(':number:', show.number)
          // .replace(':img:', show.image ? show.image.medium : '')
        let $article = $(article)
        $tvShowsContainer.find('.seasons').remove()
        $article.appendTo('div .numeros')

        // $tvShowsContainer.append($article.fadeIn(1500)); 
    }) 
  }

function renderSDetail(detail) {
      let article = detailSeasonTemplate
        .replace(':id:', detail.id)
        .replace(':number:', detail.number)
        .replace(':img:', detail.image ? detail.image.medium : '')
        .replace(':alt img:', detail.name + "  logo")
        .replace(':premiereDate:', detail.premiereDate )
        

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
  <div class="tv-show">
    <div class="row flex-items-xs-middle flex-items-xs-between">
      <div class="text-xs-center col-xs-12 col-md-3 " > 
        <img src=":img:" alt=":alt img:">
      </div>
      
      <div class="col-xs-12 col-md-9 text-justify margin-top">
        <input type="button" class="url" value="https://api.tvmaze.com/shows/:url:"><h1>:name:</h1></a>
        <p>:summary:</p>
      </div>
    </div>

  </div>`
  
// template de detalles
  let template2 =
    `<article class="tv-show">
      <div class="row flex-items-xs-middle flex-items-xs-between">
        <div class="text-xs-center col-xs-12 col-md-3"> 
          <img src=":img:" alt=":alt img:">
        </div>
        <div class="col-xs-12 col-md-9 text-justify margin-top">
          <h1>:name:</h1>
          <p>:summary:</p>
          <h3 class="inline">Puntuación</h3><h4 class="inline">:rating:/10</h4><br>
          <br>
          <div class="row">
            <div class="col-xs-12 col-sm-4 col-md-3 ">
              <input type="button" class="seasons" value="https://api.tvmaze.com/shows/:id:/seasons">
              <h3 class="">Temporadas</h3></button>
            </div>
            <div class="col-xs-6">
              <div class="inline numeros" style = "display:-webkit-box"></div>
            </div>
          </div>
        </div>
    </div>

  </article>`


  let seasonsTemplate= `
   
    <input class="s-detail" value="https://api.tvmaze.com/seasons/:id:"><h4 class="inline">:number:</h4></input>
    
  `
  let detailSeasonTemplate = `
  <article class="tv-show">
    
    <div class="left"> 
      <img src=":img:" alt=":alt img:">
    </div>
    <div class="right info">
      <h1>Temporada :number:</h1>
      <button class= "like">💗</button>
     <h3 class="inline">Fecha de Lanzamiento:</h3><h4 class="inline">:premiereDate:</h4><br>
     <br>
      <input type="button" class="episopdes" value="https://api.tvmaze.com/seasons/:id:"></button>
    </div>

  </article>

  `
  
  
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
        
        renderDetail(show)
      })
      
  })
  
  $tvShowsContainer.on('click','input.seasons', function(event){
    let $this= $(this)
    $.ajax($this.val())
      .then(function(seasons) {
        
        renderSeasons(seasons)
      
      })
         
  })

 $tvShowsContainer.on('click','input.s-detail', function(event){
    let $this= $(this)    
    $.ajax($this.val())
      .then(function(seasons) {
        $tvShowsContainer.find($this).remove()
        console.log(seasons)
        renderSDetail(seasons)
        
      })
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