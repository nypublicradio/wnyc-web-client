/* Copied over from the WNYC iPhone app, and modified
  so we're not depending on Backbone for an animated icon in this here Ember app.

  Reorganized a little to make it easier for humans to understand,
  and to allow the passing in of some options.
*/

export default function(canvas, options) {
  /* --- Helper Functions --- */

  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(callback) { return setTimeout(callback, 1000/60); };

  function normalizeProgress(progress, start, end) {
    var span = end - start;
    if(progress < start) { return 0; }
    if(progress > end) { return 1; }
    return (progress - start) / span;
  }
  function cubicEaseIn(t) {
    return Math.pow(t,3);
  }
  function cubicEaseOut(t) {
    return Math.pow(t-1,3) + 1;
  }
  function cubicEaseInOut(t) {
    t /= 0.5;
    return t < 1 ? 1/2*Math.pow(t,3) : 1/2*(Math.pow(t-2,3) + 2);
  }


  /* --- Ringset class --- */

  function RingSet() {
    this.set = [];
  }
  RingSet.prototype ={
    render : function(ctx) {
      this.set.forEach(i => i.render(ctx));
    },
    update : function(progress) {
      this.set.forEach(i => {
        if (!i.update) { return; }
        i.update(progress);
      });
    }
  };

  /* --- Ring Class --- */

  function Ring(options) {
    this.center = options.center;
    this.radius = options.radius;
    this.width = options.width;
    this.centerAngle = options.angle;
    this.lineWidth = options.lineWidth;
    this.color = options.color;
    if(options.update) {
      this.update = options.update;
    }
  }

  Ring.prototype = {
    update : function(/*progress*/) {},
    render : function(ctx) {
      ctx.beginPath();
      ctx.arc(this.center[0], this.center[1], this.radius, this.centerAngle - this.width/2, this.centerAngle + this.width/2);
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  };

  /* --- Icon Class --- */

  Icon.prototype = {
    initialize : function() {
      // _.bindAll(this, 'animate');
      this.ringSet = new RingSet();
      this.active = true;
      this.stepFn = null;

      this._constructRings();
    },
    clear: function() {
      // clears the canvas
      this.canvas.width = this.canvas.width;
    },
    _constructRings : function() {
      var color         = this.options.color;
      var ringCenter    = this.options.center;
      var ringRadius    = this.options.radius;
      var ringLineWidth = this.options.lineWidth;
      var dotRadius     = this.options.dotRadius;
      var outerScale    = this.options.outerScale;
      var innerScale    = this.options.innerScale;

      var innerRing = new Ring({
        center : ringCenter,
        radius : ringRadius,
        width : Math.PI,
        centerAngle : Math.PI,
        lineWidth : ringLineWidth,
        color: color,
        update : function(progress) {
          var scaleFactor = innerScale;
          if(progress < 0.2) {
            this.radius = ringRadius + cubicEaseIn(normalizeProgress(progress, 0.0, 0.05)) * scaleFactor;
          } else if (progress > 0.85) {
            this.radius = ringRadius + (1 - cubicEaseOut(normalizeProgress(progress, 0.85, 0.9))) * scaleFactor;
          }
          if (progress) {
            this.centerAngle = Math.PI - 6 * Math.PI * cubicEaseInOut(normalizeProgress(progress, 0.15, 0.9));
          }
        }
      });
      var outerRing = new Ring({
        center : ringCenter,
        radius : ringRadius,
        width : Math.PI,
        centerAngle : 0,
        lineWidth : ringLineWidth,
        color: color,
        update : function(progress) {
          var scaleFactor = outerScale;
          if(progress < 0.2) {
            this.radius = ringRadius + cubicEaseIn(normalizeProgress(progress, 0.03, 0.13)) * scaleFactor;
          } else {
            this.radius = ringRadius + (1 - cubicEaseOut(normalizeProgress(progress, 0.8, 0.87))) * scaleFactor;
          }
          if (progress) {
            this.centerAngle = 0 - 6 * Math.PI * cubicEaseInOut(normalizeProgress(progress, 0.10, 0.85));
          }
        }
      });
      var circ = {
        render : function(ctx) {
          ctx.beginPath();
          ctx.arc(ringCenter[0], ringCenter[1], dotRadius, 0, 2*Math.PI);
          ctx.fillStyle = color || '#fff';
          ctx.fill();
        }
      };
      this.ringSet.set.push(innerRing);
      this.ringSet.set.push(outerRing);
      this.ringSet.set.push(circ);
    },

    animate : function(duration, callback) {
      // console.log('in animate');
      var start = null;
      var self = this;

      var stepFn = this.stepFn = function(timestamp) {
        // console.log('in step');
        self.clear();
        if(start === null) { start = timestamp; }
        var runningTime = timestamp - start;
        var progress = Math.min(1, runningTime/duration);

        self.ringSet.update(progress);
        self.ringSet.render(self.ctx);

        if(progress < 1) {
          requestAnimationFrame(stepFn);
        } else if(self.active) {
          callback(callback);
        } else {
          self.stepFn = null;
        }
      };

      requestAnimationFrame(stepFn);
    }
  };

  function Icon(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Assumes default size of 128 x 128, these used to be hard coded
    this.options = defaults(options, {
      color: "#777",
      radius: 20,
      lineWidth: 10,
      dotRadius: 25,
      width: 128,
      height: 128,
      outerScale: 24,
      innerScale: 12
    });

    this.options.center = [Math.floor(this.options.width / 2), Math.floor(this.options.height / 2)];

    if(this.initialize) { this.initialize.apply(this, arguments); }
  }

  return new Icon(canvas, options);
  
  function defaults(src, target) {
    Object.keys(target).forEach(k => {
      if (!src[k]) {
        src[k] = target[k];
      }
    });
    return src;
  }
}
