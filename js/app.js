let _elems_ = {};
let _anims_ = {};
let _transitions_ = {};

window.addEventListener( 'load', init );

function init(){
  _elems_.pageLoader = document.querySelector("#pageLoaderContainer");
  _elems_.pageContent = document.querySelector("#pageContent");
  _elems_.navigationMenu = document.querySelector("#navigationMenu");
  closeLoader();
  initializeBarba();
}

function closeLoader(){
  let revealContent = anime.timeline({});

  revealContent.add(
    {
      targets: _elems_.pageLoader,
      translateX: ["0%", "-100%"],
      duration: 800,
      easing: "easeOutQuad"
    }
  )

  revealContent.add(
    {
      targets: [_elems_.pageContent, _elems_.navigationMenu],
      opacity: [0, 1],
      delay: 100,
      duration: 1500,
      easing: "easeOutQuad"
    },
  )
}

function initializeBarba(){
  barba.init({
    transitions : [ _transitions_.slideLoader ],
  })
}

// BARBA TRANSITIONS
_transitions_.slideLoader = {
  name: "slide out",
  // fade out content
  beforeLeave( data ){
    return new Promise( function(res,rej){
      anime({
        targets: [data.current.container, _elems_.navigationMenu],
        opacity: ["1", "0"],
        duration: 500,
        endDelay: 250,
        easing: 'linear',
        complete: function(){
          return res("step_1");
        }
      })
    })
  },
  // roll in loader
  leave(){
    return new Promise( function(res,rej){
      anime({
        targets: _elems_.pageLoader,
        translateX: ["-100%", "0%"],
        duration: 500,
        endDelay: 750,
        easing: "easeOutQuad",
        complete: function(){
          return res("step 2");
        }
      })
    })
  },
  // hide current page content
  afterLeave( data ){
    data.current.container.style.setProperty("display", "none");
    return;
  },
  // roll back loader and
  // fade in new content
  enter( data ){
    return new Promise( function(res,rej){
      let _reveal = anime.timeline({
        complete: function(){
          return res("step 3");
        }
      })

      _reveal.add({
        targets: _elems_.pageLoader,
        translateX: ["0%", "-100%"],
        duration: 500,
        easing: "easeOutQuad",
      })

      _reveal.add({
        targets: [data.next.container, _elems_.navigationMenu],
        opacity: ["0", "1"],
        duration: 500,
        easing: 'linear',
      });

    })
  }
}