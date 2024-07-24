
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.baseline.en.16709949eb98964c069b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/394.baseline.en.48b8d9525a0c052e86f3.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/505.baseline.en.435864b344d42e62a4d0.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/891.baseline.en.a95a4f4f14965c819a76.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.fc347866c564da010df3.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/977.baseline.en.ced19ebca9f312cb8c0c.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/96.baseline.en.a51d92a9365f28b84b4a.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/554.baseline.en.5697083f652c24d1b980.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/307.baseline.en.2db905cbc87f7ff42aa6.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.baseline.en.ef88e07eac115c0f2558.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/394.baseline.en.8bf9736d9683f46f1dbb.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.77632396276cc0f709e7.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/268.baseline.en.0290b2bc7c2eca7c7c5e.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0554/1206/4337/files/ARTOFJIUJITSU_x320.png?v=1643063557"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  