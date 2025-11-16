/* Lightweight translations loader
   - Loads assets/i18n/translations.json (path resolved relative to script src)
   - Applies translations to elements with data-i18n="key"
   - Stores selected language in localStorage under 'site_lang'
   - Provides a simple toggle button with id 'langToggle'
*/
(function(){
  function getBasePath(){
    // find this script tag
    var scripts = document.getElementsByTagName('script');
    for(var i=0;i<scripts.length;i++){
      var s = scripts[i];
      if(s.src && s.src.indexOf('translations.js') !== -1){
        return s.src.replace(/assets\/js\/translations.js(\?.*)?$/,'assets/i18n/');
      }
    }
    // fallback
    return 'assets/i18n/';
  }

  // allow an application-level override for where translations are served from.
  // e.g. set window.__I18N_BASE = '/assets/i18n/' before this script runs
  var base = (typeof window !== 'undefined' && window.__I18N_BASE) ? window.__I18N_BASE : getBasePath();
  // normalize base to ensure it ends with '/'
  if(base && base.slice(-1) !== '/') base = base + '/';
  var url = base + 'translations.json';
  var storeKey = 'site_lang';
  var translations = null;
  var currentLang = null;

  function apply(lang){
    if(!translations || !translations[lang]) return;
    var dict = translations[lang];
    currentLang = lang;
    // set document lang
    try{ document.documentElement.lang = lang; }catch(e){}
    // aria-live announcer (create if missing)
    var announcer = document.getElementById('i18nAnnouncer');
    if(!announcer){
      announcer = document.createElement('div');
      announcer.id = 'i18nAnnouncer';
      announcer.setAttribute('aria-live','polite');
      announcer.setAttribute('role','status');
      // visually hidden styles
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(1px, 1px, 1px, 1px)';
      announcer.style.whiteSpace = 'nowrap';
      document.body.appendChild(announcer);
    }
    // elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if(!key) return;
      var text = dict[key];
      if(text === undefined) return; // keep original if missing
      // if element has data-i18n-attr, set attribute instead of text
      var attr = el.getAttribute('data-i18n-attr');
      if(attr){
        el.setAttribute(attr, text);
      } else {
        // preserve HTML elements like <strong> inside? We'll replace textContent
        el.textContent = text;
      }
    });

    // update lang toggle label if present
    var btn = document.getElementById('langToggle');
    if(btn){
      btn.setAttribute('data-lang', lang);
      // show other language in small label
      btn.querySelectorAll('.lang-flag, .lang-label').forEach(function(n){ n.textContent = lang === 'es' ? 'ES' : 'EN'; });
      // aria pressed reflects current language (ES considered pressed when site is Spanish)
      try{ btn.setAttribute('aria-pressed', lang === 'es' ? 'true' : 'false'); }catch(e){}
      // accessible label to indicate action (switch to the other language)
      try{
        var toggleLabel = lang === 'es' ? (dict['aria.lang_toggle_to_en'] || 'Switch site language to English') : (dict['aria.lang_toggle_to_es'] || 'Switch site language to Spanish');
        btn.setAttribute('aria-label', toggleLabel);
      }catch(e){}
    }

    // announce language change for screen readers
    try{
      var announceText = dict['aria.lang_changed'] || (lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English');
      if(announcer) announcer.textContent = announceText;
    }catch(e){}
  }

  function loadFrom(u){
    console.info('[i18n] attempting to load translations from:', u);
    return fetch(u, { cache: 'no-cache' }).then(function(r){
      if(!r.ok){
        var err = new Error('HTTP ' + r.status + ' ' + r.statusText);
        err.response = r;
        err.status = r.status;
        throw err;
      }
      return r.text().then(function(text){
        try{
          return JSON.parse(text);
        }catch(e){
          var snippet = (text || '').slice(0, 512);
          var pe = new Error('Invalid JSON received from ' + u);
          pe.type = 'parse';
          pe.snippet = snippet;
          pe.originalError = e;
          throw pe;
        }
      });
    });
  }

  function init(){
    // Try primary (script-relative/override) URL first, then retry an absolute path as a fallback.
    loadFrom(url).catch(function(err){
      console.warn('[i18n] primary load failed for', url, err && (err.status || err.type) || err);
      // fallback to absolute path at site root
      var fallback = '/assets/i18n/translations.json';
      // if the base looks like an absolute origin, also try origin-based path
      try{
        if(window && window.location && url.indexOf(window.location.origin) === 0){
          fallback = window.location.origin + '/assets/i18n/translations.json';
        }
      }catch(e){}
      console.info('[i18n] retrying with fallback URL:', fallback);
      return loadFrom(fallback);
    }).then(function(json){
      translations = json;
      var lang = localStorage.getItem(storeKey) || (navigator.language && navigator.language.indexOf('en')===0 ? 'en' : 'es');
      if(!translations[lang]) lang = Object.keys(translations)[0];
      apply(lang);

      // attach toggle
      var btn = document.getElementById('langToggle');
      if(btn){
        btn.addEventListener('click', function(){
          var cur = document.documentElement.lang || lang;
          var next = cur === 'es' ? 'en' : 'es';
          localStorage.setItem(storeKey, next);
          apply(next);
        });
        // keyboard accessibility
        btn.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
      }

      // expose a tiny runtime accessor so other scripts (chatbot/main.js) can query translations
      try{
        window.SiteI18n = {
          t: function(key, fallback){
            if(!translations || !currentLang) return fallback || key;
            return (translations[currentLang] && translations[currentLang][key]) || fallback || key;
          },
          lang: function(){ return currentLang; }
        };
        // dispatch an event so other scripts can react when translations are ready
        try{ document.dispatchEvent(new CustomEvent('i18n:loaded', { detail: { lang: currentLang } })); }catch(e){}
      }catch(e){/* noop */}

    }).catch(function(finalErr){
      // If we reach here, both primary and fallback failed. Provide clear diagnostics in console.
      console.error('[i18n] Failed to load translations. See details below.');
      console.error(finalErr && finalErr.stack ? finalErr.stack : finalErr);
      if(finalErr && finalErr.snippet) console.error('[i18n] response snippet (truncated):\n', finalErr.snippet);
      // graceful fallback: expose a minimal SiteI18n that returns key/fallback so other scripts don't break
      try{
        window.SiteI18n = {
          t: function(key, fallback){ return fallback || key; },
          lang: function(){ return currentLang || (localStorage.getItem(storeKey) || 'es'); }
        };
        try{ document.dispatchEvent(new CustomEvent('i18n:loaded', { detail: { lang: window.SiteI18n.lang() } })); }catch(e){}
      }catch(e){}
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
