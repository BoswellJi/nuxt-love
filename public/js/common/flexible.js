(function flexible(window, document) {
  var docEl = document.documentElement;

  var designWidth = 375;
  var baseFontSize = 37.5;

  function setRemUnit() {
    var screenWidth = Math.min(docEl.clientWidth, window.innerWidth);
    var rem = (screenWidth / designWidth) * baseFontSize;
    docEl.style.fontSize = `${Math.min(rem, 75)}px`;
  }

  setRemUnit();

  window.addEventListener('resize', setRemUnit);
  window.addEventListener('load', setRemUnit);
})(window, document);
