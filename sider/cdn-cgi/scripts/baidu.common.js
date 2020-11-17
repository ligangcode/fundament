// CloudFlare: Common
// ===================

// We use Polyglot for translations
// ---------------------------------
// Polyglot.js (c) 2012 Airbnb, Inc.
//
// polyglot.js may be freely distributed under the terms of the BSD
// license. For all licensing information, details, and documention:
// http://airbnb.github.com/polyglot.js
//
// Polyglot.js is an I18n helper library written in JavaScript, made to
// work both in the browser and in Node. It provides a simple solution for
// interpolation and pluralization, based off of Airbnb's
// experience adding I18n functionality to its Backbone.js and Node apps.
//
// Polylglot is agnostic to your translation backend. It doesn't perform any
// translation; it simply gives you a way to manage translated phrases from
// your client- or server-side JavaScript application.
//
!function(e){"use strict";function t(e){e=e||{},this.phrases=e.phrases||{},this.currentLocale=e.locale||"en"}function n(e){return"shared.pluralize."+e}function o(e){var t,n,r,i={};for(t in e)if(e.hasOwnProperty(t)){n=e[t];for(r in n)i[n[r]]=t}return i}function u(e){var t=/^\s+|\s+$/g;return e.replace(t,"")}function a(e,t,n){var i,s,o;return n!=null&&e?(s=e.split(r),o=s[l(t,n)]||s[0],i=u(o)):i=e,i}function f(e){var t=o(s);return t[e]||t.en}function l(e,t){return i[f(e)](t)}function c(e,t){for(var n in t)n!=="_"&&t.hasOwnProperty(n)&&(e=e.replace(new RegExp("%\\{"+n+"\\}","g"),t[n]));return e}function h(t){e.console&&e.console.warn&&e.console.warn("WARNING: "+t)}function p(e){var t={};for(var n in e)t[n]=e[n];return t}t.VERSION="0.2.0",t.prototype.locale=function(e){return e&&(this.currentLocale=e),this.currentLocale},t.prototype.extend=function(e){for(var t in e)e.hasOwnProperty(t)&&(this.phrases[t]=e[t])},t.prototype.clear=function(){this.phrases={}},t.prototype.replace=function(e){this.clear(),this.extend(e)},t.prototype.t=function(e,t){var n;t=t||{};var r=this.phrases[e]||t._||"";return r===""?(h('Missing translation for key: "'+e+'"'),n=e):(t=p(t),t.smart_count!=null&&t.smart_count.length!=null&&(t.smart_count=t.smart_count.length),n=a(r,this.currentLocale,t.smart_count),n=c(n,t)),n},t.prototype.pluralize=function(e,t){t!=null&&t.length!=null&&(t=t.length);var r=n(e);return this.t(r,{smart_count:t})};var r="||||",i={chinese:function(e){return 0},german:function(e){return e!==1?1:0},french:function(e){return e>1?1:0},russian:function(e){return e%10===1&&e%100!==11?0:e%10>=2&&e%10<=4&&(e%100<10||e%100>=20)?1:2},czech:function(e){return e===1?0:e>=2&&e<=4?1:2},polish:function(e){return e===1?0:e%10>=2&&e%10<=4&&(e%100<10||e%100>=20)?1:2},icelandic:function(e){return e%10!==1||e%100===11?1:0}},s={chinese:["id","ja","ko","ms","th","tr","zh"],german:["da","de","en","es","fi","el","he","hu","it","nl","no","pt","sv"],french:["fr","tl"],russian:["hr","ru"],czech:["cs"],polish:["pl"],icelandic:["is"]};typeof module!="undefined"&&module.exports?module.exports=t:e.Polyglot=t}(this);

(function($, Polyglot, window, navigator, undefined){
	var polyglot = new Polyglot();

	// Process tranlations
	function translate( json ){
		if( !json ){ return false; }
		polyglot.extend( json );
		$.each( polyglot.phrases, function( key, val ){ $('[data-translate='+key+']').html( val ); });
	}

	// Piece links back together if they were split apart
	function unobfuscateLinks(){
		$('a[data-orig-ref]').each(function(){
			var $el = $(this),
				proto = $el.data('orig-proto') || '',
				url = $el.data('orig-ref') || '';

			url = (proto.length ? proto+'://' : '') + url;
			$el.attr('href', url );
		});
	}

	$('html')
		// Let everything know that JS is ready/enabled
		.toggleClass('no-js js')
		// Hide all HTML content until the DOM is ready (used to prevent translation text from flashing)
		.css({ 'visibility' : 'hidden', 'opacity': 0 });

	// Once the DOM is ready
	$(function(){
		var alertContainer = $('<label/>',{'class':'alert alert-error'}),
			languageSelect = $('#lang-selector');

		// Process translations if it exists
		if( window._cf_translation ){
			// Setup the translation object, run through all translations, and show the body again
			polyglot.locale = window._cf_translation.locale;
			translate( window._cf_translation.blobs );

			languageSelect.val( polyglot.locale );
		}

		// Translate obfuscated links back to clickable links.
		unobfuscateLinks();

		// Show the page to the user
		$('html').css({ 'opacity': 1, 'visibility' : 'visible' });

		// Go grab the requested language
		languageSelect.on('change', function( evt ){
			var lang = evt.target.value;
			if( lang ){
				$.getJSON('/cdn-cgi/scripts/lang/waf/'+lang+'.json', function( data ){
					polyglot.locale = lang;
					translate( data );
				});
			}
		});

		// If cookies aren't enabled, let the visitor know
		if( !navigator.cookieEnabled ){
			$('#cookie-alert').show();
		}
	});

})( window.$, window.Polyglot, window, navigator );
