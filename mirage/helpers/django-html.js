var HTML = `<html>
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>
        Django Test Page - The Leonard Lopate Show - WNYC
      </title>
      <meta name="keywords" content="npr, new york, WNYC, arts, culture, news, public, radio" />
      <meta property="og:title" content="Django Test Page" />
        <meta property="og:type" content="video.episode" />
        <meta property="og:video" content="http://dev.wnyc.net:4444/media/audioplayer/facebook_embed.swf?file=http%3A%2F%2Fdev.wnyc.net%3A4444%2Faudio%2Fxspf%2F623103%2F&amp;autostart=true" />
        <meta property="og:video:type" content="application/x-shockwave-flash" />
        <meta property="og:video:width" content="200" />
        <meta property="og:video:height" content="29" />
      <meta property="og:image" content="http://www.wnyc.org/i/1200/627/l/80/1/diane.jpg" />
    <meta property="og:url" content="http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/?utm_source=sharedUrl&amp;utm_medium=metatag&amp;utm_campaign=sharedUrl" />
    <meta property="og:site_name" content="WNYC" />
    <meta property="fb:app_id" content="" />
    <meta property="og:description" content="Diane Rehm discusses her memoir &quot;On My Own,&quot; about her husband&rsquo;s battle with Parkinson&rsquo;s disease life without him after 54 years of marriage.&nbsp;" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="http://www.wnyc.org/i/1200/627/l/80/1/diane.jpg" />
    <meta name="twitter:site" content="@WNYC">
    <meta name="twitter:app:id:iphone" content="470219771">
    <meta name="twitter:app:id:googleplay" content="org.wnyc.android">
    <meta name="description" content="Diane Rehm discusses her memoir &quot;On My Own,&quot; about her husband&rsquo;s battle with Parkinson&rsquo;s disease life without him after 54 ..." />

    <!-- Google custom search stuff -->
      <meta name="show" content="lopate" />
      <meta name="is_article" content="False" />
      <meta name="has_audio" content="True" />
      <!--
      <PageMap>
        <DataObject type="date">
          <Attribute name="display" value="May 30, 2016"/>
          <Attribute name="sort" value="20160530"/>
        </DataObject>
          <DataObject type="tag">
            <Attribute name="id">books</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">diane_rehm</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">life</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">marriage</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">npr</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">parkinsons_disease</Attribute>
          </DataObject>
          <DataObject type="tag">
            <Attribute name="id">right_to_die</Attribute>
          </DataObject>
          <DataObject type="person">
            <Attribute name="id">diane-rehm</Attribute>
          </DataObject>
      </PageMap>
      -->
      <meta name="apple-itunes-app" content="app-id=470219771">
      <link rel="shortcut icon" href="/media/img/favicon_wnyc.ico" />
      <link rel="alternate" type="application/rss+xml" title="All WNYC Stories (RSS)" href="/feeds/all/"  />
      <link rel="alternate" type="application/atom+xml" title="All WNYC Stories (Atom)" href="/atomfeeds/all/"  />
      <link rel="canonical" href="http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/" />

  <link rel="alternate"
        type="application/rss+xml"
        title="The Leonard Lopate Show Feed (RSS)"
        href="/feeds/shows/lopate"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="The Leonard Lopate Show Feed (Atom)"
        href="/atomfeeds/shows/lopate"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="books Feed (RSS)"
        href="/feeds/tags/books"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="books Feed (Atom)"
        href="/atomfeeds/tags/books"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="diane rehm Feed (RSS)"
        href="/feeds/tags/diane_rehm"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="diane rehm Feed (Atom)"
        href="/atomfeeds/tags/diane_rehm"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="life Feed (RSS)"
        href="/feeds/tags/life"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="life Feed (Atom)"
        href="/atomfeeds/tags/life"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="marriage Feed (RSS)"
        href="/feeds/tags/marriage"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="marriage Feed (Atom)"
        href="/atomfeeds/tags/marriage"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="npr Feed (RSS)"
        href="/feeds/tags/npr"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="npr Feed (Atom)"
        href="/atomfeeds/tags/npr"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="parkinsons disease Feed (RSS)"
        href="/feeds/tags/parkinsons_disease"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="parkinsons disease Feed (Atom)"
        href="/atomfeeds/tags/parkinsons_disease"/>
  <link rel="alternate"
        type="application/rss+xml"
        title="right to die Feed (RSS)"
        href="/feeds/tags/right_to_die"/>
  <link rel="alternate"
        type="application/atom+xml"
        title="right to die Feed (Atom)"
        href="/atomfeeds/tags/right_to_die"/>

          <link rel="stylesheet" href="http://localhost:4200/assets/vendor.css">
          <link rel="stylesheet" href="http://localhost:4200/assets/overhaul.css">

      <link rel="stylesheet" href="/media/css/enlarge.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/screen_wnyc_responsive_header_base.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/screen_wnyc_responsive_navigation_base.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/screen_wnyc_responsive_header_medium.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/screen_wnyc_responsive_navigation_medium.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/footer_wnyc.css" /><link rel="stylesheet" type="text/css" media="all" href="/media/css/stream_launch_widget.css" />

    <link rel="stylesheet" href="/media/webfonts/fontawesome/css/font-awesome.min.css?v=4.1.0" type="text/css">


  <script type="text/javascript">
    this.wnyc = this.wnyc || {};

    wnyc.current_item = {"item_type": "segment", "authors": [], "tags": ["books", "diane_rehm", "life", "marriage", "npr", "parkinsons_disease", "right_to_die"], "show_title": "The Leonard Lopate Show", "show": "lopate", "title": "Django Test Page", "published": true, "item_type_id": 24, "id": "623103", "channel": ""}

  </script>


      <script type="text/javascript">
        window.SM2_OPTIONS = {
          url: '/media/swf/soundmanager2_v297a-20140901',
          //flashVersion: 9,
          //useFlashBlock: false,
          //useHTML5Audio: false,
          //preferFlash: true,
          //allowpolling: true,
          //debugMode: false
        };
      </script>

      <script src="http://localhost:4200/assets/vendor.js"></script>
      <script src="http://localhost:4200/assets/overhaul.js"></script>
      <script type="text/javascript">
        this.wnyc = this.wnyc || {};
        this.wnyc.noop = function() {};
        this.wnyc.debug = true;
        this.wnyc.serverTimezoneOffset = -14400000;
        this.wnyc.loadtime = (new Date()).getTime();
        this.wnyc.api_url = '';
        this.wnyc.login_root = 'http://dev.wnyc.net:4444';
        this.wnyc.player_root = 'http://dev.wnyc.net:4444';
        this.wnyc.etag_server = '/api/v1/browser_id/';
        this.wnyc.player_path = '/radio';
        this.wnyc.default_site_root = 'http://www.wnyc.org';
        this.wnyc.SINGLE_SIGN_ON = false;
        this.wnyc.IS_ACCOUNT_SITE = false;
        this.wnyc.STATIC_URL = '/media/';
        this.wnyc.MEDIA_URL = '//dev.wnyc.net:4444/media/';
        this.wnyc.sitekey = 'WNYC';
        this.wnyc.site_display_name = 'WNYC';
        this.wnyc.srcWhiteList = ['http://dev.wnyc.net:4444', 'https://dev.wnyc.net:4444', 'http://127.0.0.1:8000'];
      </script>

      <script type="text/javascript">
          function embed_video() {
              if ( !wnyc.deferredJw ) wnyc.deferredJw = [];

              var args = arguments;
              wnyc.deferredJw.push(function() {
                  wnyc.ns('jwplayer.init').apply(null, args)
              })
          }

          function loadSurveyResults() {
              if ( !wnyc.deferredLoadSurveyResults ) wnyc.deferredLoadSurveyResults = [];

              var args = arguments;
              wnyc.deferredLoadSurveyResults.push(function() {
                  wnyc.loadSurveyResults.apply(this, args)
              })
          }

          function loadSurvey() {
              if ( !wnyc.deferredLoadSurvey ) wnyc.deferredLoadSurvey = [];

              var args = arguments;
              wnyc.deferredLoadSurvey.push(function() {
                  wnyc.loadSurvey.apply(this, args)
              })
          }

          wnyc.runDeferred = function(deferredArray) {
              deferredArray.forEach(function(cb) { cb() })
          }
      </script>

      <script type="text/javascript" src="/media/js/overhaul/story/feature_tests.js?_=0.834392306695"></script>

  <script type="text/javascript" class="google_ads_boilerplate">
    window.googletag      = window.googletag || {};
    window.googletag.cmd  = window.googletag.cmd || [];
    window.wnyc.ads       = window.wnyc.ads || {};
  </script>

  </head>
  <body>
      <div id="navigation-menu" class="promoted-layer animate-transforms js-track-links" data-category="WNYC Menu">
          <div id="subnavigation-menu" class="animate-transforms">
              <button class="close-button fa fa-arrow-left js-manipulate-element"
                  data-targetElement="html"
                  data-classOn="navigation-open subnavigation-open"
                  data-classOff="navigation-open"></button>

              <ul id="subnavigation-items"></ul>
          </div>
          <!-- #subnavigation-menu -->

          <div id="navigation-items-wrapper" class="promoted-layer">
              <button class="close-button fa fa-times js-manipulate-element"
                  data-targetElement="html"
                  data-classOn="navigation-open"
                  data-classOff=""></button>

              <ul id="navigation-items">
                  <li><a href="/">WNYC Home</a></li>
                  <li><a href="#" class="js-launch-stream">Listen</a></li>
                  <li><a href="/search/" class="js-launch-search">Search</a></li>
                  <li class="has-subnav">
                      <a href="#" class="js-toggle-menu-v2 js-get-json-linkroll"
                          data-toggleClass="shows navigation-open subnavigation-open"
                          data-toggleClassTarget="html"
                          data-stayOpen="True"
                          data-linkrollSlug="wnyc-shows-list">Shows<i class="fa fa-caret-right"></i>
                      </a>
                  </li>
                  <li class="has-subnav">
                      <a href="#" class="js-toggle-menu-v2 js-get-json-linkroll"
                          data-toggleClass="topics navigation-open subnavigation-open"
                          data-toggleClassTarget="html"
                          data-stayOpen="True"
                          data-linkrollSlug="wnyc-topics-list">Topics<i class="fa fa-caret-right"></i>
                      </a>
                  </li>
                  <li class="has-subnav secondary two-line-title">
                      <a href="#" class="js-toggle-menu-v2 js-get-json-linkroll"
                           data-toggleClass="more navigation-open subnavigation-open"
                           data-toggleClassTarget="html"
                           data-stayOpen="True"
                           data-linkrollSlug="wnyc-more-list">
                              Schedule,<br />
                              Events &amp; More<i class="fa fa-caret-right"></i>
                      </a>
                  </li>
                  <li class="secondary">
                      <a href="/accounts/login/?next=/story/diane-rehm-her-career-widowhood-and-championing-right-die/" class="user-login js-auth-controls" style="display: none;">Sign In</a>
                      <a href="#" id="logout" class="user-logout js-auth-controls" style="display:none">Logout&nbsp;<label class="js-profile-path"></label></a>
                  </li>
                  <li class="secondary">
                      <a href="https://pledge3.wnyc.org/?utm_source=wnyc&utm_medium=wnyc-nav-link&utm_content=wnyc-sidebar&utm_campaign=pledge" class="donation">Donate</a>
                  </li>
                  <li class="secondary"><a href="/support/">Support WNYC</a></li>
                  <li class="secondary"><a href="/about/">About Us</a></li>
                  <li class="secondary"><a href="/feedback/">Feedback</a></li>
              </ul>
              <div id="navigation-photo-credit">
                  <p>Photo credit: @julesdwit.</p>
                  <p><a href="#submit_yours">Submit yours.</a></p>
              </div>
          </div><!-- #navigation-items-wrapper -->

      </div>
      <!-- #navigation-menu -->

      <div id="full-page-viewport-wrapper">
          <div id="full-page-transforms-wrapper" class="animate-transforms">

              <!-- block link clicks when nav is open -->
              <div class="open-nav-site-overlay"></div>

              <div id="overlay-inset"></div>








                <div id="header" class="js-track-links" data-category="WNYC Header">
                      <a id="brand-logo" href="/"><h1>WNYC</h1></a>
                      <p id="brand-strap-line" class="animate-opacity">
                          A not-for-profit media organization supported by people like you.
                      </p>

                      <div id="header-social-media-links">



  <ul style="position: relative; top: -6px;">
  <li><a class="fa fa-facebook" href="https://www.facebook.com/WNYC/"><!-- this comment required because tinymce will delete this li otherwise --></a></li>
  <li><a class="fa fa-twitter" href="https://twitter.com/WNYC/"><!-- this comment required because tinymce will delete this li otherwise -->​</a></li>
  <li><a class="fa fa-instagram" href="http://instagram.com/wnyc/"><!-- this comment required because tinymce will delete this li otherwise --></a></li>
  <li><a class="fa fa-youtube" href="https://www.youtube.com/user/wnycradio/"><!-- this comment required because tinymce will delete this li otherwise --></a></li>
  <li><a class="fa fa-tumblr" href="http://wnyc.tumblr.com/"><!-- this comment required because tinymce will delete this li otherwise --></a></li>
  <!--<li><a style="font-size: 12px; text-transform: uppercase; font-weight: 400; position: relative; top: 4px; width: 158px; display: inline-block; line-height: 16px;" href="feedback" target="_blank">How can we improve our website?--><!-- this comment required because tinymce will delete this li otherwise --></ul>


                      </div>

                      <div id="header-align-bottom-wrapper">
                          <button class="js-toggle-menu-v2" id="menu-button"
                              data-toggleClass="navigation-open"
                              data-toggleClassTarget="html"
                              data-ignoreInteractionsWith="#navigation-menu">
                              <div class="menu-button-bar bar-1"></div>
                              <div class="menu-button-bar bar-2"></div>
                              <div class="menu-button-bar bar-3"></div>
                              <label id="menu-button-label">Menu</label>
                          </button>

                          <div id="search-wrapper">
                              <button id="search-button" class="js-animate-input"
                                  data-input="#search-input"
                                  data-classTarget="#search-wrapper">
                                  <a href="#"><i class="fa fa-search"></i></a>
                              </button>
                              <form method="GET" action="/search/" id="search-form" class="promoted-layer animate-transforms">
                                  <input id="search-input" name="q" class="promoted-layer animate-transforms js-animate-input"
                                      data-input="#search-input"
                                      data-classTarget="#search-wrapper">
                                  <label for="search-input" class="promoted-layer animate-opacity js-animate-input"
                                      data-input="#search-input"
                                      data-classTarget="#search-wrapper">Search</label>
                              </form>
                          </div>
                          <!-- #search-wrapper -->

                          <div id="support-links">
                              <ul id="login-wrapper">


    <li class="user-welcome" style="display: none;">Hi,
      <a href="/users/me/" class="js-profile-path"> </a>
    </li>
    <li class="user-logout" style="display: none;">
    <a href="#" id="logout">Logout</a>
  </li>

      <li class="user-login" style="display: none;">
        <a href="/accounts/login/?next=/story/diane-rehm-her-career-widowhood-and-championing-right-die/">
          <i class="user-icon fa fa-user" style="display: none;"></i>
          Sign In</a>
      </li>

                              </ul>



    <p class="header-wide-button btn--pink"><a style="color: white;" href="http://www.wnyc.org/epledge/main?utm_source=wnyc&amp;utm_medium=wnyc-86x27&amp;utm_content=wnyc-header&amp;utm_campaign=pledge" target="_blank">Donate</a></p>


                          </div>
                          <!-- #support-links -->
                      </div>
                      <!-- #header-align-bottom-wrapper -->
                  </div>
                  <!-- #header -->





      <div id="browser-warn"></div>

      <div class="l-constrained is-collapsed">
          <div id="leaderboard" class="aligncenter"></div>
      </div>

      <div class="l-full">
      <div class="l-constrained">
          <div id="stream_launch_widget">
    <button id="popup-btn" class="js-popup-btn" aria-label="Launch the popup player." tabindex="0" data-category="Listen">
      <div class="icon"></div>
      <span class="popup-btn-label">Listen</span>
    </button>
    <p class="status-message">
    </p>
    <div id="stations_wrapper">
      <div class="head toggle-menu" data-menuSelector="#station_dropdown">
        <h4 class="flush"><div class="icon"></div>Streams</h4>
        <div class="current"></div>
      </div>
      <ul id="station_dropdown" class="menu" data-category="ChooseStream"></ul>
    </div>
    <div class="show">
      <div class="image">
        <img width="100%" height="100%">
      </div>
      <div class="head">
        <h4 class="show-title"><a class="link--nodecor"></a></h4>
        <div class="item-title"><a class="link--nodecor"></a></div>
        <div class="sharing"></div>
      </div>
    </div>
    <div class="util">
      <div class="schedule toggle-menu"
        data-menuSelector="#stream_launch_widget .schedule-menu">
        <div class="icon"></div>
        Schedule
        <a href="/schedule" class="link--nodecor"></a>
      </div>
      <div class="options toggle-menu"
        data-menuSelector="#stream_launch_widget .options-menu">
        <div class="icon"></div>Options
      </div>
      <ul class="menu schedule-menu">
        <li class="full-schedule"><a href="/schedule" class="link--nodecor">View Full Schedule »</a></li>
      </ul>
      <ul class="menu options-menu">
        <li class="audio-help">
          <a href="/audio/help/" class="link--nodecor">
            <div class="icon"></div>
            Audio Help
          </a>
        </li>
      </ul>
    </div>

      <script type="text/x-template" id="stream_launch_widget_station_entry">
        <li data-stream_slug="<%= data.slug %>">
          <div class="station-entry <%= data.slug %>">
            <div class="stream-name">
              <div class="inner"><%= data.name %></div>
            </div>
            <div class="image">
            </div>
            <div class="playing-info">
              <div class="show-title"></div>
              <div class="item-title"></div>
            </div>
          </div>
        </li>
      </script>
      <script type="text/x-template" id="stream_launch_widget_schedule_entry">
        <li>
          <a href="<%= data.url %>">
            <span class="time"><%= data.time %> <%= data.meridian %></span>
            <span class="show-name"><%= data.show %></span>
          </a>
        </li>
      </script>
      <script type="text/x-template" id="stream_launch_widget_options_entry">
        <li class="audio-option">
          <a href="<%= data.url %>">
            <%= data.description %>
            <span class="audio-option-format"><%= data.format %></span>
          </a>
        </li>
      </script>

  </div>


      </div>

      <div class="l-constrained">
          <main class="l-col2of3" id="main" role="main">
              <article class="doubledown" data-status="" data-date="">


                  <header class="l-bgimg flush" id="storyHeader">

      <style>
          .l-bgimg:after {
              background-image: url(http://www.wnyc.org/i/800/0/l/80/1/diane.jpg);
          }
          .no-filter .l-bgimg:after {
              background-image: none;
          }
      </style>

      <div class="flag nudge">

      <a class="flag-image inherit" href="http://dev.wnyc.net:4444/shows/lopate">
          <img alt="The Leonard Lopate Show" class="badge squarebadge"
              src="http://www.wnyc.org/i/50/50/c/99/1/ll_CZTTQOh.png"
              srcset="http://www.wnyc.org/i/100/100/c/99/1/ll_CZTTQOh.png 2x,
                  http://www.wnyc.org/i/150/150/c/99/1/ll_CZTTQOh.png 3x"
              width="50" height="50">
          <span class="for-screenreaders">The Leonard Lopate Show</span>
      </a>
      <!-- .flag-image -->


      <div class="flag-body">
          <div class="media media--rev">
              <div class="media-image">
                  <a data-url="cms/segment/623103" class="btn btn--green stf" style="display: none;">Edit this</a>
              </div>


              <div class="media-body">
                  <div class="text--small dimmed">Published in</div>

                  <a class="text--mq-bluewhite"  href="http://dev.wnyc.net:4444/shows/lopate">
                      The Leonard Lopate Show
                  </a>
              </div>


          </div>
          <!-- .media -->
      </div>
      <!-- .flag-body -->
  </div>
  <!-- .flag -->

  <h1 class="h1">Django Test Page</h1>

  <div class="l-split flush">


          <div class="btn-group btn-group--withvr">
              <button aria-label="Listen to Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die" class="btn btn--blue btn--large js-listen"
                data-id="623103" data-category="Listen"
                data-ember-component="listen-button"
                data-ember-args='{ "itemPK": "623103", "itemTitle": "Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die", "duration": "24 min" }'>
                  <i class="fa fa-play icon--prefix--large"></i>Listen <span class="text--small dimmed">24 min</span>
              </button>

              <button aria-label="Add Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die to Your Queue" class="btn btn--mq-graywhite hide-on-mobile js-queue"
                data-ember-component="queue-button"
                data-ember-args='{ "itemPK": "623103", "itemTitle": "Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die", "type": "circle" }'
                data-id="623103"
                data-category="Queue">
                  <i class="fa fa-plus icon--prefix"></i>Queue
              </button>


              <div class="dropdown dropdown--bl dropdown--white">
                  <button aria-haspopup="true" aria-label="More Options" aria-owns="623103" class="btn btn--circle btn--white medium-up js-dropdownClickable">
                      <i class="fa fa-ellipsis-h"></i>
                  </button>

                  <div class="dropdown-body medium-up" id="623103">
                      <div class="panel">


                          <a href="http://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/lopate/lopate053016dpod.mp3" download="Django Test Page" class="panel-link link--dark text--medium">
                              <i class="fa fa-cloud-download panel-linkicon"></i>
                              Download this audio
                          </a>
                          <!-- .panel-link -->


                          <div class="panel-body box--nearwhite">
                              <div class="text flush">
                                  <p class="h4 flush">Want to embed this player?</p>
                                  <p class="text--small nudge" id="dropdownLabel_623103">Use the code below. <a href="/audio/help" target="_blank">More info</a>.</p>
                                  <textarea aria-labelledby="dropdownLabel_623103" aria-readonly="true" class="js-embedText textarea textarea--noresize" cols="40" data-category="SelectEmbed" rows="6" readonly>&lt;iframe frameborder=&quot;0&quot; scrolling=&quot;no&quot; height=&quot;130&quot; width=&quot;100%&quot; src=&quot;/widgets/ondemand_player/wnyc/#file=/audio/json/623103/&amp;share=1&quot;&gt;&lt;/iframe&gt;</textarea>
                              </div>
                          </div>
                          <!-- .panel-body -->


                      </div>
                      <!-- .panel -->
                  </div>
                  <!-- .dropdown-body -->
              </div>
              <!-- .dropdown -->

          </div>
          <!-- .btn-group -->


      <div class="btn-group">

          <button data-action="https://www.facebook.com/sharer/sharer.php?u=http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/" class="btn btn--circle btn--mq-graywhite js-share" data-category="SharedF" target="_blank" title="Share on Facebook">
              <i class="fa fa-facebook"></i>
              <span class="for-screenreaders">Share on Facebook</span>
          </button>
          <button data-action="https://twitter.com/intent/tweet/?text=Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die&via=WNYC&url=http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/" class="btn btn--circle btn--mq-graywhite js-share" data-category="SharedT" id="shareTwitter" target="_blank" title="Share on Twitter">
              <i class="fa fa-twitter"></i>
              <span class="for-screenreaders">Share on Twitter</span>
          </button>
          <a href="mailto:?subject=Diane%20Rehm%20on%20her%20Career%2C%20Widowhood%20and%20Championing%20the%20Right%20to%20Die&body=http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/" class="btn btn--circle btn--mq-graywhite js-share" data-category="SharedE" id="shareEmail" title="Email a Friend">
              <i class="fa fa-envelope"></i>
              <span class="for-screenreaders">Email a Friend</span>
          </a>
      </div>
      <!-- .btn-group -->
  </div>
  <!-- .l-split -->


  </header>
  <!-- .l-bgimg -->




  <figure class="figure" id="imageMain">
      <img class="figure-image" alt="Diane Rehm, right, of &#x27;The Diane Rehm Show&#x27; hosts the program at WAMU 88.5 that included guest, Andy Dyer, left, on Tuesday February 3, 2015 in Washington, DC. " src="http://www.wnyc.org/i/800/0/l/80/1/diane.jpg">
      <figcaption class="figure-caption">
          <div class="figure-caption-body js-captionBody" data-state="is-closed" id="figureCaption" aria-hidden="true">
              <div class="text text--medium text--white flush">
                  Diane Rehm, right, of 'The Diane Rehm Show' hosts the program at WAMU 88.5 that included guest, Andy Dyer, left, on Tuesday February 3, 2015 in Washington, DC. <br>
                  (Matt McClain/ The Washington Post via Getty Images
                  )

              </div>
          </div>
          <!-- .figure-caption-body -->

          <div class="figure-caption-button">
              <button class="btn btn--black btn--strictsquare btn--square-small btn--toggle js-captionBtn js-toggleButton" data-state="first" role="button" aria-controls="figureCaption">
                  <div class="btn-togglecontent">
                      <i class="icon icon--info">i</i>
                  </div>
                  <div class="btn-togglecontent">
                      <i class="fa fa-times icon--captionclose"></i>
                  </div>
              </button>
          </div>
          <!-- .figure-caption-button -->

      </figcaption>
  </figure>


                  <footer class="text text--medium text--dotted" id="byLine">
      <time datetime="2016-05-30">May 30, 2016</time>



  </footer>







  <section class="text">

          <p><em>This is a rebroadcast of an interview that originally aired on February 3, 2016. </em></p>
  <p><span>Longtime NPR radio host</span><strong> </strong><a class="guestlink" href="/people/r/?n=Diane+Rehm">Diane Rehm</a><span> joins us to discuss her memoir <em><span class="book"><a title="buy this book at Amazon" target="_blank" href="http://www.amazon.com/exec/obidos/ASIN/1101875283/wnycorg-20/">On My Own</a></span></em></span><span> about her late husband’s battle with Parkinson’s disease and how she rebuilt her life without him after 54 years of marriage. She writes about the practical challenges, emotional pain and her involvement in the right-to-die movement.</span></p>
  <p> </p>
  <div class="embedded-image"><img class="mcePuppyImage" src="https://media2.wnyc.org/i/800/600/l/80/1/leonarddiane.jpg" alt=""><div class="image-metadata">
  <div class="image-caption">Diane Rehm joined us to talk about her new book.</div>
  <div class="image-credit">(Melissa Eagan)</div>
  </div>
  </div>
  <p> </p>
  <p><strong>Check out our Guest Picks for Diane Rehm!</strong></p>
  <p><strong>What have you read or seen over the past year that moved or surprised you?</strong></p>
  <p>“Spotlight”</p>
  <p><strong><span>What are you listening to right now?</span></strong></p>
  <p>I’m hearing Lopate interview someone.</p>
  <p><strong><span>What’s the last great book you read?</span></strong></p>
  <p>“All the light you cannot see” – Anthony Doerr</p>
  <p><strong><span>What’s one thing you’re a fan of that people might not expect?</span></strong></p>
  <p>Little dogs -- big dogs -- horses</p>
  <p><strong><span>What’s your favorite comfort food?</span></strong></p>
  <p>Popeye’s fried chicken (which I don’t allow myself to eat very often!)</p>
  </section>


















                  <section aria-live="polite" id="comments"></section>
  <!-- #comments -->


              </article>
          </main>
          <!-- .l-col2of3 -->

          <aside class="l-col1of3" id="chunks">
      <div class="l-skinny">

          <div class="list list--noborder">
       <div class="list-heading">
            <h1 class="h4">The Leonard Lopate Show</h1>
       </div>

       <div class="text text--medium">
            <p class="nudge-big">
              <a href="/people/leonard-lopate">Leonard Lopate</a> hosts the conversation New Yorkers turn to each afternoon for insight into contemporary art, theater, and literature, plus expert tips about the ever-important lunchtime topic: food.<br>
              Produced by <a href="/">WNYC</a>.
            </p>

            <div class="l-split flush">
                 <div class="btn-group btn-group--withvr">
                      <a class="btn" href="/epledge/main?utm_source=wnyc&utm_medium=the-leonard-lopate-show-rightrailbutton&utm_campaign=pledge&utm_content=donate" target="_blank">Donate</a>
                 </div>
                 <div class="btn-group">
                      <div class="dropdown dropdown--br dropdown--nearwhite">
                           <button class="btn js-dropdownClickable">Subscribe to the podcast ▾</button>
                           <div class="dropdown-body">
                                <div class="panel">
                                     <a class="panel-link text--medium link--dark" href="https://itunes.apple.com/us/podcast/id74254710" target="_blank"><i class="fa fa-mobile"></i> via iTunes</a>
                                     <a class="panel-link text--medium link--dark" href="https://play.pocketcasts.com/web#/podcasts/show/357b6ef0-0eac-012e-fbff-00163e1b201c" target="_blank"><i class="fa fa-mobile"></i> via Pocket Casts</a>
                                     <a class="panel-link text--medium link--dark" href="http://www.stitcher.com/podcast/wnycs-leonard-lopate-show" target="_blank"><i class="fa fa-mobile"></i> via Stitcher</a>
                                     <a class="panel-link text--medium link--dark" href="http://tunein.com/radio/The-Leonard-Lopate-Show-p688" target="_blank"><i class="fa fa-mobile"></i> via TuneIn</a>
                                     <a class="panel-link text--medium link--dark" href="https://play.google.com/music/listen?u=1#/ps/I6jq52vujz645k6sfw45tsx4gza" target="_blank"><i class="fa fa-mobile"></i> via Google Play</a>
                                     <a class="panel-link text--medium link--dark" href="http://feeds.wnyc.org/wnyc_lopate" target="_blank"><i class="fa fa-rss"></i> via RSS</a>
                                  </div><!-- .panel -->
                             </div><!-- .dropdown-body -->
                        </div><!-- .dropdown -->
                   </div><!-- .btn-group -->
              </div><!-- .l-flush -->
       </div><!-- .text -->
   </div><!-- .list -->



          <div id="rightRail" class="align--mq-centertoright"></div>




      </div>
  </aside>


      </div>
      <!-- .l-constrained -->

      <div class="l-constrained">
          <div class="l-col2of3">




              <div id="story-chunk">

  </div>


              <aside id="related" data-category="related"></aside>
  <!-- .related -->


          </div>
          <!-- .l-col2of3 -->
      </div>
      <!-- .l-constrained -->
  </div>
  <!-- .l-full -->






              <!-- FOOTER -->
              <div id="footer_container">
                  <div id="footer-inner">
                      <ul class="menu_left">
                          <li class="logo"><a href="/"><h2>WNYC</h2></a></li>
                          <li><a href="/about/">About WNYC</a></li>
                          <li><a href="https://nypublicradio.zendesk.com/hc/en-us">Contact Us</a></li>
                          <li><a href="http://www.nypublicradio.org/underwriting/wnyc">Become a Sponsor</a></li>
                          <li><a href="/press/">Press</a></li>
                          <li><a href="/careers">Jobs</a></li>
                          <li><a href="/mobile">iOS &amp; Android App</a></li>
                      </ul>

                      <ul class="menu_right social">
                          <li><a href="http://www.facebook.com/wnyc" title="Facebook" class="facebook">Facebook</a></li>
                          <li><a href="http://www.twitter.com/wnyc" title="Twitter" class="twitter">Twitter</a></li>
                          <li><a href="https://plus.google.com/105663864068274073281" title="Google Plus" class="googleplus" rel="publisher">Google+</a></li>
                          <li><a href="http://tunein.com/radio/stations/WNYC-Radio-Stations-a38278/" title="TuneIn" class="tunein" rel="publisher">TuneIn</a></li>
                      </ul>
                      <div class="border top"></div>
                      <div class="border bottom"></div>
                      <div class="footer_copyright">
                          <p>WNYC 93.9 FM and AM 820 are New York&#39;s flagship public radio
                            stations, broadcasting the finest programs from NPR, PRI and American Public Media, as well as a wide range of award-winning local
                            programming. WNYC is a division of
                            <a href="http://www.newyorkpublicradio.org" class="nypr_link">New York Public Radio</a>.
                          </p>
                          <div class="nypr_lockup">
                              <ul>
                                  <li class="nypr"><a href="http://www.newyorkpublicradio.org/">New York Public Radio</a></li>
                                  <li class="wnyc"><a href="/">WNYC</a></li>
                                  <li class="wqxr"><a href="http://www.wqxr.org/">WQXR</a></li>
                                  <li class="njpr"><a href="http://www.njpublicradio.org/">New Jersey Public Rdio</a></li>
                                  <li class="greene-space"><a href="http://www.thegreenespace.org">The Greene Space</a></li>
                              </ul>
                          </div>
                          <!-- .nypr_lockup -->
                          <div class="sponsor">
                              WNYC is supported by <img src="http://www.wnyc.org/i/raw/1/wnyc-footer.png">
                          </div>
                          <ul class="nypr_copyright">
                              <li class="norule">&copy; 2016
                                  <a href="http://www.newyorkpublicradio.org" class="nypr_link">New York Public Radio</a></li>
                              <li><a href="/terms/">Terms of Use</a></li>
                              <li><a href="/privacy/">Privacy Policy</a></li>
                              <li><a href="/corrections/">Corrections</a></li>
                              <li><a href="/articles/wnyc-contest-rules/">Contest Rules</a></li>
                          </ul>
                      </div>
                      <!-- #footer_copyright -->
                  </div>
                  <!-- #footer-inner -->
              </div>
              <!--//#footer-->

          </div><!-- #full-page-transforms-wrapper -->
      </div><!-- #full-page-viewport-wrapper -->

      <!-- Splash page code START -->
    <div>

      <!-- Desktop splash div -->
      <div id="desktop_splash" style="display: none; background-color: white;">
        <iframe data-src="http://www.wnyc.org/splash/notetoself-responsive-splash-desktop/" width="800" height="600" frameBorder="0" style="float: left;"></iframe>
        <!-- Add an optional button to close the popup -->
        <!-- <button class="desktop_splash_close" style="position: absolute; top: 15px; right: 15px; opacity: 0.5">✖ Close</button> -->
        <img class="desktop_splash_close" src="https://media2.wnyc.org/i/raw/1/x_close_of2wUf6.png" style="box-sizing: border-box; cursor: pointer; position: absolute; width: 70px; top: 0; right: 0; padding: 25px; opacity: 0.8;" />
      </div>

      <!-- Mobile splash div -->
      <div id="mobile_splash" style="display: none; background-color: white;">
        <iframe data-src="http://www.wnyc.org/splash/notetoself-responsive-splash-mobile/" width="240" height="400" frameBorder="0" style="float: left;"></iframe>
        <!-- Add an optional button to close the popup -->
        <!-- <button class="mobile_splash_close" style="position: absolute; top: 0; right: 0;">Close</button> -->
        <img class="mobile_splash_close" src="https://media2.wnyc.org/i/raw/1/x_close_of2wUf6.png" style="box-sizing: border-box; cursor: pointer; position: absolute; width: 60px; top: 0; right: 0; padding: 10px; opacity: 0.7; padding-left: 30px; padding-bottom: 30px;" />
      </div>

    </div>
    <script type="text/javascript">

      // Pass a show slug (e.g. 'q2'); returns true if it's a show page or story
      function isShow(showSlug) {
          var url = window.location.hostname + window.location.pathname + window.location.hash;
          var curitem = (typeof wnyc.current_item !== 'undefined') ? JSON.stringify(wnyc.current_item) + " " : " ";
          if ((url.indexOf(showSlug) > 0) || (curitem.indexOf(showSlug) > 0)) {
              return true;
          } else {
              return false;
          }
      }

      document.addEventListener("DOMContentLoaded", function() {
        $.getScript('//cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js', function() {
          $.getScript('https://cdn.rawgit.com/vast-engineering/jquery-popup-overlay/1.7.11/jquery.popupoverlay.js', function() {
            if (!$.cookie('splash')) {

              var popupId = ($(window).width() > 840) ? "#desktop_splash" : "#mobile_splash";
              if (isShow('notetoself')) {
                $(popupId).popup({
                  autoopen: true,
                  autozindex: true,
                  transition: 'all 0.3s',
                  focusdelay: 3000,
                  onopen: function() {
                    var iframeElement = $(popupId).find('iframe');
                    iframeElement.attr('src', iframeElement.data('src'));
                    $.cookie('splash', 'has_been_displayed', { expires: 1, path: '/' });
                  }
                });
              }

            }
          });
        });
      });
    </script>
    <!-- Splash page code END -->

    <script type="text/javascript">
      var flag_for_mod_url = '/comments/userflag/';
      var auth_login = '/accounts/login/?next=' +
                       document.location.pathname;
      var flag_url = '/comments/adminflag/';
    </script>


    <script type="application/vnd.api+json" id="wnyc-story-jsonapi">{"data":{"attributes": {"analyticsCode": "ExperimentalStory:diane-rehm-her-career-widowhood-and-championing-right-die $A1$AD1450$V0$Ms$D1$HS1$HC0$B0$SS++$C$SThe Leonard Lopate Show$T!npr!life!books!marriage!diane_rehm!right_to_die!parkinsons_disease!$AP/lopate/lopate053016dpod.mp3$", "itemType": "segment", "audioEventually": true, "audioMayDownload": true, "dateLine": "Monday, May 30, 2016", "imageMain": {"creditsUrl": "", "name": "1/diane.jpg", "source": null, "url": "http://www.wnyc.org/i/800/531/l/80/1/diane.jpg", "h": 531, "isDisplay": true, "crop": "l", "caption": "Diane Rehm, right, of 'The Diane Rehm Show' hosts the program at WAMU 88.5 that included guest, Andy Dyer, left, on Tuesday February 3, 2015 in Washington, DC. ", "template": "http://www.wnyc.org/i/%s/%s/%s/%s/1/diane.jpg", "w": 800, "id": 149003, "creditsName": "Matt McClain/ The Washington Post via Getty Images"}, "audioShowOptions": true, "commentsEnabled": true, "dateLineDatetime": "2016-05-30T00:00:00-04:00", "audioDurationReadable": "24 min", "title": "Django Test Page", "audioAvailable": true, "cmsPK": 623103, "editLink": "cms/segment/623103", "slug": "diane-rehm-her-career-widowhood-and-championing-right-die", "itemTypeId": 24, "audioMayEmbed": true, "tease": "Diane Rehm discusses her memoir \"On My Own,\" about her husband&rsquo;s battle with Parkinson&rsquo;s disease life without him after 54 years of marriage.&nbsp;", "url": "http://dev.wnyc.net:4444/story/diane-rehm-her-career-widowhood-and-championing-right-die/", "headers": {"brand": {"url": "http://dev.wnyc.net:4444/shows/lopate", "logoImage": {"creditsUrl": "", "name": "1/ll_CZTTQOh.png", "source": null, "url": "http://www.wnyc.org/i/800/800/c/80/1/ll_CZTTQOh.png", "h": 800, "isDisplay": true, "crop": "c", "caption": "", "template": "http://www.wnyc.org/i/%s/%s/%s/%s/1/ll_CZTTQOh.png", "w": 800, "id": 103450, "creditsName": "WNYC Digital"}, "title": "The Leonard Lopate Show"}, "links": [{"url": "http://dev.wnyc.net:4444/shows/lopate", "title": "The Leonard Lopate Show"}]}, "audio": "http://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/lopate/lopate053016dpod.mp3", "commentsCount": 0}, "type": "story", "id": 623103}}</script>

    <script src="https://www.google.com/jsapi"></script>
    <script src="//maps.googleapis.com/maps/api/js?"></script>

    <script type="text/javascript" src="/media/CACHE/js/swfobject.4a62187da8d2.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jwplayer.1f0e65831ea4.js"></script>
    <script type="text/javascript">
      (function(){
      var globalEval = eval;
      function moduleDefinition() {
          globalEval("jwplayer.key=\"\";");
      }
      if (window.WNYC_LEGACY_LOADER) {
          WNYC_LEGACY_LOADER.define('03292dbefe3982b4ca9adb0b588ada31', moduleDefinition);
      } else {
          window.WNYC_MODULES = window.WNYC_MODULES || {};
          WNYC_MODULES['03292dbefe3982b4ca9adb0b588ada31'] = moduleDefinition;
          moduleDefinition();
      }
      })();
    </script>
    <script type="text/javascript" src="/media/CACHE/js/util.fdbc5550aac3.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/listening.d48dc3bddc71.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/pubsub.33729aee71a9.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/hashNav.b3f80782edec.js"></script>
    <script type="text/javascript">
        (function(){
        var globalEval = eval;
        function moduleDefinition() {
            globalEval("\n    wnyc.hashNav = makeHashNav(false);\n  ");
        }
        if (window.WNYC_LEGACY_LOADER) {
            WNYC_LEGACY_LOADER.define('86b0c37c2441ba7359807d9aa46ea01f', moduleDefinition);
        } else {
            window.WNYC_MODULES = window.WNYC_MODULES || {};
            WNYC_MODULES['86b0c37c2441ba7359807d9aa46ea01f'] = moduleDefinition;
            moduleDefinition();
        }
        })();
    </script>
    <script type="text/javascript" src="/media/CACHE/js/namespace.6d1473a6293f.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jquery.0e5fe455f107.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/user.9870759f3c15.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jquery.ba-postmessage.2505f0006e22.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/string.5328060c7d42.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/number.e8cb0863de0e.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/datetime.157f95132cc6.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/url.df7efc0337f1.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/stylesheets.c9512bff8772.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/reversable_enum.20cdbae3ce03.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/xwm.8dbd1bc76ead.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/xdm.5be1116e5d65.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/resizable_image.40fff6233984.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/namespace_ext.bbec716cd55b.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/whats_on_facade.bb64a9454023.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/whats_on_today_facade.a62adb9e05d0.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/stream_playlist_facade.51696b270cf6.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jquery.xdr.2cbe318f2f1e.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.modal.100b1a252d1d.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.damost.87e4e5704319.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.popular_sidebar.e56625fa9bab.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.listen_now.e12c0e3fd4ea.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.listen_segment.22f2ff115d8e.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.truncate_to_height.720b0eb834c3.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.custom_truncate.300642b0ea34.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.search_init.e28297322516.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.toggle_one.d1996af3a6cd.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.toggle_two.62fdb1a703ac.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.toggle_menu.12cdfbc74f57.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.toggle_menu_v2.50cf42fc6cb8.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.manipulate_element.e94d22e4fb3d.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.get_json_linkroll.d5ddcfed2562.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.clear_on_focus.0dfa04efa055.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.toggle_hide_on_click_outside.5d87e5c6813c.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.animate_input.eb22cf84f99b.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/browserWarn.323f83ce57f1.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.membership_form.cf8fb5fd0829.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.iframe_resize.729b9c37f4e4.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.ondemand_audio.74ff5295a8c7.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.record_user_equivalence.b3d9465d7c82.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.hide_label_on_input_focus.ca14be1e39a4.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.strip_trailing_colon.24109f052587.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.no_autocorrect.613ae6cf9194.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.no_autocapitalize.a1ea08f6cb7d.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.convert_to_email_input.7eb8773269bd.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.launch_stream.8b1336988908.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.logged_in_content.fd2acd3b19b8.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/wnyc.show_hide_comments.01cf1293853c.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/slick-1.4.1.c0bb2ba34110.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/station_dropdown.dae3077c44b8.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/playing_info.9c153eae9539.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/audio_options_menu.d8f8ee68a52a.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/schedule_menu.23be22a61dd2.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/simple_sharing_menu.e469aa7218ee.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/stream_launch_widget.e9ce043dcfb3.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/enlarge.9f54e3268ec5.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jquery.form.c1a6e2dcbf80.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jquery.cycle.all.60a04d4856aa.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/survey.f59418a743ca.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/main_image.6cc242b0d9a6.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/accordion.1704d87208fd.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/dropdown.4017b5c5a9a5.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/tabs.b044d5592bd8.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/slideshow.bb6973dc32fa.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/jw_player_setup.48c0f26efb12.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/share.149f3ba5e0f9.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/legacy_survey.6591ff730a64.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/dom_mut.b0477866e7d7.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/footer_form.0a532f12e53d.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/story.a2e1d4cf103d.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/autoload.6523b2ee4ce6.6fcac03193a7.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/overlay_iframe_outer.5af5de7f31b5.ee48a01b234e.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/player_client_controller.72c0fc865974.ae6cf39f703f.js"></script>
    <script type="text/javascript" src="/media/CACHE/js/easteregg_keys.b1cb2f839bca.92f6fb04fabe.js"></script>
    <script type="text/javascript">
      (function(){
      var globalEval = eval;
      function moduleDefinition() {
          globalEval("\n    qcdata = {} || qcdata;\n       (function(){\n       var elem = document.createElement('script');\n       elem.src = (document.location.protocol == \"https:\" ? \"https://secure\" : \"http://pixel\") + \".quantserve.com/aquant.js?a=p-U78Kbcddsn6tm\";\n       elem.async = true;\n       elem.type = \"text/javascript\";\n       var scpt = document.getElementsByTagName('script')[0];\n       scpt.parentNode.insertBefore(elem,scpt);\n     }());\n\n\n     var qcdata = {qacct: 'p-U78Kbcddsn6tm',\n                   orderid: '',\n                   revenue: ''\n                   };\n  ");
      }
      if (window.WNYC_LEGACY_LOADER) {
          WNYC_LEGACY_LOADER.define('d6283d73aceb677b1dabe1c8ec9a910a', moduleDefinition);
      } else {
          window.WNYC_MODULES = window.WNYC_MODULES || {};
          WNYC_MODULES['d6283d73aceb677b1dabe1c8ec9a910a'] = moduleDefinition;
          moduleDefinition();
      }
      })();
    </script>
    <script type="text/javascript">
      (function(){
      var globalEval = eval;
      function moduleDefinition() {
          globalEval("\nvar set_chartbeat_sections = function(){\n    var all_sections = [];\n    if (window.wnyc) {\n        if (wnyc.section){\n            all_sections.push(wnyc.section);\n        }\n\n        if (wnyc.current_item) {\n            if (wnyc.current_item.series) {\n                Array.prototype.push.apply(all_sections, wnyc.current_item.series);\n            }\n            if (wnyc.current_item.show) {\n                all_sections.push(wnyc.current_item.show);\n            }\n            if (wnyc.current_item.channel) {\n                all_sections.push(wnyc.current_item.channel);\n            }\n        }\n        var all_sections_string = all_sections.join(\",\");\n        if (wnyc.current_item) {\n            /* \n            Adding this for debugging purposes. \n            wnyc.current_item.chartbeat_sections would not be consumed anywhere in the application\n            */\n            wnyc.current_item[\"chartbeat_sections\"] = all_sections_string;\n        }\n        return all_sections_string;\n    }\n    else {\n        return \"\";\n    }\n}\n\nvar _sf_async_config={\n  uid:4030,\n  domain:\"beta.wnyc.org\",\n  sections: set_chartbeat_sections(),\n  authors: ((wnyc.current_item && wnyc.current_item.authors) ?\n            wnyc.current_item.authors.join(\",\") : \"\")\n};\n\n\njQuery(window).bind('load', function() {\n  if (wnyc.current_item && !wnyc.current_item.published) {\n    return;\n  }\n  window._sf_endpt=(new Date()).getTime();\n  jQuery.ajax({\n    url:((\"https:\" == document.location.protocol)\n         ? \"https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/\"\n         : \"http://static.chartbeat.com/\") + \"js/chartbeat.js\",\n    dataType:'script',\n    async:true,\n    cache:true\n  });\n});\n");
      }
      if (window.WNYC_LEGACY_LOADER) {
          WNYC_LEGACY_LOADER.define('ad7383f96a45de5cd987c9f906cde34c', moduleDefinition);
      } else {
          window.WNYC_MODULES = window.WNYC_MODULES || {};
          WNYC_MODULES['ad7383f96a45de5cd987c9f906cde34c'] = moduleDefinition;
          moduleDefinition();
      }
      })();
    </script>

    <script type="text/javascript">
        if ( wnyc.deferredJw ) wnyc.runDeferred(wnyc.deferredJw);
        if ( wnyc.deferredLoadSurvey ) wnyc.runDeferred(wnyc.deferredLoadSurvey);
        if ( wnyc.deferredLoadSurveyResults ) wnyc.runDeferred(wnyc.deferredLoadSurveyResults);
    </script>

    <script>
      (function() {
        var gads = document.createElement('script');
        gads.async = true; gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
      })();
    </script>

    <script type="text/javascript" class="google_ads_definitions">
      googletag.cmd.push(function() {

      var leaderboard_mapping = googletag.sizeMapping()
          .addSize([0, 0], [300, 50])
          .addSize([758, 0], [728, 90])
          .addSize([1020, 0], [970, 415])
          .build()

      wnyc.ads.leaderboard = googletag.defineSlot("/6483581/leaderboard/wnyc_leaderboard", [[970, 415], [728, 90], [300, 50]], "leaderboard")
          .defineSizeMapping(leaderboard_mapping)
          .addService(googletag.pubads());

      window.matchMedia('(min-width: 758px)').addListener(function(mql) {
        googletag.pubads().refresh([wnyc.ads.leaderboard])
      })
      window.matchMedia('(min-width: 1020px)').addListener(function(mql) {
        googletag.pubads().refresh([wnyc.ads.leaderboard])
      })


                  wnyc.ads["rightRail"] = googletag.defineSlot("/6483581/rectangle/wnyc_rectangle", [[300, 250], [300, 600]], "rightRail")
              .addService(googletag.pubads());



        googletag.pubads().collapseEmptyDivs();
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();

      });
    </script>


    <script type="text/javascript" class="google_ads_custom_targeting">
      window.googletag.cmd.push(function() {
        googletag.pubads().setTargeting('url', window.location.pathname);
        googletag.pubads().setTargeting('host', window.location.host);
        googletag.pubads().setTargeting('fullurl', window.location.host + window.location.pathname);

        if (wnyc.current_item){
            if (wnyc.current_item.tags) {
                googletag.pubads().setTargeting('tag', wnyc.current_item.tags);
            }
            if (wnyc.current_item.show) {
                googletag.pubads().setTargeting('show', wnyc.current_item.show);
            }
            if (wnyc.current_item.channel) {
                googletag.pubads().setTargeting('channel', wnyc.current_item.channel);
            }
            if (wnyc.current_item.series) {
                googletag.pubads().setTargeting('series', wnyc.current_item.series);
            }
        }
      });

    </script>
    <script type="text/javascript">
      window.googletag.cmd.push(function() {
          googletag.display('leaderboard');
          googletag.display('rightRail');
      });
    </script>
    <script type="text/x-wnyc-marker" data-url="story/diane-rehm-her-career-widowhood-and-championing-right-die/"></script>
  </body>
</html>`;

export default HTML;
