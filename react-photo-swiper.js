/* globals screen MouseEvent TouchEvent */
"use strict";

(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(
      require("react/addons"),
      require("swiper")
    );
  } else {
    root.ReactPhotoSwiper = factory(
      root.React,
      root.Swiper
    );
  }
})(this, function (React, Swiper) {
  var styles = {
    container: {
    },

    wrapper: {
      alignItems: "center"
    },

    child: {
    }
  };

  var defaults = {
    screenHeight: 1080,
    threshold: 300,
    minSpeed: 0.5
  };

  var ReactPhotoSwiper = React.createClass({
    // http://www.idangero.us/swiper/api
    propTypes: {
      simulateTouch: React.PropTypes.bool,
      initialSlide: React.PropTypes.number,
      preloadImages: React.PropTypes.bool,
      lazyLoading: React.PropTypes.bool,
      lazyLoadingInPrevNext: React.PropTypes.bool,
      lazyLoadingOnTransitionStart: React.PropTypes.bool
    },

    componentDidMount: function () {

      if (this.isMounted()) {
        var verticalSwiper = Swiper(this.getDOMNode(), { direction: "vertical" });
        this.swiper = Swiper(".swiper-container-h", this.props);

        this.bindSwiperEvents(verticalSwiper);
      }
    },

    componentWillUnmount: function () {
      this.swiper.destroy();
      delete this.swiper;
    },

    shouldComponentUpdate: function (nextProps) {
      return (typeof this.props.shouldUpdate !== "undefined") && this.props.shouldUpdate(nextProps);
    },

    render: function() {
      return React.createElement("div", { className: "swiper-container swiper-container-v" },
        React.createElement("div", { className: "swiper-wrapper" },
          React.createElement("div", { className: "swiper-slide" },
            React.createElement("div", React.__spread({}, this.props, {style: styles.container, className: "swiper-container swiper-container-h"}),
              React.createElement("div", {style: styles.wrapper, className: "swiper-wrapper"},
                React.Children.map(this.props.children, function (child) {
                  return React.addons.cloneWithProps(child, { style: styles.child, className: "swiper-slide" });
                })
              )
      ))));
    },

    bindSwiperEvents: function(swiperInstance) {
      var startTouchPoint = null;
      var isCloseMove = false;
      var startTime = 0;
      var touchStarted = false;
      var touchInProgress = false;

      swiperInstance.on("touchStart", function(swiper, event) {
        startTouchPoint = this.getPointFromEvent(event);
        startTime = event.timeStamp;
        touchStarted = true;
      }.bind(this));

      swiperInstance.on("touchMove", function(swiper, event) {
        if (!touchStarted) { return; }
        var movePoint = this.getPointFromEvent(event);

        if (!touchInProgress) {
          isCloseMove = this.detectCloseMove(startTouchPoint, movePoint);
          touchInProgress = true;
        }

        if (isCloseMove && this.props.onclosemove) {
          var dy = Math.abs(movePoint.y - startTouchPoint.y);
          var height = screen ? screen.height : defaults.screenHeight;
          this.props.onclosemove(dy / height);
        }
      }.bind(this));

      swiperInstance.on("touchEnd", function(swiper, event) {
        if (this.props.onclosemove) {
          this.props.onclosemove(0);
        }

        if (!this.props.onclose) { return; }
        if (!isCloseMove) { return; }

        var endPoint = this.getPointFromEvent(event);
        var endTime = event.timeStamp;
        if (this.detectCloseGesture(startTouchPoint, endPoint, startTime, endTime)) {
          this.props.onclose();
        }

        isCloseMove = false;
        touchStarted = false;
        touchInProgress = false;
      }.bind(this));
    },

    detectCloseGesture: function(startPoint, endPoint, startTime, endTime) {
      var threshold = screen ? screen.height / 2 : defaults.threshold;
      var dx = endPoint.x - startPoint.x;
      var dy = endPoint.y - startPoint.y;
      var dt = endTime - startTime;
      var speed = Math.abs(dy) / dt;

      return Math.abs(dy) > Math.abs(dx) && (Math.abs(dy) > threshold || speed > defaults.minSpeed);
    },

    detectCloseMove: function(startPoint, movePoint) {
      var dx = movePoint.x - startPoint.x;
      var dy = movePoint.y - startPoint.y;
      return Math.abs(dy) > Math.abs(dx);
    },

    getPointFromEvent: function(event) {
      var screenX = null;
      var screenY = null;
      if (event instanceof MouseEvent) {
        screenX = event.screenX;
        screenY = event.screenY;
      } else if (event instanceof TouchEvent) {
        screenX = event.changedTouches[0].screenX;
        screenY = event.changedTouches[0].screenY;
      }
      return { x: screenX, y: screenY };
    }

  });

  return ReactPhotoSwiper;
});
