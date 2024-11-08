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

LanguagePicker.prototype._evt_click_language = function( evt ) {

    evt.preventDefault();

    var newSubdomain;

    var hostname = window.location.hostname.split('.');
    hostname.reverse();
    hostname = hostname[ 1 ] + '.' + hostname[ 0 ];

    if ( evt.currentTarget.getAttribute( 'data-prefix' ) === 'el' ) {

        newSubdomain = 'https://' + hostname + window.location.pathname;

    } else {

        newSubdomain = 'https://' + evt.currentTarget.getAttribute( 'data-prefix' ) + '.' + hostname + window.location.pathname;

    }

    if ( window.location.href === newSubdomain ) {

        this._evt_click_languageSwitcher();

    } else {

        window.location.href = newSubdomain;

    }

};