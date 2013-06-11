(function() {
  d3.sticker = function(selector) {
    var string;
    var sticker = function(selector) {
      //Serialize the selected element into a string
      var el = d3.select(selector).node();
      string = new XMLSerializer().serializeToString(el);
      //check if our element is SVG
      if(el && d3_isSVG(el)) {
        sticker.isSVG = true;
        //this could be undefined if the el is an svg element:
        sticker.svgElement = el.ownerSVGElement; 
      }
      return sticker;
    }
    //use this with .select on a selection to append and select at the same time
    sticker.node = function() {
      var fragment;
      if(sticker.isSVG && sticker.svgElement) {
        fragment = d3_makeSVGFragment(string, sticker.svgElement);
      } else {
        fragment = d3_makeFragment(string);
      }
      if(!this.appendChild) return fragment;
      return this.appendChild(fragment);
    }
    //append a copy of the sticker to the selection
    sticker.append = function(selection) {
      if(!string) return selection;
      return selection.select(function() {
        var fragment;
        if(sticker.isSVG && sticker.svgElement) {
          fragment = d3_makeSVGFragment(string, sticker.svgElement);
        } else {
          fragment = d3_makeFragment(string);
        }
        return this.appendChild(fragment);
      });
    }
    //insert a copy of the sticker into a selection similar to the d3 insert API 
    sticker.insert = function(selection, before) {
      if(!string) return selection;
      return selection.select(before).select(function() {
        var fragment;
        if(sticker.isSVG && sticker.svgElement) {
          fragment = d3_makeSVGFragment(string, sticker.svgElement);
        } else {
          fragment = d3_makeFragment(string);
        }
        return this.parentNode.insertBefore(fragment, this);
      });
    }
    
    sticker.string = function(_) {
      if(!arguments.length) return string;
      string = _;
      return sticker;
    }
    sticker.toString = function() {
      return string;
    }
    if(selector) {
      return sticker(selector);
    }
    return sticker;
  }
  

  function d3_isSVG(el) {
    return !!el.ownerSVGElement || el.tagName === "svg";
  }
  function d3_makeFragment(fragment) {
    var range = document.createRange()
    return range.createContextualFragment(fragment);
  }
  function d3_makeSVGFragment(fragment, svgElement) {
    //we need to wrap our element in a temporarary intermediate svg element
    //so that the browser knows to instanciate the Node properly.
    //for some reason having the range select an svg element isn't enough.
    // TODO: Allow optional namespace declarations
    var pre = '<svg xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink>';
    var post = '</svg>';
    var range = document.createRange();
    range.selectNode(svgElement);
    var contextFragment = range.createContextualFragment(pre + fragment + post)
    var intermediateSvg = contextFragment.childNodes[0]
    var node = intermediateSvg.childNodes[0]
    return node;
  }
}());
