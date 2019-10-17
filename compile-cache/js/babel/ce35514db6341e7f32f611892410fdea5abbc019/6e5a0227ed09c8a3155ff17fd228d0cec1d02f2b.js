Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getElement = getElement;

// eslint-disable-next-line import/prefer-default-export

function getElement(icon) {
  var element = document.createElement('a');

  element.classList.add('icon-' + icon);

  element.appendChild(document.createTextNode(''));

  return element;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9zdGF0dXMtYmFyL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdPLFNBQVMsVUFBVSxDQUFDLElBQVksRUFBZTtBQUNwRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUUzQyxTQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBUyxJQUFJLENBQUcsQ0FBQTs7QUFFckMsU0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRWhELFNBQU8sT0FBTyxDQUFBO0NBQ2YiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudChpY29uOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcblxuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYGljb24tJHtpY29ufWApXG5cbiAgZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXG5cbiAgcmV0dXJuIGVsZW1lbnRcbn1cbiJdfQ==