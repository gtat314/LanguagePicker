/**
 * 
 * @param {Object}                   schema
 * @param {HTMLElement|CSSRule}      schema.parent
 * @param {Boolean}                 [schema.htmlReady]
 * @param {SVGElement}              [schema.icon]
 * @param {Object[]}                [schema.blocks]
 * @param {URL}                      schema.blocks[].href
 * @param {String}                   schema.blocks[].prefix
 * @param {SVGElement}               schema.blocks[].icon
 * @param {HTMLSourceElement}        schema.blocks[].title
 * @param {HTMLSourceElement}        schema.blocks[].subtitle
 */
function LanguagePicker( schema ) {

    /**
     * @property
     * @private
     * @type {HTMLElement|null}
     */
    this._parentElem = null;

    /**
     * @property
     * @private
     * @type {HTMLElement|null}
     */
    this._switcherElem = null;

    /**
     * @property
     * @private
     * @type {HTMLElement|null}
     */
    this._listElem = null;




    if ( typeof schema.parent === 'object' ) {

        this._parentElem = schema.parent;

    } else if ( typeof schema.parent === 'string' ) {

        this._parentElem = document.querySelector( schema.parent );

    }

    if ( schema.hasOwnProperty( 'htmlReady' ) && schema.htmlReady === true ) {

        this._createFromHTML();

    } else {

        this._createFromSchema( schema );

    }

    this._switcherElem.addEventListener( 'click', this._evt_click_languageSwitcher.bind( this ) );
    this._parentElem.addEventListener( 'click', this._evt_click_languageWrapper.bind( this ) );

};




LanguagePicker.prototype._createFromHTML = function() {

    this._switcherElem  = this._parentElem.querySelector( '.switcherElem' );
    this._listElem      = this._parentElem.querySelector( '.listElem' );
    var blockElems      = this._parentElem.querySelectorAll( 'a' );
    var blockElemsNum   = blockElems.length;

    for ( var i = 0 ; i < blockElemsNum ; i++ ) {

        blockElems[ i ].addEventListener( 'click', this._evt_click_language.bind( this ) );

    }

};

LanguagePicker.prototype._createFromSchema = function( schema ) {

    var fragment = document.createDocumentFragment();

    this._switcherElem = document.createElement( 'SPAN' );
    this._switcherElem.classList.add( 'switcherElem' );
    this._switcherElem.innerHTML = schema.icon;
    fragment.appendChild( this._switcherElem );

    this._listElem = document.createElement( 'DIV' );
    this._listElem.classList.add( 'listElem' );
    fragment.appendChild( this._listElem );

    for ( var i = 0 ; i < schema.blocks.length ; i++ ) {

        var blockElem = document.createElement( 'A' );
        blockElem.setAttribute( 'href', schema.blocks[ i ].href );
        blockElem.setAttribute( 'data-prefix', schema.blocks[ i ].prefix );
        blockElem.setAttribute( 'aria-label', schema.blocks[ i ].title );
        this._listElem.appendChild( blockElem );

        blockElem.addEventListener( 'click', this._evt_click_language.bind( this ) );

        var iconElem = document.createElement( 'DIV' );
        iconElem.classList.add( 'iconElem' );
        iconElem.innerHTML = schema.blocks[ i ].icon;
        blockElem.appendChild( iconElem );

        var textElem = document.createElement( 'DIV' );
        textElem.classList.add( 'text' );
        blockElem.appendChild( textElem );

        var h3Elem = document.createElement( 'H3' );
        h3Elem.innerHTML = schema.blocks[ i ].title;
        textElem.appendChild( h3Elem );

        var pElem = document.createElement( 'P' );
        pElem.innerHTML = schema.blocks[ i ].subtitle;
        textElem.appendChild( pElem );

        if ( i < schema.blocks.length - 1 ) {

            var hrElem = document.createElement( 'HR' );
            this._listElem.appendChild( hrElem );

        }

    }

    this._parentElem.appendChild( fragment );

};

LanguagePicker.prototype._evt_click_languageWrapper = function( evt ) {

    if ( evt.target === evt.currentTarget ) {

        this._evt_click_languageSwitcher();

    }

};

LanguagePicker.prototype._evt_click_languageSwitcher = function() {

    if ( this._switcherElem.classList.contains( 'active' ) ) {

        this._switcherElem.classList.remove( 'active' );
        this._listElem.classList.remove( 'active' );
        this._parentElem.classList.remove( 'active' );

    } else {

        this._switcherElem.classList.add( 'active' );
        this._listElem.classList.add( 'active' );
        this._parentElem.classList.add( 'active' );

    }

};

/**
 * Handles the language selection event when a user clicks on a language picker.
 * This function redirects the user to the appropriate language subfolder (e.g., "/en/", "/fr/") based on the selected language.
 * If the selected language is Greek (or the default language), it does not add a language subfolder and redirects to the root path.
 * 
 * ### Flow:
 * 1. Prevents the default behavior of the click event.
 * 2. Gets the selected language prefix (e.g., 'en', 'el') from the clicked element.
 * 3. Analyzes the current path of the URL to check if a language subfolder is already present.
 * 4. If the current path has a language prefix, it removes the existing language prefix.
 * 5. If the selected language is Greek ('el'), the function redirects to the root path (no subfolder).
 * 6. For other languages, the function adds the selected language as a subfolder to the path.
 * 7. Ensures that the homepage (i.e., the root) gets redirected correctly with a trailing slash (e.g., from 'https://example.com' to 'https://example.com/en/').
 * 8. If the new URL is different from the current one, it redirects the user to the new language URL.
 * 
 * @param {Event} evt - The click event triggered by the user selecting a language.
 */
LanguagePicker.prototype._evt_click_language = function( evt ) {

    evt.preventDefault();

    var selectedPrefix = evt.currentTarget.getAttribute( 'data-prefix' );

    var currentPath = window.location.pathname;

    // Check if the current path already has a language prefix
    var pathSegments = currentPath.split( '/' );

    // Remove empty string at the start if path starts with '/'
    if ( pathSegments[0] === '' ) {

        pathSegments.shift();

    }

    // Check if we need to remove the current language prefix (if any)
    var knownLangs = [ 'en', 'el' ]; // Add all your supported language codes here

    if ( knownLangs.indexOf( pathSegments[0] ) !== -1 ) {

        pathSegments.shift(); // Remove current language prefix

    }

    // If the selected language is Greek (or the default), don't add any subfolder
    var newPath;

    if ( selectedPrefix === 'el' ) {

        newPath = '/' + pathSegments.join( '/' );

    } else {

        // Add the selected language as a subfolder
        pathSegments.unshift( selectedPrefix );

        newPath = '/' + pathSegments.join( '/' );
    }

    // Ensure trailing slash for index page (homepage case)
    if ( newPath === '/' + selectedPrefix ) {

        newPath += '/';

    }

    var newUrl = window.location.origin + newPath;

    // Redirect only if the new URL is different
    if ( window.location.href === newUrl ) {

        this._evt_click_languageSwitcher();

    } else {

        window.location.href = newUrl;

    }

};