(function($) {

  function WackyStack(el, options) {
    var defaults = {
      classes: {
        cards: 'cards',
        card: 'card',
      },
      cardOffset: 15,
      cardScaleMultiplyer: .02,
      scrollThreshold: 1000,
    };

    this.options = $.extend(defaults, options);

    this.options.stackyClasses = {
      init: 'wackystack',
      cards: 'wackystack__cards',
      card: 'wackystack__card',
      cardIn: 'wackystack__card--in',
      cardOut: 'wackystack__card--out',
      cardCurrent: 'wackystack__card--current',
    }

    this.container = $(el);
    this.cards = $('.' + this.options.classes.cards, el);
    this.card = $('.' + this.options.classes.card, el);
    this.cardsH = this.cards.height();
    this.cardLen = this.card.length;
    this.currentIndex = 0;
    this.init();
  }

  WackyStack.prototype.init = function() {
    this.container.addClass(this.options.stackyClasses.init);
    this.cards.addClass(this.options.stackyClasses.cards);
    this.card.addClass(this.options.stackyClasses.card);
    this.card.first().addClass(this.options.stackyClasses.cardCurrent);
    this.setHeight();
    this.orderCards();
    this.attachScrollHander();
    this.attachResizeHander();
    this.attachAnimationHander();
  };

  WackyStack.prototype.setHeight = function() {
    this.container.height(this.options.scrollThreshold * (this.cardLen + 1))
  }

  WackyStack.prototype.recalculate = function() {
    this.cardsH = this.cards.height();
    this.cardLen = this.card.length;
  };

  WackyStack.prototype.orderCards = function() {
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

  WackyStack.prototype.reOrderCards = function() {
    var $current = this.card.eq(this.currentIndex);
    var oldIndex = this.currentIndex;
    for (var i = this.cardLen; i > 0; i--) {
      if (window.pageYOffset > (this.container.offset().top + (this.options.scrollThreshold * (i - 1)))) {
        this.currentIndex = i - 1;
        break;
      }
    }

    // Current has differed from currentIndex.
    if (!$current.is(this.card.eq(this.currentIndex))) {
      var playStateForward = this.currentIndex > oldIndex;

      // Remove Classes
      $current.removeClass(this.options.stackyClasses.cardCurrent);
      var $newCurrent = this.card.eq(this.currentIndex)
      if (playStateForward) {
        $current.addClass(this.options.stackyClasses.cardOut);
      }
      else {
        $newCurrent.addClass(this.options.stackyClasses.cardIn);
      }
      $newCurrent.addClass(this.options.stackyClasses.cardCurrent);

      this.orderCards();
    }
  }

  WackyStack.prototype.attachScrollHander = function() {
    var instance = this;
    $(window).on('scroll', function(e) {
      instance.reOrderCards();
    });
  }

  WackyStack.prototype.attachResizeHander = function() {
    var instance = this;
    $(window).on('resize', function(e) {
      instance.recalculate();
    });
  }

  WackyStack.prototype.attachAnimationHander = function() {
    var instance = this;
    this.card.on('animationend', function(e) {
      $(this).removeClass(instance.options.stackyClasses.cardIn);
      $(this).removeClass(instance.options.stackyClasses.cardOut);
    })
  }

  $.fn.wackystack = function(options) {
    options = options || {};
    return this.each(function() {
      this.wackystack = new WackyStack(this, options)
    });
  };
}(jQuery));
