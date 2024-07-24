$(document).ready(function(){
  var catalog_block_slide = $('.catalog_block-slide').flickity({
    // options
    cellAlign: 'left',
    contain: true,
    pageDots: false,
    groupCells: '80%'
  });


  let getPermalinkFromURL = (url) => {
    return url.substring(url.indexOf('/programs/') + 10).split('?')[0]
  }

  function request(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 2000;
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response)
          } else {
            reject(xhr.status)
          }
        }
      }
      xhr.ontimeout = function () {
        reject('timeout')
      }
      xhr.open('get', url, true)
      xhr.send();
    })
  }

  let templateScript = () => {
    cards = document.querySelectorAll('.main_poster')
    if(cards.length > 0){
      cards.forEach((card) => {
        if(card.href.includes('/programs/on-demand-armbar-masterclass')){
          var link = '/orders/checkout?c=1505787';
        }else if(card.href.includes('/programs/on-demand-guard-pass-system')){
          var link = '/orders/checkout?c=1655184';
        }else if(card.href.includes('/programs/on-demand-x-guard-masterclass-tainan-dalpra')){
          var link = '/orders/checkout?c=1797130';
        }else if(card.href.includes('/programs/on-demand-foundational-jiu-jitsu')){
          var link = '/orders/checkout?c=1754414';
        }else if(card.href.includes('/programs/x-guard-live-seminar-tainan-dalpra')){
          var link = '/orders/checkout?c=1909580';
        }else if(card.href.includes('/programs/on-demand-longstep-masterclass-tainan-dalpra')){
          var link = '/orders/checkout?c=1926381';
        }else if(card.href.includes('/programs/on-demand-game-theory-tainan-dalpra-gui-mendes')){
          var link = '/orders/checkout?c=2139226';
        }else if(card.href.includes('/programs/on-demand-back-take-masterclass-tainan-dalpra')){
          var link = '/orders/checkout?c=2057258';
        }else if(card.href.includes('/programs/on-demand-finishing-the-pass-gui-mendes')){
          var link = '/orders/checkout?c=2097633';     
        }else if(card.href.includes('/programs/on-demand-passing-the-lasso-and-spider-guard')){
          var link = '/orders/checkout?c=2553968';
        }else if(card.href.includes('/programs/anaconda-choke-masterclass-rafael-mendes')){
          var link = '/checkout/new?o=p2719890';  
        }else if(card.href.includes('/programs/submission-series-2023-competition-season-tainan-dalpra')){
          var link = '/checkout/new?o=p2773024';
        }else if(card.href.includes('/programs/gola-y-manga-serie-en-espanol-de-pablo-lavaselli')){
          var link = '/checkout/new?o=p2825679';           
        }
        let ctaButtonPurchase = `<a href="${link}" class="purchase-link">(Purchase)</a>`;
        let ctaButtonPurchased = `<span class="purchase-link">(Purchased)</span>`;

        let URL = `/api/contents/${getPermalinkFromURL(card.href)}`;
        var cardWrap = card.closest('.card-cell');
        if (!card.classList.contains('touched')) {
          axios.get(URL).then(function (response) {
            let program = response.data
            let children_videos = program.children_videos
            if(children_videos){
              let badge = `<svg viewBox="0 0 16 16" width="16" height="16" data-test="collection-icon" class="badge-item collection-icon"><use xlink:href="#playlist"></use></svg><span data-v-0db53ca8="" data-test="collection-videos-amount" class="badge-item">${children_videos.length}</span>`
              let duration = card.querySelector('.duration')
              duration.innerHTML = badge
            }
            var parentNode = card.closest('.catalog_block');
            var title = parentNode.querySelector('.catalog_block--title').innerText;
            var cardWrap = card.closest('.card-cell');

            if(URL.includes('on-demand-foundational-jiu-jitsu') || URL.includes('on-demand-guard-pass-system')){
              var price = '$99.99';
            }else if(URL.includes('x-guard-live-seminar')){
              var price = '$24.99';
            }else if(URL.includes('on-demand-game-theory-tainan-dalpra-gui-mendes')){
              var price = '$149.99';
            }else if(URL.includes('on-demand-back-take-masterclass-tainan-dalpra')){
              var price = '$219.99';
            }else if(URL.includes('on-demand-longstep-masterclass-tainan-dalpra')){
              var price = '$199.99';
             }else if(URL.includes('on-demand-finishing-the-pass-gui-mendes')){
              var price = '$199.99';   
            }else if(URL.includes('anaconda-choke-masterclass-rafael-mendes')){
              var price = '$229.99';   
            }else if(URL.includes('submission-series-2023-competition-season-tainan-dalpra')){
              var price = '$49.99'; 
            }else if(URL.includes('gola-y-manga-serie-en-espanol-de-pablo-lavaselli')){
              var price = '$59.99';           
            }else{
              var price = '$199.99';
            }

            if(title == 'ON DEMAND'){
              var content = `<div class="card-cell-info"><p class="card-cell-author">${program.author.title}</p><p class="card-cell-price">${price}</p></div>`;
              cardWrap.insertAdjacentHTML('beforeend',content);

              var accessLink = `/api/contents/${getPermalinkFromURL(card.href)}/access`;
              axios.get(accessLink).then(function (response) {
                let result = response.data
                
                if(result.result){
                  $(cardWrap).find('.card-cell-price').append(ctaButtonPurchased);
                }else{
                  $(cardWrap).find('.card-cell-price').append(ctaButtonPurchase);
                }

                catalog_block_slide.flickity('resize');
              })

              cardWrap.classList.add('ondemand-card');
            }else{
              let newUrl = `/api/contents/${getPermalinkFromURL(card.href)}`;
              axios.get(newUrl).then(function (response) {
                let program = response.data;

                if(program.author){
                  var content = `<div class="card-cell-info"><p class="card-cell-author">${program.author.title}</p></div>`;
                  cardWrap.insertAdjacentHTML('beforeend',content);
                }

                if(program.tags.includes('Free Video')){
                  var freeBadge = `<div class="badge flex justify-center items-center text-white content-card-badge content-free-badge"><span class="badge-item">FREE</span></div>`;
                  card.insertAdjacentHTML('beforeend',freeBadge);
                }
              })
            }
            card.classList.add('touched')
          })
        }
      })
    }
  }

  templateScript()

  let catalogScript = () => {
    let uiFilter = document.querySelector('.ui-filters')
    let catalogLink = document.querySelector('.menu-hide')
    if(location.href.includes('/catalog')){
      if(catalogLink){
        catalogLink.classList.add('hidden')
      }
      let categoryAll = document.querySelectorAll('.category-see-all')
      let categroyTitleAll = document.querySelectorAll('.category-title')
      let categoryGroupAll = document.querySelectorAll('.category-group')

      if(categoryAll.length > 0){
        categoryAll.forEach((categoryTitle) => {
          var title = categoryTitle.querySelector('a')
          title.innerText = 'View All'
        })
      }
      if(categroyTitleAll.length > 0){
        categroyTitleAll.forEach((categoryTitle) => {
          var title = `<div class="category-title truncate">${categoryTitle.innerText}</div>`
          var wrap = categoryTitle.closest('.category-flex')
          var titleText = categoryTitle.innerText
          if(!wrap.classList.contains('touch')){
            if(titleText.includes('FAVORITES') || titleText.includes('MY LIBRARY')){
              var categoryGroup = categoryTitle.closest('.category-group')
              categoryGroup.classList.add('hidden')
            }
            categoryTitle.remove()
            wrap.insertAdjacentHTML('afterbegin',title)
            wrap.classList.add('touch')
          }
        })
      }
      if(uiFilter){
        uiFilter.classList.add('hidden')
      }
      if(categoryGroupAll.length > 0){
        // categoryGroupAll.forEach((categoryGroup) => {
        //   var titleG = categoryGroup.querySelector('.category-title');
        //   if(titleG) var titleGText = titleG.innerText;
        //   if(!categoryGroup.classList.contains('touch')){
        //     if(titleGText == 'ON DEMAND'){
        //       var authors = [
        //         `<div class="swiper-slide card-cell-author">
        //         <a href="/categories/on-demand?category_id=104918&author_id=48305" class="card-image">
        //         <div class="image-container relative">
        //         <div class="relative image-content">
        //         <img src="https://alpha.uscreencdn.com/499xnull/assets/26872/rRG1Uc8gTm6M14LiGmkj_TAINAN-DALPRA.jpg?auto=webp" alt="" class="b-image object-cover h-full top-0 left-0 relative">
        //         </div>
        //         <span class="title primary-hover-color">Tainan Dalpra</span>
        //         </div>
        //         </div>`,
        //         `<div class="swiper-slide card-cell-author">
        //         <a href="/categories/on-demand?category_id=104918&author_id=48104" class="card-image">
        //         <div class="image-container relative">
        //         <div class="relative image-content">
        //         <img src="https://alpha.uscreencdn.com/499xnull/assets/26872/yBNYAzUQVel69p7AsA5D_RAFAEL-MENDES.jpg?auto=webp" alt="" class="b-image object-cover h-full top-0 left-0 relative">
        //         </div>
        //         <span class="title primary-hover-color">Rafael Mendes</span>
        //         </div>
        //         </div>`,
        //         `<div class="swiper-slide card-cell-author">
        //         <a href="/categories/on-demand?category_id=104918&author_id=48105" class="card-image">
        //         <div class="image-container relative">
        //         <div class="relative image-content">
        //         <img src="https://alpha.uscreencdn.com/499xnull/assets/26872/0iqYLH5ZROoGpXn2Lydg_GUI-MENDES.jpg?auto=webp" alt="" class="b-image object-cover h-full top-0 left-0 relative">
        //         </div>
        //         <span class="title primary-hover-color">Gui Mendes</span>
        //         </div>
        //         </div>`
        //       ];
        //       var groupSlide = categoryGroup.querySelector('.swiper-container').swiper;
        //       if(groupSlide) groupSlide.removeAllSlides(); groupSlide.appendSlide(authors);
        //       categoryGroup.classList.add('touch')
        //     }
        //   }
        // })
      }
    }else{
      if(catalogLink){
        catalogLink.classList.remove('hidden')
      }
      if(uiFilter){
        uiFilter.classList.remove('hidden')
      }
    }
    
    setTimeout(() => catalogScript(), 300)
  }
  catalogScript()

  let catalogOndemandScript = () => {
    if(location.href.includes('/catalog')){
      let programArmbarmasterclassimage = 'https://s3.amazonaws.com/unode1/assets/26872/HPzTNXojT0CG76mUBn9R_ARMBAR-MASTERCLASS.png'
      let competitionSeasonimage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fcomp-season-2022.1684374749.jpg'
      let insideAojimage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Finside-aoj.1681162453.jpg'
      let competition2021image = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2F2021-vertical.1681167239.jpg'
      let guardImage = 'https://s3.amazonaws.com/unode1/assets/26872/NQxKjspwQEWQXOTwiNbD_GPS-VERTICAL.png'
      let competition2020Image = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2F2020-vertical.1681167148.jpg'
      let oneononeImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fone-on-one.1681164641.jpg'
      let foundationalImage = 'https://s3.amazonaws.com/unode1/assets/26872/g3lqvrvTSFW6CP60JrSj_FOUNDATIONAL-JIU-JITSU.png'
      let xguardImage = 'https://s3.amazonaws.com/unode1/assets/26872/J6YO8Ql1RtCjmHZIlGtE_X-GUARD-MASTERCLASS.png'
      let xguardseminarImage = 'https://s3.amazonaws.com/unode1/assets/26872/Ehr0d8OVTYeVFaFDjJNa_X-GUARD-SEMINAR-LIVE-ON-AOJ.png'
      let longstepImage = 'https://s3.amazonaws.com/unode1/assets/26872/wHqPJ0dQQemcIPzSZzF2_LONGSTEP-MASTERCLASS-4x5.png'
      let rematchImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fthe-rematch.1681165212.jpg'        
      let panams2023Image = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2F2023-pan-am-championship.1681164814.jpg'
      let season2023Image = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fcomp-season-2023.1684374506.jpg'
      let buildingAOJ02Image = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fnew-building-aoj-02.1684116967.jpg'
      let gametheoryImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fgame-theory.1684210442.jpg'
      let backtakeImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fback-take-masterclass.1684211002.jpg'
      let finishingthepassImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Ffinishing-the-pass-vertical.1685242145.jpg'
      let lassospiderImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fpassing-lasso-spider-guard-5x7.1694102787.jpg'
      let tainansubImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fsubmission-series-tainan-dalpra.1702593670.jpg'      
      let golaymangaImage = 'https://s3.us-east-1.amazonaws.com/unode1/assets%2Fassets%2F26872%2Fgola-y-manga.1709222758.jpg'      
      let cards = Array.from(document.querySelectorAll('.card-image'))
      if (cards.length > 0) {
        cards.forEach((card) => {
          if (!card.classList.contains('touched')) {
            let URL = getPermalinkFromURL(card.href);
            let categoryGroup = card.closest('.category-group');
            let categoryTitle = categoryGroup.querySelector('.category-title');
            let categoryTitleText = categoryTitle.innerText;
            var cardWrap = card.closest('.swiper-slide');

            if(categoryTitleText == 'ON DEMAND' || categoryTitleText == 'ORIGINALS'){
              if(URL.includes('armbar-masterclass')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${programArmbarmasterclassimage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('2022-competition-season')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${competitionSeasonimage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('inside-aoj')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${insideAojimage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('2021-competition-season')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${competition2021image}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('guard-pass-system')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${guardImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('2020-competition-season')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${competition2020Image}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('one-on-one')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${oneononeImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('foundational-jiu-jitsu')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${foundationalImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('x-guard-masterclass-tainan-dalpra')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Armbar Masterclass" src="${xguardImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('x-guard-live-seminar')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="X Guard Live Seminar" src="${xguardseminarImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('longstep-masterclass-tainan-dalpra')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Longstep Masterclass" src="${longstepImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('the-rematch-dalpra-x-bahiense')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="The Rematch" src="${rematchImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
                }else if(URL.includes('2023-ibjjf-pan-am-championship')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="2023 IBJJF Pan Ams" src="${panams2023Image}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')
              }else if(URL.includes('2023-competition-season')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="2023 Competition Season" src="${season2023Image}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')           
              }else if(URL.includes('building-aoj-02')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Building AOJ 02" src="${buildingAOJ02Image}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')        
              }else if(URL.includes('on-demand-game-theory-tainan-dalpra-gui-mendes')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Game Theory" src="${gametheoryImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')          
              }else if(URL.includes('on-demand-back-take-masterclass-tainan-dalpra')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Back Take Masterclass" src="${backtakeImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')       
              }else if(URL.includes('on-demand-finishing-the-pass-gui-mendes')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Finishing the Pass" src="${finishingthepassImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')            
                }else if(URL.includes('on-demand-passing-the-lasso-and-spider-guard')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Passing the Lasso & Spider Guard" src="${lassospiderImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')   
              }else if(URL.includes('submission-series-2023-competition-season-tainan-dalpra')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Submission Series: 2023 Competition Season" src="${tainansubImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')           
              }else if(URL.includes('gola-y-manga-serie-en-espanol-de-pablo-lavaselli')){
                card.querySelector('img').remove("srcset")
                var imagecontent = card.querySelector('.image-content')
                imagecontent.querySelector('div').remove()
                imagecontent.insertAdjacentHTML('beforeend', `<img alt="Gola y Manga Serie de Pablo Lavaselli" src="${golaymangaImage}" class="b-image object-cover h-full top-0 left-0 relative">`)
                card.classList.add('image-updated')                                   
              }
            }

            if(categoryTitleText == 'ON DEMAND'){
              if(card.href.includes('/programs/on-demand-armbar-masterclass')){
                var link = '/orders/checkout?c=1505787';
              }else if(card.href.includes('/programs/on-demand-guard-pass-system')){
                var link = '/orders/checkout?c=1655184';
              }else if(card.href.includes('/programs/on-demand-x-guard-masterclass-tainan-dalpra')){
                var link = '/orders/checkout?c=1797130';
              }else if(card.href.includes('/programs/on-demand-foundational-jiu-jitsu')){
                var link = '/orders/checkout?c=1754414';
              }else if(card.href.includes('/programs/x-guard-live-seminar-tainan-dalpra')){
                var link = '/orders/checkout?c=1909580';
              }else if(card.href.includes('/programs/on-demand-longstep-masterclass-tainan-dalpra')){
                var link = '/orders/checkout?c=1926381';
             }else if(card.href.includes('/programs/on-demand-back-take-masterclass-tainan-dalpra')){
                var link = '/orders/checkout?c=2057258';
             }else if(card.href.includes('/programs/on-demand-game-theory-tainan-dalpra-gui-mendes')){
                var link = '/orders/checkout?c=2139226';
             }else if(card.href.includes('/programs/on-demand-finishing-the-pass-gui-mendes')){
                var link = '/orders/checkout?c=2097633';                
              }
              let ctaButtonPurchase = `<a href="${link}" class="purchase-link">(Purchase)</a>`;
              let ctaButtonPurchased = `<span class="purchase-link">(Purchased)</span>`;
              let newUrl = `/api/contents/${getPermalinkFromURL(card.href)}`;
              
              axios.get(newUrl).then(function (response) {
                let program = response.data;

                if(newUrl.includes('on-demand-foundational-jiu-jitsu') || newUrl.includes('on-demand-guard-pass-system')){
                  var price = '$99.99';
                }else if(newUrl.includes('x-guard-live-seminar')){
                  var price = '$24.99';
                }else if(newUrl.includes('on-demand-game-theory-tainan-dalpra-gui-mendes')){
                  var price = '$149.99';
                }else if(newUrl.includes('on-demand-finishing-the-pass-gui-mendes')){
                  var price = '$199.99';
                }else if(newUrl.includes('on-demand-longstep-masterclass-tainan-dalpra')){
                  var price = '$199.99';
                }else if(newUrl.includes('on-demand-back-take-masterclass-tainan-dalpra')){
                  var price = '$219.99';
                }else if(newUrl.includes('gola-y-manga-serie-en-espanol-de-pablo-lavaselli')){
                  var price = '$59.99';  
                }else{
                  var price = '$199.99';
                }

                var content = `<div class="card-cell-info"><p class="card-cell-author">${program.author.title}</p><p class="card-cell-price">${price}</p></div>`;
                cardWrap.insertAdjacentHTML('beforeend',content);

                var accessLink = `/api/contents/${getPermalinkFromURL(card.href)}/access`;
                axios.get(accessLink).then(function (response) {
                  let result = response.data
                
                  if(result.result){
                    $(cardWrap).find('.card-cell-price').append(ctaButtonPurchased);
                  }else{
                    $(cardWrap).find('.card-cell-price').append(ctaButtonPurchase);
                  }
                })

                cardWrap.classList.add('ondemand-card');
              })
            }else{
              let newUrl = `/api/contents/${getPermalinkFromURL(card.href)}`;
              axios.get(newUrl).then(function (response) {
                let program = response.data;

                if(program.author){
                  var content = `<div class="card-cell-info"><p class="card-cell-author">${program.author.title}</p></div>`;
                  cardWrap.insertAdjacentHTML('beforeend',content);
                }

                if(program.tags.includes('Free Video')){
                  var freeBadge = `<div class="badge flex justify-center items-center text-white content-card-badge content-free-badge"><span class="badge-item">FREE</span></div>`;
                  card.insertAdjacentHTML('beforeend',freeBadge);
                }
              })
            }
            card.classList.add('touched')
          }
        })
      }
    }

    let catalogBanner = document.querySelector('.catalog_hero_banner');
    if(location.href.includes('/catalog')){
      if(catalogBanner){
        catalogBanner.classList.remove('hidden');
      }
    }else{
      if(catalogBanner){
        catalogBanner.classList.add('hidden');
      }
    }

    setTimeout(() => catalogOndemandScript(), 300)
  }

  catalogOndemandScript()

  let programeScript = () => {
    if(location.href.includes('/programs/')){

      let newUrl = `/api/contents/${getPermalinkFromURL(location.href)}`;
      let programContent = document.querySelector('.cbt-program');
      if (programContent) {
        if(!programContent.classList.contains('touched')){
          axios.get(newUrl).then(function (response) {
            let program = response.data;

            if(program.content_type == 'collection'){
              programContent.classList.add('collection-program');
            }
          });
          programContent.classList.add('touched');
        }
      }
      

      if(location.href.includes('on-demand-armbar-masterclass') || location.href.includes('on-demand-guard-pass-system') || location.href.includes('on-demand-game-theory-tainan-dalpra-gui-mendes') || location.href.includes('on-demand-x-guard-masterclass-tainan-dalpra') || location.href.includes('on-demand-foundational-jiu-jitsu') || location.href.includes('/programs/x-guard-live-seminar-tainan-dalpra') || location.href.includes('/programs/on-demand-back-take-masterclass-tainan-dalpra') || location.href.includes('/programs/on-demand-longstep-masterclass-tainan-dalpra') || location.href.includes('/programs/guarda-x-curriculo-de-tainan-dalpra')){
          let ctaBars = document.querySelectorAll('.cbt-action-bar');
          let link = '#';
          if(location.href.includes('/programs/on-demand-armbar-masterclass')){
            link = '/orders/checkout?c=1505787';
          }else if(location.href.includes('/programs/on-demand-guard-pass-system')){
            link = '/orders/checkout?c=1655184';
          }else if(location.href.includes('/programs/on-demand-x-guard-masterclass-tainan-dalpra')){
            link = '/orders/checkout?c=1797130';
          }else if(location.href.includes('/programs/on-demand-foundational-jiu-jitsu')){
            link = '/orders/checkout?c=1754414';
          }else if(location.href.includes('/programs/x-guard-live-seminar-tainan-dalpra')){
            link = '/orders/checkout?c=1909580';
          }else if(location.href.includes('/programs/on-demand-longstep-masterclass-tainan-dalpra')){
            link = '/orders/checkout?c=1926381';
         }else if(location.href.includes('/programs/on-demand-back-take-masterclass-tainan-dalpra')){
            link = '/orders/checkout?c=2057258';
          }else if(location.href.includes('/programs/on-demand-game-theory-tainan-dalpra-gui-mendes')){
            link = '/orders/checkout?c=2139226';
          }else if(location.href.includes('/programs/guarda-x-curriculo-de-tainan-dalpra')){
            link = '/orders/customer_info?o=108114';
          }else if(location.href.includes('/programs/on-demand-finishing-the-pass-gui-mendes')){
            link = '/orders/customer_info?o=2097633';
          }
          let detectPurchase = false;
          let ctaButtonPurchase = `<a href="${link}" class="b-button box-border inline-flex items-center text-base font-medium cursor-pointer flex-grow">
          <svg class="icon-monitor mr-3" fill="#fff" height="18" width="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 682.666667H128V170.666667h768m0-85.333334H128c-47.36 0-85.333333 37.973333-85.333333 85.333334v512a85.333333 85.333333 0 0 0 85.333333 85.333333h298.666667v85.333333H341.333333v85.333334h341.333334v-85.333334h-85.333334v-85.333333h298.666667a85.333333 85.333333 0 0 0 85.333333-85.333333V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z" fill="" /></svg>
          <span class="button-title">Purchase</span></a>`;
          if(location.href.includes('/programs/guarda-x-curriculo-de-tainan-dalpra')){
            ctaButtonPurchase = `<a href="${link}" class="b-button box-border inline-flex items-center text-base font-medium cursor-pointer flex-grow">
            <svg class="icon-monitor mr-3" fill="#fff" height="18" width="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 682.666667H128V170.666667h768m0-85.333334H128c-47.36 0-85.333333 37.973333-85.333333 85.333334v512a85.333333 85.333333 0 0 0 85.333333 85.333333h298.666667v85.333333H341.333333v85.333334h341.333334v-85.333334h-85.333334v-85.333333h298.666667a85.333333 85.333333 0 0 0 85.333333-85.333333V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z" fill="" /></svg>
            <span class="button-title">Ganhar Acesso</span></a>`;
          }

          let ctaButtonPurchased = `<button type="button" class="custom-icon-box b-button box-border inline-flex items-center text-base leading-normal font-medium cursor-pointer transition duration-200 button color-base size-base variant-light rounded flex-grow">
          <svg class="icon-monitor" height="18" width="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 682.666667H128V170.666667h768m0-85.333334H128c-47.36 0-85.333333 37.973333-85.333333 85.333334v512a85.333333 85.333333 0 0 0 85.333333 85.333333h298.666667v85.333333H341.333333v85.333334h341.333334v-85.333334h-85.333334v-85.333333h298.666667a85.333333 85.333333 0 0 0 85.333333-85.333333V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z" fill="" /></svg>
          <span class="button-title">Purchased</span></button>`;
          if(ctaBars.length > 0){
            ctaBars.forEach((ctaBar) => {
              if(!ctaBar.classList.contains('touched')){
                let chapterItems = document.querySelectorAll('.chapter-thumbnails--card');
                let buttonAccess = document.querySelector('[data-test="button-access"]');
                console.log(buttonAccess);
                if(chapterItems.length > 0){
                  chapterItems.forEach((chapterItem) => {
                    let noAccess = chapterItem.querySelector('.chapter-thumbnails--lock');
                    if(noAccess){
                      detectPurchase = true;
                    }
                  })
                }

                if(buttonAccess){
                  detectPurchase = true;
                }
                
                let ctaBarwrap = ctaBar.querySelector('.flex-wrap');
                if(detectPurchase){
                  ctaBarwrap.insertAdjacentHTML('beforeend', ctaButtonPurchase);
                }else{
                  ctaBarwrap.insertAdjacentHTML('beforeend', ctaButtonPurchased);
                }
                ctaBar.classList.add('touched');
              }
            })
          }
      }
    }
    setTimeout(() => programeScript(), 300)
  }
  programeScript()


  $('.main-carousel').flickity({        
    // options
    cellAlign: 'left',
    contain: true,
    groupCells: true,
    freeScroll: false,
    wrapAround: true,
    groupCells: 1,
    // groupCells: '100%',
    //autoPlay: true,
    // autoPlay: 1500,
    pauseAutoPlayOnHover: false,
    initialIndex: 0,
    wrapAround: true,
    prevNextButtons: false,
    pageDots: true

  });

})

$(document).ready(function(){
  $('.js-images-hover-content-cell').hover(function(){
    var selectedBlock = $(this).attr('data-block');
    $('.image-hover-background-cell').removeClass('active');
    $(`.image-hover-background-cell[data-block="${selectedBlock}"]`).addClass('active');
    $('.js-images-hover-content-cell').removeClass('active');
    $(this).addClass('active');
  })

  if($(window).width() < 768){
    var $carousel = $('.images-hover-content-list').flickity({
      prevNextButtons: false,
      pageDots: false
    })

    $carousel.on( 'change.flickity', function( event, index ) {
      $('.image-hover-background-cell').removeClass('active');
      $(`.image-hover-background-cell[data-index="${index}"]`).addClass('active');
    });
  }

  $('.carousel__slides').flickity({
      wrapAround: true,
      pageDots: false
  });
})
document.addEventListener("DOMContentLoaded", (event) => {
  function programCollection(){
    let ctaBars = document.querySelectorAll('ds-button');

    if(ctaBars.length > 0 && location.href.includes('programs')){
      ctaBars.forEach((ctaBar) => {
        if(!ctaBar.classList.contains('touched')){
          let style = document.createElement("style");
          const shadow = ctaBar.shadowRoot;

          style.textContent = `
          .button {
            text-transform: uppercase;
            letter-spacing: 1px;
          }`;
          shadow.appendChild(style);
          ctaBar.classList.add('touched');
        }
      })
    }

    setTimeout(() => programCollection(), 300)
  }

  programCollection();
});