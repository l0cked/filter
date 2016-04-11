'use strict';

var draggable = function(elem, options={}) {

	if ( options.remove ) {
		elem.removeEventListener('mousedown', onDown, false);
		return;
	}

	var moveObject = {},

	onMove = function(e) {

		var x, y;

		if ( e.type == 'touchmove' ) {
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		} else

		if ( e.type == 'mousemove' ) {
			x = e.pageX;
			y = e.pageY;
		}

		if ( !moveObject.move ) {

			if ( options.parent ) {
				var parent = moveObject.elem.parents(options.parent), // touch error !!!
					parentCoords = parent.getCoords(),
					coords = elem.getCoords(),
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
					coords = elem.getCoords();
				if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
					return;
				}
				moveObject.shiftX = moveObject.downX - coords.left;
				moveObject.shiftY = moveObject.downY - coords.top;
			}

			if ( options.setClass ) {
				elem.classList.add(options.setClass);
			}

			moveObject.move = true;
		}

		elem.style.left = x - moveObject.shiftX + 'px';
		elem.style.top = y - moveObject.shiftY + 'px';

	},

	onUp = function() {
		document.removeEventListener('mousemove', onMove, false);
		document.removeEventListener('mouseup', onUp, false);

		if ( options.setClass ) {
			elem.classList.remove(options.setClass);
		}

		if ( options.onDragEnd ) {
			options.onDragEnd(parseInt(elem.style.left), parseInt(elem.style.top));
		}

		moveObject = {};
	},

	onDown = function(e) {
		if ( !document.body.classList.contains('cloud-edit') ) return;

		if ( e.type != 'touchstart' && e.which != 1 ) return;

		if ( options.targetClass ) {
			if ( !e.target.classList.contains(options.targetClass) ) return;
		}

		moveObject.elem = this;

		if ( e.type == 'touchstart' ) {
			moveObject.downX = e.changedTouches[0].pageX;
			moveObject.downY = e.changedTouches[0].pageY;
			document.addEventListener('touchmove', onMove, false);
			document.addEventListener('touchend', onUp, false);
		} else

		if ( e.type == 'mousedown' ) {
			moveObject.downX = e.pageX;
			moveObject.downY = e.pageY;
			document.addEventListener('mousemove', onMove, false);
			document.addEventListener('mouseup', onUp, false);
		}

	};

	elem.addEventListener('mousedown', onDown, false);
	elem.addEventListener('touchstart', onDown, false);
}


var resizeable = function(elem, options={}) {

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
		if ( !document.body.classList.contains('cloud-edit') ) return;

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

	var

	self = this,

	MIN_CLOUD_WIDTH = 300,
	MIN_CLOUD_HEIGHT = 300,

	//lsname = 'cloud' + [].indexOf.call(elem.parentNode.children, elem) + '-',
	lsname = 'cloud-',

	divCloudItems = elem.querySelector('.cloud-items'),
	items = divCloudItems.querySelectorAll('.item'),
	width = divCloudItems.offsetWidth,
	height = divCloudItems.offsetHeight,
	center = {
		x: width / 2,
		y: height / 2
	},
	aspect_ratio = width / height,
	busy = false,
	radius = 0,
	angle = 6.28 * Math.random(),
	step = 0.15,
	elements = [],

	init = function() {
		items = divCloudItems.querySelectorAll('.item');
		width = divCloudItems.offsetWidth;
		height = divCloudItems.offsetHeight;
		center = {
			x: width / 2,
			y: height / 2
		};
		aspect_ratio = width / height;
		radius = 0;
		angle = 6.28 * Math.random();
		step = 0.15;
		elements = [];
	},

	isOverride = function(a, b) {
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
	},

	hitTest = function(index) {
		for ( var i in elements ) {
			if ( index == i ) continue; // if delete this str = infinity loop
			if ( isOverride(elements[index], elements[i]) ) {
				return true;
			}
		}
		return false;
	},

	beforeDraw = function() {
		for ( var i = 0; i < items.length; i++ ) {
			var item = items[i],
				w = item.offsetWidth,
				h = item.offsetHeight,
				left = center.x - w / 2,
				top = center.y - h / 2;
			elements[i] = {
				pos: i,
				left: left,
				top: top,
				width: w,
				height: h
			}
			while ( hitTest(i) ) {
				radius += step;
				angle += (i % 2 === 0 ? 1 : -1) * step;
				left = center.x - (w / 2) + (radius * Math.cos(angle)) * aspect_ratio;
				top = center.y + radius * Math.sin(angle) - (h / 2);
				left = Math.round(left * 100) / 100;
				top = Math.round(top * 100) / 100;
				elements[i] = {
					pos: i,
					left: left,
					top: top,
					width: w,
					height: h
				}
			}
		}
	},

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
	},

	draw = function() {

		divCloudItems.shuffle();

		init();
		beforeDraw();

		for ( var i in elements ) {
			var element = elements[i],
				item = items[element.pos],
				x = element.left,
				y = element.top;
			item.style.left = x + 'px';
			item.style.top = y + 'px';
			item.classList.add('item-show');
			draggable(item, {
				parent: 'cloud-wrapper',
				setClass: 'item-on-drag'
			});
		}
	};

	this.draw = draw;

	loadLocalStorage();
	defWindowSizes();

	// cloud-menu .shuffle
	elem.querySelector('.click-shuffle').onclick = function() {
		self.draw();
	}

	draggable(elem, {
		targetClass: 'cloud-items',
		onDragEnd: function(left, top) {
			localStorage[lsname + 'left'] = left;
			localStorage[lsname + 'top'] = top;
		}
	});

	resizeable(elem, {
		onResizeEnd: function(width, height) {
			self.draw();
			localStorage[lsname + 'width'] = width;
			localStorage[lsname + 'height'] = height;
		}
	});

	draw();

}

/* Cloud obj end */

/* main */

var divCloudWrapperAll = document.querySelectorAll('.cloud-wrapper'),
	clouds = {};

function load() {

	var imgElem = document.querySelector('.bg-img'),
		img = new Image();
	img.src = imgElem.getAttribute('data-src');
	img.onload = function() {

		imgElem.removeAttribute('data-src');
		imgElem.setAttribute('src', this.src);

		for ( var i = 0; i < divCloudWrapperAll.length; i++ ) {
			clouds[i] = new Cloud(divCloudWrapperAll[i]);
		}
		document.body.classList.add('load');

	}
}

document.addEventListener('DOMContentLoaded', load);

/* main-menu */

var mainMenu = document.querySelector('.main-menu');

mainMenu.querySelector('.click-shuffle').onclick = function() {
	for ( var i in clouds ) {
		clouds[i].draw();
	}
}

mainMenu.querySelector('.click-edit').onclick = function() {
	document.body.toggleClass('cloud-edit');
	this.toggleClass('active');
}
