function StackyDack(el, options) {
  var defaults = {
    classes: {
      cards: 'cards',
      card: 'card',
      init: 'stackydack',
    },
    cardOffset: 15,
    cardScaleMultiplyer: .02
  };

  defaults.classes.cardCurrent = defaults.classes.card + '--current';
  defaults.classes.cardOut = defaults.classes.card + '--out';
  defaults.classes.cardIn = defaults.classes.card + '--in';

  this.options = $.extend(defaults, options);
  this.container = $(el);
  this.cards = $('.' + this.options.classes.cards, el);
  this.card = $('.' + this.options.classes.card, el);
  this.cardsH = this.cards.height();
  this.cardLen = this.card.length;
  this.currentIndex = 0;
  this.init();
}

StackyDack.prototype.init = function() {
  this.container.addClass(this.options.classes.init);
  this.card.first().addClass(this.options.classes.cardCurrent);
  this.setHeight();
  this.orderCards();
  this.attachScrollHander();
  this.attachResizeHander();
  this.attachAnimationHander();

  // el.addEventListener("animationstart", function() {}, false);
  // el.addEventListener("animationend", function() {}, false);
};

StackyDack.prototype.setHeight = function() {
  this.container.height(this.cardsH * (this.cardLen + 1))
}

StackyDack.prototype.recalculate = function() {
  this.cardsH = this.cards.height();
  this.cardLen = this.card.length;
};

StackyDack.prototype.orderCards = function(animation) {
  animation = animation || false;
  // var $current = this.card.eq(this.currentIndex);

  // $current.removeClass(this.options.classes.cardCurrent);
  // this.card.eq(this.currentIndex).addClass(this.options.classes.cardCurrent);


  var zIndex = this.cardLen;
  for (var i = 0; i < this.cardLen; i++) {
    var index = (i + this.currentIndex)%this.cardLen
    var $currentCardInLoop = this.card.eq(index);
    var offset = -this.options.cardOffset * (this.cardLen - zIndex);
    var scale = 1 - ((this.cardLen - zIndex) * this.options.cardScaleMultiplyer)
    $currentCardInLoop.css('z-index', zIndex)
    $currentCardInLoop.css('transform', 'translateY(-50%) translateY(' + offset + 'px) scale(' + scale + ')')
    zIndex--
  }
}

StackyDack.prototype.reOrderCards = function() {
  var $current = this.card.eq(this.currentIndex);
  var oldIndex = this.currentIndex;
  // var change = false;

  for (var i = this.cardLen; i > 0; i--) {
    if (window.pageYOffset > (this.container.offset().top + (this.cardsH * (i - 1)))) {
      this.currentIndex = i - 1;
      break;
    }
  }
  
  // Current has differed from currentIndex.
  if (!$current.is(this.card.eq(this.currentIndex))) {
    var playStateForward = this.currentIndex > oldIndex;

    // Remove Classes
    $current.removeClass(this.options.classes.cardCurrent);

    var $newCurrent = this.card.eq(this.currentIndex)

    if (playStateForward) {
      $current.addClass(this.options.classes.cardOut);
    }
    else {
      $newCurrent.addClass(this.options.classes.cardIn);
    }

    $newCurrent.addClass(this.options.classes.cardCurrent);
 

    var zIndex = this.cardLen;
    for (var i = 0; i < this.cardLen; i++) {
      var index = (i + this.currentIndex)%this.cardLen
      var $currentCardInLoop = this.card.eq(index);
      var offset = -this.options.cardOffset * (this.cardLen - zIndex);
      var scale = 1 - ((this.cardLen - zIndex) * this.options.cardScaleMultiplyer)
      $currentCardInLoop.css('z-index', zIndex)
      $currentCardInLoop.css('transform', 'translateY(-50%) translateY(' + offset + 'px) scale(' + scale + ')')
      zIndex--
    }
  }
}

StackyDack.prototype.attachScrollHander = function() {
  var instance = this;
  $(window).on('scroll', function(e) {
    instance.reOrderCards();
  });
}

StackyDack.prototype.attachResizeHander = function() {
  var instance = this;
  $(window).on('resize', function(e) {
    instance.recalculate();
  });
}

StackyDack.prototype.attachAnimationHander = function() {
  var instance = this;
  this.card.on('animationend', function(e) {
    $(this).removeClass(instance.options.classes.cardIn);
    $(this).removeClass(instance.options.classes.cardOut);
  })
}




$.fn.stackydack = function(options) {

  options = options || {};

  return this.each(function() {
      
    this.stackydack = new StackyDack(this, options)

  });
};

$('.container').stackydack();

