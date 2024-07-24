/** Shopify CDN: Minification failed

Line 20:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 22:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 23:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 24:2 Transforming const to the configured target environment ("es5") is not supported yet
Line 30:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 41:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 45:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 130:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 131:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 157:8 Transforming const to the configured target environment ("es5") is not supported yet
... and 1 more hidden warnings

**/
$(document).ready(function(){
  // 	image scrolling banner
 
  // Play with this value to change the speed
  let tickerSpeed = 1.3;

  let flickity = null;
  let isPaused = false;
  const slideshowEl = document.querySelector('.js-img-scrolling');
  if(slideshowEl){
    var scrollNav = slideshowEl.dataset.nav;
    var autoscrolling = slideshowEl.dataset.autoscrolling;
    var options = {};
  
    const update = () => {
      if (isPaused || autoscrolling == 'true') return;
      if (flickity.slides) {
        flickity.x = (flickity.x - tickerSpeed) % flickity.slideableWidth;
        flickity.selectedIndex = flickity.dragEndRestingSelect();
        flickity.updateSelectedSlide();
        flickity.settle(flickity.x);
      }
      window.requestAnimationFrame(update);
    };
  
    const pause = () => {
      isPaused = true;
    };
  
    const play = () => {
      if (isPaused) {
        isPaused = false;
        window.requestAnimationFrame(update);
      }
    };
  
    if(scrollNav == 'true'){
      options = {
        autoPlay: false,
        prevNextButtons: true,
        pageDots: false,
        draggable: true,
        wrapAround: true,
        selectedAttraction: 0.015,
        friction: 0.25
      }
    }else{
    	options = {
        autoPlay: false,
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        wrapAround: true,
        selectedAttraction: 0.015,
        friction: 0.25
      }
    }
    
    flickity = new Flickity(slideshowEl, options);
    flickity.x = 0;
  
  
    slideshowEl.addEventListener('mouseenter', pause, false);
    slideshowEl.addEventListener('focusin', pause, false);
    slideshowEl.addEventListener('mouseleave', play, false);
    slideshowEl.addEventListener('focusout', play, false);
  
    flickity.on('dragStart', () => {
    	isPaused = true;
    });
  
    update();
  }

  // $('body').on('click', 'a', function(e){
  //   e.preventDefault();

  //   var type = $(this).attr('data-anchor-type');
  //   var target = $(this).attr('href');

  //   if(type == 'true'){
  //     $('html, body').animate({
  //         scrollTop: $(target).offset().top
  //     }, 500);
  //   }else{
  //     window.location.href = target;
  //   }
  // })

  $('.js-size-chart-trigger').on('click', function(e){
    e.preventDefault();

    $('.product-size-chart').addClass('active');
    $('body').addClass('popup-enabled');
  })

  $('.js-link-popup').on('click', function(e){
    e.preventDefault();

    var target = $(this).attr('data-popup');

    $(target).addClass('active');
    $('body').addClass('popup-enabled');
  })

  $('.js-ajax-popup-content').on('click', function(e){
    e.preventDefault();

    var href = $(this).attr('data-href');
    var target = $(this).attr('data-popup');

    fetch(href)
    .then(response => response.text())
    .then(responseText => {
      const html = responseText;
      const newDom = new DOMParser().parseFromString(html, 'text/html');

      var rPage = $(newDom).find('.page');
      rPage.find('.theme-editor-scroll-offset').remove();
      rPage.find('.header__space').remove();
      rPage.find('#shopify-section-announcement-bar').remove();
      rPage.find('#shopify-section-header').remove();
      rPage.find('#shopify-section-popup').remove();
      rPage.find('#shopify-section-footer').remove();
      rPage.find('.page-transition').remove();

      $(target).addClass('active');
      $(target).find('.size-chart-content').empty().append(rPage.html());
      $('body').addClass('popup-enabled');

      // $("script.refresh-js").each(function(){
      //     var oldScript = this.getAttribute("src");
      //     $(this).remove();
      //     var newScript;
      //     newScript = document.createElement('script');
      //     newScript.type = 'text/javascript';
      //     newScript.src = oldScript;
      //     document.getElementsByTagName("head")[0].appendChild(newScript);
      // });

      newDom.querySelectorAll('script').forEach(oldScriptTag => {
        const newScriptTag = document.createElement('script');
        Array.from(oldScriptTag.attributes).forEach(attribute => {
          newScriptTag.setAttribute(attribute.name, attribute.value)
        });
        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });

      //slide part
      if($('[data-slider]').length > 0){
        $('[data-slider]').removeClass('is-hidden').flickity({
          // options
          cellAlign: 'left',
          contain: true,
          prevNextButtons: false,
          pageDots: false
        });
      }
    })
  })

  $('.size-chart-close').on('click', function(){
    $('.product-size-chart').removeClass('active');
    $('body').removeClass('popup-enabled');
  })

  $(document).mouseup(function (e){

    var container = $(".size-chart-container");

    if (!container.is(e.target) && container.has(e.target).length === 0){

      container.parent('.product-size-chart').removeClass('active');
      $('body').removeClass('popup-enabled');

    }
  });

  $('body').on('click', '.js-modal-popup', function(){
    const modalId = $(this).attr('data-modal');

    $(`#${modalId}`).fadeIn();
  })

  $('body').on('click', '.modal-close-button', function(){
    $(this).closest('.modal').hide();
  })

})