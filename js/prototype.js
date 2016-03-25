'use strict';

HTMLElement.prototype.getCoords = function() {
	var box = this.getBoundingClientRect();
	return {
		top: box.top,
		left: box.left,
		right: box.right,
		bottom: box.bottom
	}
}

HTMLElement.prototype.hasClass = function(className) {
	return this.classList.contains(className) ? true : false;
}

HTMLElement.prototype.toggleClass = function(className) {
	this.classList.contains(className)
		? this.classList.remove(className)
		: this.classList.add(className);
}

HTMLElement.prototype.shuffle = function() {
	for ( var i = this.children.length; i >= 0; i-- ) {
		this.appendChild(this.children[Math.random() * i | 0]);
	}
}

HTMLElement.prototype.parents = function(className) {
	var p = this.parentNode;
	while ( p !== null ) {
		p = p.parentNode;
		if ( p.classList.contains(className) ) {
			return p;
		}
	}
}

