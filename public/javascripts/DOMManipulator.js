class DOMManipulator {
	showElement(element) {
		if (element.className.indexOf('hidden')) {
			element.className = element.className.replace(/\b hidden\b/, '');
		}
	}

	hideElement(element) {
		element.className += ' hidden';
	}

	toggleElements(first, second) {
		this.showElement(first);
		this.hideElement(second);
	}

	createBlock(className) {
		var $block = document.createElement('div');
		$block.className = className || '';
		return $block;
	}

	createText(text, className) {
		var $textBlock = document.createElement('span');
		$textBlock.innerText = text;
		$textBlock.className = className || '';
		return $textBlock;
	}

	createInput(text, className) {
		var $input = document.createElement('input');
		$input.value = text;
		$input.className = className || '';
		return $input;
	}

	createButton(text, className) {
		var $button = document.createElement('button');
		$button.innerText = text;
		$button.className = className || '';
		return $button;
	}

	createCheckbox(value, className) {
		var $checkbox = document.createElement('input');
		$checkbox.type = 'checkbox';
		$checkbox.checked = value;
		$checkbox.className = className;
		return $checkbox;
	}

	getClosest( elem, selector ) {
	    // Element.matches() polyfill
	    if (!Element.prototype.matches) {
	        Element.prototype.matches =
	            Element.prototype.matchesSelector ||
	            Element.prototype.mozMatchesSelector ||
	            Element.prototype.msMatchesSelector ||
	            Element.prototype.oMatchesSelector ||
	            Element.prototype.webkitMatchesSelector ||
	            function(s) {
	                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	                    i = matches.length;
	                while (--i >= 0 && matches.item(i) !== this) {}
	                return i > -1;
	            };
	    }

	    // Get closest match
	    for ( ; elem && elem !== document; elem = elem.parentNode ) {
	        if ( elem.matches( selector ) ) return elem;
	    }

	    return null;
	}
}