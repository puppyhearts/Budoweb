(function () {
  var scriptName = "bowtie_widget.js";
  var allScripts = document.getElementsByTagName('script');
  var targetScripts = [];
  for (var i in allScripts) {
    var name = allScripts[i].src;
    if(name && name.indexOf(scriptName) > 0)
      targetScripts.push(allScripts[i]);
  }

  function loadScript(src, onLoad) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src", src);
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          onLoad();
        }
      };
    } else {
      script_tag.onload = onLoad;
    }
    (document.documentElement).appendChild(script_tag);
  }

  function loadCss(href) {
    var link_tag = document.createElement('link');
    link_tag.setAttribute("type", "text/css");
    link_tag.setAttribute("rel", "stylesheet");
    link_tag.setAttribute("href", href);
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(link_tag);
  }

  function ignoreError() {
    return true
  }

  function hasClass(el,cls) {
    return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  }

  function main() {
    // DOM is loaded and ready
    console.log('Loading Bowtie...');

    var jsonp_url = "https://messenger.mindbodyonline.com/widget?callback=?";
    JSONP.get(jsonp_url, {}, function(data) {
      document.getElementById('bowtie-widget-container').innerHTML = data.html;
    });

    // add webchat css links
    var css = ["https://messenger.mindbodyonline.com/static/companies/stylus/webchat.css",
      "https://messenger.mindbodyonline.com/static/common/css/core/animate.css",
      "https://messenger.mindbodyonline.com/static/common/css/tippy.css",
      "https://messenger.mindbodyonline.com/static/common/fonts/Akkurat_Web/stylesheet.css",
      "https://messenger.mindbodyonline.com/static/common/fonts/graphik_web/stylesheet.css",
      "https://messenger.mindbodyonline.com/static/common/fonts/Averta/stylesheet.css",
      "https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css",
      "https://fonts.googleapis.com/icon?family=Material+Icons",
      "https://cdn.materialdesignicons.com/3.0.39/css/materialdesignicons.min.css"];
    for (var j = 0; j < css.length; j++){
      loadCss(css[j]);
    }

    // append required javascript
    var scripts = [
      "https://messenger.mindbodyonline.com/static/companies/js/webchat/app.bundle.js",
      "https://js.squareup.com/v2/paymentform"
    ];
    var loader = setInterval(function(){
        // looks for warmup here to account for Wix
       if ( !hasClass(document.body, "warmup") ){
         for (var i = 0; i < scripts.length; i++){
            loadScript(scripts[i], function(i) {});
         }
         clearInterval(loader);
       }
    }, 500)
  }

  // DOM is loaded and ready
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        // add marker for widget container to body
        document.body.insertAdjacentHTML('beforeend', "<div id='bowtie-widget-container'></div>");
        main();
    }
  }, 10);

})();

var JSONP = (function(){
  var counter = 0, head, config = {};
  function load(url, pfnError) {
    var script = document.createElement('script'),
      done = false;
    script.src = url;
    script.async = true;

    var errorHandler = pfnError || config.error;
    if ( typeof errorHandler === 'function' ) {
      script.onerror = function(ex){
        errorHandler({url: url, event: ex});
      };
    }

    script.onload = script.onreadystatechange = function() {
      if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if ( script && script.parentNode ) {
          script.parentNode.removeChild( script );
        }
      }
    };

    if ( !head ) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild( script );
  }
  function encode(str) {
    return encodeURIComponent(str);
  }
  function jsonp(url, params, callback, callbackName) {
    var query = (url||'').indexOf('?') === -1 ? '?' : '&', key;

    callbackName = (callbackName||config['callbackName']||'callback');
    var uniqueName = callbackName + "_json" + (++counter);

    params = params || {};
    for ( key in params ) {
      if ( params.hasOwnProperty(key) ) {
        query += encode(key) + "=" + encode(params[key]) + "&";
      }
    }

    window[ uniqueName ] = function(data){
      callback(data);
      try {
        delete window[ uniqueName ];
      } catch (e) {}
      window[ uniqueName ] = null;
    };

    load(url + query + callbackName + '=' + uniqueName);
    return uniqueName;
  }
  function setDefaults(obj){
    config = obj;
  }
  return {
    get:jsonp,
    init:setDefaults
  };
}());