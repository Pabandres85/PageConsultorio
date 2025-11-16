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

  var base = getBasePath();
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

  function init(){
    fetch(url).then(function(r){ return r.json(); }).then(function(json){
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

    }).catch(function(err){ console.warn('Could not load translations', err); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
