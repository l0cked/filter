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


HTMLElement.prototype.drag = function(options = {}) {

	if ( options.remove ) {
		this.removeEventListener('mousedown', onDown, false);
		return;
	}

	var self = this,
		moveObject = {},

	onMove = function(e) {

		var x = e.pageX,
			y = e.pageY;

		if ( !moveObject.move ) {

			if ( options.parent ) {
				var parent = self.parents(options.parent),
					parentCoords = parent.getCoords(),
					coords = self.getCoords(),
					moveX = x - coords.left,
					moveY = y - coords.top;

				if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
					return;
				}

				moveObject.shiftX = (parentCoords.left + 30) + (moveObject.downX - coords.left);
				moveObject.shiftY = (parentCoords.top + 30) + (moveObject.downY - coords.top);
			} else {
				var moveX = x - moveObject.downX,
					moveY = y - moveObject.downY,
					coords = self.getCoords();
				if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
					return;
				}
				moveObject.shiftX = moveObject.downX - coords.left;
				moveObject.shiftY = moveObject.downY - coords.top;
			}

			if ( options.setClass ) {
				self.classList.add(options.setClass);
			}

			moveObject.move = true;
		}

		self.style.left = x - moveObject.shiftX + 'px';
		self.style.top = y - moveObject.shiftY + 'px';

	},

	onUp = function() {
		document.removeEventListener('mousemove', onMove, false);
		document.removeEventListener('mouseup', onUp, false);

		if ( options.setClass ) {
			self.classList.remove(options.setClass);
		}

		if ( options.onDragEnd ) {
			options.onDragEnd(parseInt(self.style.left), parseInt(self.style.top));
		}

		moveObject.move = false;
	},

	onDown = function(e) {
		if ( !document.body.classList.contains('cloud-edit') ) return;

		if ( e.which != 1 ) return;

		if ( options.targetClass ) {
			if ( !e.target.classList.contains(options.targetClass) ) return;
		}

		moveObject.downX = e.pageX;
		moveObject.downY = e.pageY;
		document.addEventListener('mousemove', onMove, false);
		document.addEventListener('mouseup', onUp, false);

	};

	this.addEventListener('mousedown', onDown, false);
}

// RESIZE
HTMLElement.prototype.resize = function(options = {}) {

	var resizeElems = this.querySelectorAll('.cloud-resize');

	if ( options.remove ) {
		for ( var i = 0; i < resizeElems.length; i++ ) {
			resizeElems[i].removeEventListener('mousedown', onDown, false);
		}
		return;
	}

	var MIN_CLOUD_WIDTH = 300,
		MIN_CLOUD_HEIGHT = 300,
		RESIZE_SE_OFFSET = this.querySelector('.resize-se').offsetWidth / 2 || 0,
		self = this,
		resizeObject = {},

	onMove = function(e) {
		var w = e.pageX - resizeObject.coords.left + resizeObject.paddingRight,
			h = e.pageY - resizeObject.coords.top + resizeObject.paddingBottom;
		if ( resizeObject.this.classList.contains('resize-e') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				self.style.width = w + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-s') ) {
			if ( h > MIN_CLOUD_HEIGHT ) {
				self.style.height = h + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-se') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				self.style.width = w + RESIZE_SE_OFFSET + 'px';
			}
			if ( h > MIN_CLOUD_HEIGHT ) {
				self.style.height = h + RESIZE_SE_OFFSET + 'px';
			}
		}
	},

	onUp = function(e) {
		document.removeEventListener('mousemove', onMove, false);
		document.removeEventListener('mouseup', onUp, false);

		if ( options.onResizeEnd ) {
			options.onResizeEnd(parseInt(self.style.width), parseInt(self.style.height));
		}
	},

	onDown = function(e) {
		if ( !document.body.classList.contains('cloud-edit') ) return;

		if ( e.which != 1 ) return;

		resizeObject.coords = self.getCoords();
		resizeObject.this = this;

		document.addEventListener('mousemove', onMove, false);
		document.addEventListener('mouseup', onUp, false);
	};

	resizeObject.paddingRight = parseInt(window.getComputedStyle(this, null).getPropertyValue('padding-right'));
	resizeObject.paddingBottom = parseInt(window.getComputedStyle(this, null).getPropertyValue('padding-bottom'));

	for ( var i = 0; i < resizeElems.length; i++ ) {
		resizeElems[i].addEventListener('mousedown', onDown, false);
	}

}
