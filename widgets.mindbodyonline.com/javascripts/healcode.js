// NOTE: We only need IDs to be unique for customers who embed multiple widgets on the same page.
// They do not need to be unique across all widgets.
function generateRandomIdentifier() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function checkIfSandboxedInIframe(widgetElement) {
  const currentPathname = window.location.pathname;
  const expectedPathname = '/iframe/' + widgetElement.type() + '/' + widgetElement.widgetId();
  const atIframePath = currentPathname.includes(expectedPathname);
  return atIframePath
}

function getSandboxedIframeMarkup(widgetElement) {
  const iframeIdentifier = generateRandomIdentifier();
  const hcIframeId = 'hc-iframe-' + iframeIdentifier;

  // Note: We have to wait for resizer to be available. There is a potential race condition on iframe loading late
  // which requires us to wait using the `ensureResizerIsSet` method
  return `<div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.7/iframeResizer.min.js" type="text/javascript"></script>
      <style>iframe { width: 1px; min-width: 100%;} </style>
      <iframe id=${hcIframeId} src="https://widgets.mindbodyonline.com/iframe/${widgetElement.type()}/${widgetElement.widgetId()}" frameBorder="0"></iframe>
      <script type="text/javascript">
        // NOTE: We need to use var here (instead of let or const) to enable variable overriding when multiple widgets are on the same page
        var timeout = 500000;

        function ensureResizerIsSet(timeout) {
          let start = Date.now();
          return new Promise(waitForResizer);
          function waitForResizer(resolve, reject) {
            if (window.iFrameResize)
              resolve(window.iFrameResize);
            else if (timeout && (Date.now() - start) >= timeout)
              reject(new Error("timeout"));
            else
              setTimeout(waitForResizer.bind(this, resolve, reject), 30);
          }
        }
        
        ensureResizerIsSet(timeout).then(function(){
          // NOTE: iframe-resizer is smart enough to automatically deal with multiple iframes on the same page (as long as they have unique IDs),
          // without needing to explicitly pass in specific IDs
          iFrameResize();
        });
      </script>
    </div>
  `;
}

if(!window.hcLoadScript) {
  window.hcLoadScript = function(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if(script.addEventListener) {
      script.addEventListener('load', callback, false);
    }
    else if(script.readyState) {
      script.onreadystatechange = callback;
    }
    head.appendChild(script);
  };
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if(!window.HealcodeWidget) {
  window.HealcodeWidget = function(widgetProperties) {
    this.type = widgetProperties.type;
    this.name = widgetProperties.name;
    this.id = widgetProperties.id;
    this.optionsQuery = widgetProperties.options_query;
    this.deployURL = widgetProperties.deploy_url;
    this.containerID = widgetProperties.container_id;
    this.preview = widgetProperties.preview;
  };
}

if(!window.hcWidgetCollection) {
  window.hcWidgetCollection = [];
}

window.hcMobileCheck = function() {
  var windowWidth = (screen.width <= screen.height ? screen.width : screen.height);
  return windowWidth <= 460;
}

if(!window.healcodeInitialize) {
  window.healcodeInitialize = function(widgets) {
    var oldWidgetDeployments = widgets;

    function hcWidgetJsLoad() {

      var mobileFlag = window.hcMobileCheck();
      if(typeof mobileFlag !== 'boolean') mobileFlag = false;

      var customElementWidgets = document.querySelectorAll('healcode-widget');
      var customElementWidgetTypes = [];
      for (var i=0; i<customElementWidgets.length; i++) {
        customElementWidgetTypes.push(customElementWidgets[i].getAttribute('data-type'));
      }
      var totalWidgetCount = oldWidgetDeployments.length + customElementWidgets.length;

      function addCustomElementWidget(widgetElement) {
        customElementWidgets = document.querySelectorAll('healcode-widget');
        customElementWidgetTypes.push(widgetElement.getAttribute('data-type'));
        totalWidgetCount = oldWidgetDeployments.length + customElementWidgets.length;
      }

      function containsWidget(widgetType) {
        var oldDeploymentCheck = !oldWidgetDeployments.every(function(widget, index, array) {
          return(widget.name !== widgetType);
        });
        var customElementCheck = !customElementWidgetTypes.every(function(customElementType, index, array) {
          return(customElementType !== widgetType);
        });
        return (oldDeploymentCheck || customElementCheck);
      }

      const getDeployURL = (referenceFrame) => {
        (!/^(.+\.)?healcode\./i.test(referenceFrame.location.host) && /^https?:/i.test(referenceFrame.location.protocol)) ? referenceFrame.location.href : null;
      }

      const storeDeployURL = (widget) => {
        const currentDeployURL = widget.deployURL || getDeployURL(window);
        if (!currentDeployURL || !hcjq || widget.preview) return null;
        hcjq.ajax({
          url: 'https://widgets.mindbodyonline.com/widgets/widget/' + widget.id + '/store_deploy_url.json',
          data: { deploy_url: currentDeployURL, widget_type: widget.name },
          dataType: 'jsonp'
        });
      }

      function finishedPostWidgetScripts() {
        if(widgetCheck.healcodeLink()) {
          storeLinkDeployURL();
        }
      }

      function storeLinkDeployURL() {
        var deployURL = getDeployURL(window);
        if(!deployURL || !hcjq) return null;

        var linkTypesBySiteId = {};
        hcjq("healcode-widget[data-type$='-link']").each(function (index, element) {
          var siteId = hcjq(this).attr("data-site-id");
          var linkType = this.linkType();

          if (siteId !== undefined && siteId !== "") {
            if(linkTypesBySiteId[siteId] === undefined) {
              linkTypesBySiteId[siteId] = {'url': deployURL, 'link_types': []};
            }
            if(hcjq.inArray(linkType, linkTypesBySiteId[siteId]['link_types']) === -1) {
              linkTypesBySiteId[siteId]['link_types'].push(linkType);
            }
          }
        });

        // 
        hcjq.ajax({
          url: 'https://cart.mindbodyonline.com/link_deploys/store.json',
          data: {"link_deploys": linkTypesBySiteId},
          dataType: "jsonp"
        });
      };

      var widgetCheck = {
        schedule: function() { return containsWidget('schedules'); },
        appointment: function() { return containsWidget('appointments'); },
        enrollment: function() { return containsWidget('enrollments'); },
        registration: function() { return containsWidget('registrations'); },
        prospect:     function() { return containsWidget('prospects'); },
        classList:    function() { return containsWidget('class_lists'); },
        staffList:    function() { return containsWidget('staff_lists'); },
        healcodeLink: function() { return containsWidget('account-link') || containsWidget('cart-link') || containsWidget('pricing-link') || containsWidget("contract-link") || containsWidget("gift-card-link"); }
      };

      var widgetRenderURLs = oldWidgetDeployments.map(function(widget, index, array) {
        var widgetMobileFlag = (widget.optionsQuery ? "&mobile=" + mobileFlag : "?mobile=" + mobileFlag);
        return 'https://widgets.mindbodyonline.com/widgets/' + widget.name + '/' + widget.id + '.js' + widget.optionsQuery + widgetMobileFlag;
      });

      function preWidgetScripts() {
        return [{
          test: window.hcjq && window.hcjq.ui && window.hcjq.rails,
          nope: ['https://assets.healcode.com/assets/jquery-3.6.4.min-b6cd1a337b0b43239d6a58bd84a1098e5be03f7f79d3961d3898696f3f784213.js', 'https://assets.healcode.com/assets/jquery-migrate-3.4.1.min-b91ca1b5eab0841bfbf8aaba083a35f792b3ca8de350b1aba2f3d14afcd1b7e8.js', 'https://assets.healcode.com/assets/jquery-ui-1.13.2.widget-8ef9709b80f65d5c1eb7bef249bdca5800bc702857e1090f090f710738b9ac66.js', 'https://assets.healcode.com/assets/jquery_ujs-3cb4324aeb6486757d016d474f0f2ccc8fd684c35188a5d2fdddd8c5106313f0.js', 'https://assets.healcode.com/assets/widgets/jquery-ui/jquery-ui.widget-117d24707021b06add08c5c3ed31f033c75a1b84f199e056e3785888696c1e17.css', 'https://assets.healcode.com/assets/hcjq-4d05e9bbab0a5ec554c0ba6b12845c65e402700a0fe50dd29b9683d01f096a83.js']
        }, {
          test: !window.hcSessionFilter && (widgetCheck.schedule() || widgetCheck.enrollment()),
          yep: ['https://assets.healcode.com/assets/jquery-ui-datepicker-localization-073ecb400a31302845b0735e093db65771811ab4ea24bcfcc7842a8f8b812d06.js', 'https://assets.healcode.com/assets/filter_sessions-22f2fc2f2468babc8854b39178c10848329522d3abc49a19d741e318f99488b6.js']
        }, {
          test: !window.hcPignoseCalendar && (widgetCheck.enrollment() || widgetCheck.schedule()),
          yep: ['https://assets.healcode.com/assets/moment.hcjq-513e187e05143dbe64771dd553de166b7ca2f4b1e62363723471e2f0d75a247d.js', 'https://assets.healcode.com/assets/pignose.calendar.hcjq-6fee3c588b907e16ff78916fa427db536dcbb4f3d21d011bb00a2f83a612e55c.js', 'https://assets.healcode.com/assets/widgets/pignose.calendar.hcjq-a8a9160b4852572f4f8e5f65a90dd25f2f8d12fa2f4004ef136e032fd501974e.css']
        }, {
          test: !window.bwScheduleVersion1 && widgetCheck.schedule(),
          yep: ['https://assets.healcode.com/assets/widgets/schedule/version_1-9be68f3a9d30a533a8546c62258011b2e512287e19cadf9f35d3adf99fcdd938.js', 'https://assets.healcode.com/assets/widgets/schedule/load_markup-80e400255b99f836dfa7c8dd92e20431fd673d432ea47485b8442312433e142e.js', 'https://assets.healcode.com/assets/widgets/schedule/version_1-3ae7c127c0f712912d10b228dafcf05f2bcbe13fba974a6ecb0372679edbea32.css', 'https://assets.healcode.com/assets/widgets/schedule/filter-c24a27e81a6e99f7e57e00a82416171ab4aed54e1424cfaf20c75aca306ea7e0.js']
        }, {
          test: !window.bwFilterSessions && widgetCheck.schedule(),
          yep: 'https://assets.healcode.com/assets/widgets/schedule/filter_sessions_version_1-510d4906e4d50ec5b2a398700165736ae7dcb2f2fd8639167603e320bd048e6e.js'
        }, {
          test: !window.hcParsley && (widgetCheck.prospect() || widgetCheck.registration() || widgetCheck.appointment()),
          yep: ['https://assets.healcode.com/assets/parsley/i18n.hcjq-cf9da4b27bc04c4e0a230de2c9c2cdb46b54380ef86d32fc3904e5f0238143c2.js', 'https://assets.healcode.com/assets/parsley.hcjq-80bd620c3a844297d08764704a1a1d9314c26254504b083f1f448ca9b70f5e32.js', 'https://assets.healcode.com/assets/parsley-23d5020a05d33237c44b76f7bf4c0a83c979ccab8407b47b23e1c5e27a72199c.css']
        }, {
          test: !window.hcStateSelect && widgetCheck.registration(),
          yep: 'https://assets.healcode.com/assets/state_select-3c0d9b6e8ab403bbf080ea3b72e2cd47c0c69d23fe572002520a486bed286186.js'
        }, {
          test: !window.hcAppointmentFilterSessions && widgetCheck.appointment(),
          yep: 'https://assets.healcode.com/assets/filter_appt_sessions-dec4497f99e097d9ad4176a54ff0103f9080c15a0987c8de659fddd94fc96137.js'
        }, {
          test: !window.hcScheduleWidget && widgetCheck.schedule(),
          yep: 'https://assets.healcode.com/assets/schedule-c992564154258a09a50ae972b2f651c04bdc2efb0570f6fd5dab4a6f6270e3c0.js'
        }, {
          test: !window.hcEnrollmentWidget && widgetCheck.enrollment(),
          yep: 'https://assets.healcode.com/assets/enrollment-0b657d903740672b8cf24773bdc127010dada6ace80b56ed6357dc94b70e24c1.js'
        }, {
          test: !window.hcClassStaffListWidget && (widgetCheck.staffList() || widgetCheck.classList()),
          yep: 'https://assets.healcode.com/assets/staff_class_lists-63cdda3de8e51f9780eaf62fd162dc6bfe71df530a544b528db54cef2291ce90.js',
        }, {
          test: !window.hcAppointmentWidget && widgetCheck.appointment(),
          yep: ['https://assets.healcode.com/assets/appointment-1b9db8961ba91a5740b06f9f890bd7419781e8523836cc0ce08735673803d709.js', 'https://assets.healcode.com/assets/jquery-ui-datepicker-localization-073ecb400a31302845b0735e093db65771811ab4ea24bcfcc7842a8f8b812d06.js', 'https://assets.healcode.com/assets/jquery.weekpicker-ca787193e63197762268046404095f0e296776f90f33478d1a9d4cc3fcb9f188.js'],
          callback: function(url, result, key) {
            window.hcAppointmentWidget = true;
          }
        }, {
          test: !window.hcRegistrationWidget && widgetCheck.registration(),
          yep: ['https://assets.healcode.com/assets/registration-d02d3c5237ef888e74282520366099ba8ed7afb27bac1cf2bec3a75642dab087.js'],
          callback: function(url, result, key) {
            window.hcRegistrationWidget = true;
          }
        }, {
          test: !window.hcProspectWidget && widgetCheck.prospect(),
          yep: ['https://assets.healcode.com/assets/prospect-69c3b91acf375846d87175b7263ba78ff893b123cd4f85c84acad1403d4262a6.js'],
          callback: function(url, result, key) {
            window.hcProspectWidget = true;
          }
        }, {
          test: !window.hcWidgetJs && (widgetCheck.schedule() || widgetCheck.appointment() || widgetCheck.enrollment() || widgetCheck.classList() || widgetCheck.staffList() || widgetCheck.healcodeLink()),
          yep: ['https://assets.healcode.com/assets/modal-4d87d34d3dbc30d6526d900b96523f52004e20f0ca3bc2cde39f46c0d8c18592.js', 'https://assets.healcode.com/assets/modal-17092803252aa63aa0e8982a3b053a8e89b11bcc0a0c17da515f81b2943ad2cf.css', 'https://assets.healcode.com/assets/widget-50790189368bafaae631bf59b99a261c1f74fb9060347d4db243b82488b12ffc.js'],
          callback: function(url, result, key) {
            window.hcWidgetJs = true;
          }
        }];
      }

      function postWidgetScripts() {
        if(!window.postWidgetScripts) {
          finishedPostWidgetScripts();
          window.postWidgetScripts = true;
        }

        return [];
      }

      function registerHealcodeWidgetCustomElement($, loadCounter) {

        var validWidgetTypes = ['schedules', 'enrollments', 'staff_lists', 'class_lists', 'prospects', 'registrations', 'appointments'];

        var $loadingText = $('<div class="hc-ajax-loading-text"><img alt="loading" src="https://assets.healcode.com/assets/icons/ajax-loader-01660019227d7e88b38c8ff7ec68f7d110725dc8ca92db6b2dd2892dfc519d4c.gif" /></div>');
        $loadingText.css({
          fontSize: '3em',
          margin: '10% 0',
          padding: '25px',
          textAlign: 'center',
          borderRadius: '4px'
        });

        function loadingErrorMarkup() {
          var errorMessage = arguments[0] || 'Unable to load.<br>Please try again later.';

          var $errorMarkup = $('<div></div>')
            .addClass('hc-ajax-loading-text')
            .css({
              width: '12em',
              fontSize: '1em',
              margin: '1em 40%',
              padding: '1em',
              textAlign: 'center',
              border: 'solid black 1px'
            });

          var $refreshLink;

          if (!/widget has been deactivated/i.test(errorMessage)) {
            $refreshLink = $('<a href=""></a>')
              .text('Reload')
              .css({
                border: 'solid black 1px',
                fontSize: '0.8em',
                textAlign: 'center',
                verticalAlign: 'middle',
                display: 'inline-block',
                textDecoration: 'none',
                textTransform: 'uppercase',
                margin: '1em 0 0 0',
                padding: '0.2em 0.5em',
                lineHeight: '1.5',
                '-webkit-border-radius': '0.25em',
                '-moz-border-radius': '0.25em',
                '-o-border-radius': '0.25em',
                borderRadius: '0.25em'
              })
              .on({
                click: function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  $(this).closest('healcode-widget')[0].getAndInjectWidgetContent();
                }
              });
          }

          $errorMarkup.append('<div>' + errorMessage + '</div>', $refreshLink);

          return $errorMarkup;
        }

        function createLink(containerElement, linkType, linkLoadCounter) {
          var itemID = containerElement.getAttribute('data-item-id') ||
            containerElement.getAttribute('data-service-id') ||
            containerElement.getAttribute('data-contract-id');

          var link = {
            linkClass: containerElement.getAttribute('data-link-class') || '',
            title: linkType,
            innerHTML: containerElement.getAttribute('data-inner-html').replace(/"/g, "'"),
            siteID: containerElement.getAttribute('data-site-id'),
            siteMBOID: containerElement.getAttribute('data-mb-site-id'),
            identitySite: '',
            typeName: containerElement.getAttribute('data-type'),
            dataURL: '',
            itemID: itemID,
            loadCounter: linkLoadCounter
          };

          apiPredicate('https://widgets.mindbodyonline.com/sites/' + link.siteID + '/identity_state.json', function(data) {
            link.identitySite = data['identityEnabled'];
            link.dataURL = 'https://cart.mindbodyonline.com/sites/' + link.siteID + '/';
            link.dataURL += (linkType === 'account' ? 'client' : 'cart');

            linkTypeJumpTable = {
              "contract": createContractLink,
              "gift-card": createGiftCardLink,
              "pricing": createPricingLink
            };

            function installer(linkHTML) {
              $(containerElement).html(linkHTML).promise().done(function () {
                link.loadCounter.increment();
              });
            }

            var specifier = linkTypeJumpTable[linkType] || createServiceLink;

            specifier(link, installer);
          });
        }

        function apiPredicate(uri, kontinue) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", uri);
          xhr.onload = function() {
            kontinue( JSON.parse(xhr.responseText) );
          }
          xhr.send();
        }

        function createContractLink(link, installer) {
          link.title = link.itemID;
          link.dataURL += '/add_contract?mbo_item_id=' + link.itemID;
          var linkHTML = '<a href="" class="healcode-link ' + link.linkClass + '" data-url="' + link.dataURL + '" data-widget-name="' + link.typeName + '" data-mbo-site-id="' + link.siteMBOID + '" rev="iframe" title="' + link.title + '" data-hc-open-modal="modal-iframe" data-bw-identity-site="' + link.identitySite + '">' + link.innerHTML + '</a>';

          installer(linkHTML);
        }

        function createGiftCardLink(link, installer) {
          apiPredicate('https://cart.mindbodyonline.com/links/sell_giftcard_with_cart/' + link.siteID + '/' + link.itemID, function (data) {
            var linkHTML = '';

            if (data.cart_enabled) {
              link.dataURL += '/gift_cards/add?mbo_id=' + link.itemID;
              linkHTML = '<a href="" class="healcode-link ' + link.linkClass + '" data-url="' + link.dataURL + '" data-widget-name="' + link.typeName + '" data-mbo-site-id="' + link.siteMBOID + '" rev="iframe" title="' + link.title + '" data-hc-open-modal="modal-iframe" data-bw-identity-site="' + link.identitySite + '">' + link.innerHTML + '</a>';
            }
            else {
              link.dataURL = 'https://clients.mindbodyonline.com/classic/ws?studioid=' + link.siteMBOID + '&stype=42&giftcardid=' + link.itemID;
              var linkHTML = '<a href="' + link.dataURL + '" class="' + link.linkClass + '" title="' + link.title + '" target="_blank" rel="noopener noreferrer">' + link.innerHTML + '</a>';
            }

            installer(linkHTML);
          });
        }

        function createPricingLink(link, installer) {
          link.title    = link.itemID;
          link.dataURL += '/add_service?mbo_item_id=' + link.itemID;
          createServiceLink(link, installer);
        }

        function createServiceLink(link, installer) {
          var linkHTML = '<a href="" class="healcode-link ' + link.linkClass + '" data-url="' + link.dataURL + '" data-widget-name="' + link.typeName + '" data-mbo-site-id="' + link.siteMBOID + '" rev="iframe" title="' + link.title + '" data-hc-open-modal="modal-iframe" data-bw-identity-site="' + link.identitySite + '">' + link.innerHTML + '</a>';
          installer(linkHTML);
        }

        function UrlEncodeObject(element, key, list) {
          var list = list || [];

          if (typeof(element) == 'object') {
            for (var item in element) {
              UrlEncodeObject(element[item], key ? key + '[' + item + ']' : item, list);
            }
          }
          else {
            list.push(key + '=' + encodeURIComponent(element));
          }

          return list.join('&');
        }

        function createWidget(widgetElement, widgetLoadCounter) {
          var mobileFlag = window.hcMobileCheck();
          var widgetType = $(widgetElement).data('type');
          var httpMethod = "GET";
          var xhr = new XMLHttpRequest();

          if(typeof mobileFlag !== 'boolean') mobileFlag = false;

          var httpParams = {
            mobile: mobileFlag,
            preview: widgetElement.isPreview(),
            version: widgetElement.version()
          };

          $(widgetElement).html($loadingText);
          if(checkIfSandboxedInIframe(widgetElement)) {
            let script=document.createElement('script');
            script.src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.7/iframeResizer.contentWindow.js";
            $("body").append(script);
          }

          xhr.open(httpMethod, widgetElement.requestURL() + '?' + UrlEncodeObject( httpParams ) );

          xhr.onload = function() {
            if (xhr.status === 200) {
              var data = null;

              try { // just in case...
                data = JSON.parse(xhr.responseText);
              }
              catch (e) {
                // data should remain null at this point
                var errMsg = "Error parsing JSON: " + xhr.responseText;
                data = { errors: [ errMsg ] };
              }

              if (data.errors) {
                var errors = data.errors;
                console.log('AJAX request failed - ' + errors.join(', '));
                $(widgetElement).html(loadingErrorMarkup(errors.join('<br>')));
              } else if (data.use_iframe && !widgetElement.isPreview() && !checkIfSandboxedInIframe(widgetElement)) {
                $(widgetElement).html(getSandboxedIframeMarkup(widgetElement))
              } else {
                $(widgetElement).html(data.contents).promise().done(function() {
                  widgetLoadCounter.increment();
                  // We need to update the CSRF Token for registrations and prospect forms
                  // Due to the forms being loaded in via Ajax the tokens do not match
                  updateCSRFToken(widgetElement);
                  // TODO: fix this when we fix the masked ID in NSW issue
                  if (widgetElement.querySelectorAll('.bw-widget').length){
                    var maskedID = $(widgetElement).data('widget-id').toString();
                    var widgetID = maskedID.substring(2, maskedID.length - 4);
                  } else {
                    var widgetID = $(widgetElement).data('widget-id');
                  }
                  $(document).trigger('widget:loaded', [widgetID, widgetType]);
                });
              }
            }
            else if (xhr.status !== 200) {
              console.error('AJAX request failed - ' + xhr.status);
              $(widgetElement).html(loadingErrorMarkup());
            }
          };

          xhr.send();
        }

        function updateCSRFToken(widgetElement) {
          // We only want to do this on registrations and prospects
          if ((widgetCheck.registration() || widgetCheck.prospect()) && $('meta[name=csrf-token]').length > 0) {
            const originalCSRFToken = $('meta[name=csrf-token]').attr('content');
            $('input[name=authenticity_token]', widgetElement).val(originalCSRFToken);
          }
        }

        function updateLinkInnerHTML(widgetElement, newText) {
          var formattedText = newText.replace(/"/g, "'");
          $('a', widgetElement).html(formattedText);
        }

        function updateLinkClass(widgetElement, newClass) {
          var formattedClass = newClass.replace(/"/g, "'");
          $('a', widgetElement).attr('class', newClass);
        }

        var healcodeWidget = Object.create(HTMLElement.prototype);

        healcodeWidget.createdCallback = function() {
          if (window.hcPreviewCreatedAlready) {
            // 
            // 
            // 
            // 
            // 
            return null
          } else if (this.isPreview()) {
            window.hcPreviewCreatedAlready = true;
          }

          if(!this.isLink()) {
            if(validWidgetTypes.lastIndexOf(this.type()) === -1) {
              console.log('Invalid widget type - ' + this.type());
              return null
            }
            storeDeployURL(this.convertToHealcodeWidgetObject());
          }
          if(window.hcInitialized) {
            addCustomElementWidget(this);
            window.hcYepnope(preWidgetScripts().concat({
              test: true,
              complete: this.getAndInjectWidgetContent.bind(this)
            }).concat(postWidgetScripts()));
          } else {
            this.getAndInjectWidgetContent();
          }
        };

        healcodeWidget.attachedCallback = function() {
          if(!this.isLink()) window.hcWidgetCollection.push(this.convertToHealcodeWidgetObject());
        };

        healcodeWidget.attributeChangedCallback = function(attrName, oldVal, newVal) {
          if(this.isLink()) {
            if(attrName === 'data-inner-html') {
              updateLinkInnerHTML(this, newVal);
            } else if(attrName === 'data-link-class') {
              updateLinkClass(this, newVal);
            }
          }
        };

        healcodeWidget.getAndInjectWidgetContent = function() {
          if(this.isLink()) {
            createLink(this, this.linkType(), loadCounter);
          } else {
            createWidget(this, loadCounter);
          }
        };

        healcodeWidget.convertToHealcodeWidgetObject = function() {
          return new HealcodeWidget({
            type: this.partner(),
            name: this.type(),
            id: this.widgetId(),
            preview: this.isPreview()
          });
        };

        healcodeWidget.type = function() { return this.getAttribute('data-type'); };
        healcodeWidget.isLink = function() { return this.type().match(/(.*)-link$/i); };
        healcodeWidget.linkType = function() {
          var isLink = this.isLink();
          if(isLink) {
            return isLink[1];
          } else {
            return null;
          }
        };
        healcodeWidget.partner = function() { return this.getAttribute('data-widget-partner'); };
        healcodeWidget.widgetId = function() { return this.getAttribute('data-widget-id'); };
        healcodeWidget.isPreview = function() { return this.getAttribute('data-preview'); };
        healcodeWidget.version = function() { return this.getAttribute('data-widget-version'); };
        healcodeWidget.requestURL = function() {
          return 'https://widgets.mindbodyonline.com/widgets/' + this.type() + '/' + this.widgetId() + '.json';
        };

        document.registerElement('healcode-widget', { prototype: healcodeWidget });
      }

      function documentReadyWidgetLoad() {
        oldWidgetDeployments.forEach(storeDeployURL);

        var widgetLoadCounter = {
          count: 0,
          increment: function() {
            this.count = this.count + 1;
            return this.count;
          },
          decrement: function() {
            this.count = this.count - 1;
            return this.count;
          }
        };

        registerHealcodeWidgetCustomElement(hcjq, widgetLoadCounter);

        widgetRenderURLs.forEach(function(renderURL, index, array) {
          window.hcYepnope.injectJs(renderURL, function() {
            widgetLoadCounter.increment();
          });
        });

        var delayScriptLoading = function(){
          if(widgetLoadCounter.count >= totalWidgetCount) {
            window.hcInitialized = true;
            window.hcYepnope(postWidgetScripts());
            return null;
          } else {
            setTimeout(delayScriptLoading, 100);
          }
        };

        delayScriptLoading();
      }

      window.hcYepnope(preWidgetScripts().concat({
        load: 'https://assets.healcode.com/assets/application-f5eb887b14d68feca1db7a2df3a5ad8f3cfa3c855ae6488506912bd36c9d578f.js',
        complete: documentReadyWidgetLoad
      }));
    }

    window.hcLoadScript('https://assets.healcode.com/assets/x-tag-components-ffa3f37e7cd90471c3d18c4ced28b725242b8d846985072daccdc3112a837e4d.js', function() {});

    if(window.hcYepnope) {
      hcWidgetJsLoad();
    } else {
      window.hcLoadScript('https://assets.healcode.com/assets/healcode.yepnope-bf9a5015a4b5ed3fb7708251bda2495d632e25a38367b5a03c8b6d1ab2e7e0a9.js', hcWidgetJsLoad);
    }
  };

  var hcOnDocumentReady = function(f){/in/.test(document.readyState)?setTimeout('hcOnDocumentReady('+f+')',9):f()};

  hcOnDocumentReady(function() {
    window.healcodeInitialize(window.hcWidgetCollection); // on DOM ready, fire off initializer
  });
}
