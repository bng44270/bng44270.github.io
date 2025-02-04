/*

usage:
  > var thisRange = new Range(1,6);
  > thisRange
  [1, 2, 3, 4, 5, 6]
  > thisRange.inIn(3)
  true
  > thisRange.isIn(100)
  false
*/

class Range extends Array {
  constructor(first,last) {
    super(last - first + 1);
    var val = first;
    for (var i = 0; i < this.length; i++) {
      this[i] = val;
      val++;
    }
  }
  isIn(v) {
    return (v >= this[0] && v <= this[this.length - 1]);
  }
}
