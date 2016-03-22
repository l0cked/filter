'use strict';

function draggable(elem, options={}) {

	if ( options.remove ) {
		elem.onmousedown = null;
		return;
	}

	var moveObject = {},

	onMouseMove = function(e) {
		if ( !moveObject.move ) {
			var moveX = e.pageX - moveObject.downX,
				moveY = e.pageY - moveObject.downY,
				coords = elem.getCoords();
			if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
				return;
			}
			moveObject.move = true;
			moveObject.shiftX = moveObject.downX - coords.left;
			moveObject.shiftY = moveObject.downY - coords.top;
		}
		elem.style.left = e.pageX - moveObject.shiftX + 'px';
		elem.style.top = e.pageY - moveObject.shiftY + 'px';
	},

	onMouseUp = function(e) {
		document.onmousemove = null;
		document.onmouseup = null;

		if ( options.onDragEnd ) {
			options.onDragEnd(parseInt(elem.style.left), parseInt(elem.style.top));
		}

		moveObject = {};
	};

	elem.onmousedown = function(e) {
		if ( e.which != 1 ) return;

		if ( options.targetClass ) {
			if ( !e.target.classList.contains(options.targetClass) ) return;
		}

		moveObject.downX = e.pageX;
		moveObject.downY = e.pageY;
		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;
	}
}


function resizeable(elem, options={}) {

	var resizeElems = elem.querySelectorAll('.cloud-resize');

	if ( options.remove ) {
		for ( var i = 0; i < resizeElems.length; i++ ) {
			resizeElems[i].onmousedown = null;
		}
		return;
	}

	var MIN_CLOUD_WIDTH = 300,
		MIN_CLOUD_HEIGHT = 300,
		RESIZE_SE_OFFSET =5,
		resizeObject = {},

	onMouseMove = function(e) {
		var w = e.pageX - resizeObject.coords.left + resizeObject.paddingRight,
			h = e.pageY - resizeObject.coords.top + resizeObject.paddingBottom;
		if ( resizeObject.this.classList.contains('resize-e') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				elem.style.width = w + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-s') ) {
			if ( h > MIN_CLOUD_HEIGHT ) {
				elem.style.height = h + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-se') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				elem.style.width = w + RESIZE_SE_OFFSET + 'px';
			}
			if ( h > MIN_CLOUD_HEIGHT ) {
				elem.style.height = h + RESIZE_SE_OFFSET + 'px';
			}
		}
	},

	onMouseUp = function(e) {
		document.onmousemove = null;
		document.onmouseup = null;

		if ( options.onResizeEnd ) {
			options.onResizeEnd(parseInt(elem.style.width), parseInt(elem.style.height));
		}
	},

	onMouseDown = function(e) {
		if ( e.which != 1 ) return;

		resizeObject.coords = elem.getCoords();
		resizeObject.this = this;

		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;
	};

	resizeObject.paddingRight = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-right'));
	resizeObject.paddingBottom = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-bottom'));

	for ( var i = 0; i < resizeElems.length; i++ ) {
		resizeElems[i].onmousedown = onMouseDown;
	}

}

/* Cloud obj */

var Cloud = function(elem) {

	var self = this,
		lsname = 'cloud' + [].indexOf.call(elem.parentNode.children, elem) + '-',

	// set default .cloud-wrapper position and sizes if not set
	defWindowSizes = function() {

		var def = {
			width: 500,
			height: 500
		}

		def.left = (document.body.offsetWidth / 2) - (def.width / 2);
		def.top = (document.body.offsetHeight / 2) - (def.height / 2);

		if ( !elem.style.left ) elem.style.left = def.left + 'px';
		if ( !elem.style.top ) elem.style.top = def.top + 'px';
		if ( !elem.style.width ) elem.style.width = def.width + 'px';
		if ( !elem.style.height ) elem.style.height = def.height + 'px';
	},

	loadLocalStorage = function() {
		if ( localStorage[lsname + 'left'] ) {
			elem.style.left = localStorage[lsname + 'left'] + 'px';
		}
		if ( localStorage[lsname + 'top'] ) {
			elem.style.top = localStorage[lsname + 'top'] + 'px';
		}
		if ( localStorage[lsname + 'width'] ) {
			elem.style.width = localStorage[lsname + 'width'] + 'px';
		}
		if ( localStorage[lsname + 'height'] ) {
			elem.style.height = localStorage[lsname + 'height'] + 'px';
		}
	};

	loadLocalStorage();
	defWindowSizes();

	this.init = function() {

		elem.querySelector('.click-shuffle').onclick = function() {
			self.redraw();
		}

		this.divCloudItems = elem.querySelector('.cloud-items');
		this.items = this.divCloudItems.querySelectorAll('.item');
		this.width = this.divCloudItems.offsetWidth;
		this.height = this.divCloudItems.offsetHeight;
		this.center = {
			x: this.width / 2,
			y: this.height / 2
		};
		this.aspect_ratio = this.width / this.height;
		this.busy = false;
		this.radius = 0;
		this.angle = 6.28 * Math.random();
		this.step = 0.15;
		this.elements = [];

		this.resize = false;
		this.resizeObject = {};

		// const =)
		this.MIN_CLOUD_WIDTH = 300;
		this.MIN_CLOUD_HEIGHT = 300;

		draggable(elem, {
			targetClass: 'cloud-items',
			onDragEnd: function(left, top) {
				localStorage[lsname + 'left'] = left;
				localStorage[lsname + 'top'] = top;
			}
		});

		resizeable(elem, {
			onResizeEnd: function(width, height) {
				self.redraw();
				localStorage[lsname + 'width'] = width;
				localStorage[lsname + 'height'] = height;
			}
		});

		//console.dir(this);

	}

	this.isOverride = function(a, b) {
		var ar = {
				left: a.left,
				top: a.top,
				right: a.left + a.width,
				bottom: a.top + a.height,
			},
			br = {
				left: b.left,
				top: b.top,
				right: b.left + b.width,
				bottom: b.top + b.height,
			}
		return !(
			br.left > ar.right ||
			br.right < ar.left ||
			br.top > ar.bottom ||
			br.bottom < ar.top
		);
	}
	this.hitTest = function(index) {
		for ( var i in this.elements ) {
			if ( index == i ) continue; // if delete this str = infinity loop
			if ( this.isOverride(this.elements[index], this.elements[i]) ) {
				return true;
			}
		}
		return false;
	}
	this.beforeDraw = function() {
		for ( var i = 0; i < this.items.length; i++ ) {
			var item = this.items[i],
				width = item.offsetWidth,
				height = item.offsetHeight,
				left = this.center.x - width / 2,
				top = this.center.y - height / 2;
			this.elements[i] = {
				pos: i,
				left: left,
				top: top,
				width: width,
				height: height
			}
			while ( this.hitTest(i) ) {
				this.radius += this.step;
				this.angle += (i % 2 === 0 ? 1 : -1) * this.step;
				left = this.center.x - (width / 2) + (this.radius * Math.cos(this.angle)) * this.aspect_ratio;
				top = this.center.y + this.radius * Math.sin(this.angle) - (height / 2);
				left = Math.round(left * 100) / 100;
				top = Math.round(top * 100) / 100;
				this.elements[i] = {
					pos: i,
					left: left,
					top: top,
					width: width,
					height: height
				}
			}
		}
	}
	this.draw = function() {
		this.init();
		this.beforeDraw();
		for ( var i in this.elements ) {
			var element = this.elements[i],
				item = this.items[element.pos],
				x = element.left,
				y = element.top;
			item.style.left = x + 'px';
			item.style.top = y + 'px';
			item.classList.add('item-show');
			/*item.onclick = function(e) {
				var coords = this.getCoords();
				this.classList.add('item-edit');
				console.log(coords);
			}*/
		}
		this.busy = false;
		return this;
	}
	this.redraw = function() {
		if ( !this.busy ) {
			this.busy = true;
			this.divCloudItems.shuffle();
			this.draw();
		}
	}
}

/* Cloud obj end */

/* main */

var clouds = {};

function load() {

	var imgElem = document.querySelector('.bg-img'),
		img = new Image();
	img.src = imgElem.getAttribute('data-src');
	img.onload = function() {

		imgElem.removeAttribute('data-src');
		imgElem.setAttribute('src', this.src);

		var divCloudWrapperAll = document.querySelectorAll('.cloud-wrapper');

		for ( var i = 0; i < divCloudWrapperAll.length; i++ ) {

			clouds[i] = new Cloud(divCloudWrapperAll[i]);
			clouds[i].draw();

		}

		document.body.classList.add('load');

	}
}

document.addEventListener('DOMContentLoaded', load);

/* main-menu */

var mainMenu = document.querySelector('.main-menu');

mainMenu.querySelector('.click-shuffle').onclick = function() {
	for( var i in clouds ) {
		clouds[i].redraw();
	}
}

mainMenu.querySelector('.click-edit').onclick = function() {
	document.body.toggleClass('cloud-edit');
	this.toggleClass('active');
}
