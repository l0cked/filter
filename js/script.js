'use strict';

/* Cloud obj */

var Cloud = function(elem) {
	var self = this;
	this.divCloudWrapper = elem;
	this.init = function() {

		this.divCloudWrapper.onmousedown = this.moveOnMouseDown;

		this.cloudResizeAll = this.divCloudWrapper.querySelectorAll('.cloud-resize');
		for ( var i = 0; i < this.cloudResizeAll.length; i++ ) {
			this.cloudResizeAll[i].onmousedown = this.resizeOnMouseDown;
		}

		this.divCloudWrapper.querySelector('.click-shuffle').onclick = function() {
			self.redraw();
		}
		this.divCloudItems = this.divCloudWrapper.querySelector('.cloud-items');
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
		this.move = true;
		this.moveObject = {};
		this.MIN_CLOUD_WIDTH = 300;
		this.MIN_CLOUD_HEIGHT = 300;
	}

	this.moveOnMouseDown = function(e) {
		if ( e.which != 1 ) return;
		if ( !document.body.classList.contains('cloud-edit') ) return;
		if ( !e.target.classList.contains('cloud-items') ) return;
		self.moveObject.downX = e.pageX;
		self.moveObject.downY = e.pageY;
		self.move = true;
		document.onmousemove = self.onMouseMove;
		document.onmouseup = self.onMouseUp;
		return false;
	}

	this.resizeOnMouseDown = function(e) {
		if ( e.which != 1 ) return;
		self.resizeObject.coords = self.divCloudWrapper.getCoords();
		self.resizeObject.paddingRight = parseInt(window.getComputedStyle(self.divCloudWrapper, null).getPropertyValue('padding-right')),
		self.resizeObject.paddingBottom = parseInt(window.getComputedStyle(self.divCloudWrapper, null).getPropertyValue('padding-bottom'));
		self.resizeObject.this = this;
		self.resize = true;
		document.onmousemove = self.onMouseMove;
		document.onmouseup = self.onMouseUp;
		return false;
	}

	this.onMouseMove = function(e) {
		if ( self.move ) {
			if ( !self.moveObject.move ) {
				var moveX = e.pageX - self.moveObject.downX,
					moveY = e.pageY - self.moveObject.downY,
					coords = self.divCloudWrapper.getCoords();
				if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
					return;
				}
				self.moveObject.move = true;
				self.moveObject.shiftX = self.moveObject.downX - coords.left;
				self.moveObject.shiftY = self.moveObject.downY - coords.top;
			}
			self.divCloudWrapper.style.left = e.pageX - self.moveObject.shiftX + 'px';
			self.divCloudWrapper.style.top = e.pageY - self.moveObject.shiftY + 'px';
		}
		if ( self.resize ) {
			var w = e.pageX - self.resizeObject.coords.left  + self.resizeObject.paddingRight,
				h = e.pageY - self.resizeObject.coords.top + self.resizeObject.paddingBottom;
			if ( self.resizeObject.this.classList.contains('resize-e') ) {
				if ( w > self.MIN_CLOUD_WIDTH ) {
					self.divCloudWrapper.style.width = w + 'px';
				}
			}
			if ( self.resizeObject.this.classList.contains('resize-s') ) {
				if ( h > self.MIN_CLOUD_HEIGHT ) {
					self.divCloudWrapper.style.height = h + 'px';
				}
			}
			if ( self.resizeObject.this.classList.contains('resize-se') ) {
				if ( w > self.MIN_CLOUD_WIDTH ) {
					self.divCloudWrapper.style.width = w + 'px';
				}
				if ( h > self.MIN_CLOUD_HEIGHT ) {
					self.divCloudWrapper.style.height = h + 'px';
				}
			}
		}
		return false;
	}

	this.onMouseUp = function() {
		document.onmousemove = null;
		document.onmouseup = null;
		if ( self.move ) {
			self.move = false;
			self.moveObject = {};
		}
		if ( self.resize ) {
			self.redraw();
			self.resize= false;
			self.resizeObject = {};
		}
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
			item.onclick = function(e) {
				var coords = this.getCoords();
				this.classList.add('item-edit');
				console.log(coords);
			}
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

		var divCloudWrapperAll = document.querySelectorAll('.cloud-wrapper');

		imgElem.removeAttribute('data-src');
		imgElem.setAttribute('src', this.src);

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
