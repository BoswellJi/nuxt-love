(function flexible(window, document) {
  const docEl = document.documentElement;

  const designWidth = 375;
  const baseFontSize = 37.5;

  function setRemUnit() {
    const screenWidth = Math.min(docEl.clientWidth, window.innerWidth);
    const rem = (screenWidth / designWidth) * baseFontSize;
    docEl.style.fontSize = `${Math.min(rem, 75)}px`;
  }

  setRemUnit();

  window.addEventListener('resize', setRemUnit);
  window.addEventListener('load', setRemUnit);
})(window, document);
