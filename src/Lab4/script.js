(function () {
  function generateArray(size, min, max) {
    var arr = [];

    for (var i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return arr;
  }

  function generateSparseArray(size, min, max, undefinedCount) {
    var arr = generateArray(size, min, max);

    for (var i = 0; i < undefinedCount; i++) {
      var index = Math.floor(Math.random() * size);
      arr[index] = undefined;
    }

    return arr;
  }

  var normalArray = generateArray(100, 1, 100);
  var sparseArray = generateSparseArray(100, 1, 100, 8);

  console.log("NORMAL ARRAY:");
  console.log(normalArray);

  sortLib.bubble(normalArray, true);
  sortLib.selection(normalArray, true);
  sortLib.insertion(normalArray, true);
  sortLib.shell(normalArray, true);
  sortLib.quick(normalArray, true);

  console.log("SPARSE ARRAY:");
  console.log(sparseArray);

  sortLib.bubble(sparseArray, true);
  sortLib.selection(sparseArray, true);
  sortLib.insertion(sparseArray, true);
  sortLib.shell(sparseArray, true);
  sortLib.quick(sparseArray, true);

  console.log("DESCENDING CHECK:");
  sortLib.bubble(normalArray, false);
  sortLib.selection(normalArray, false);
  sortLib.insertion(normalArray, false);
  sortLib.shell(normalArray, false);
  sortLib.quick(normalArray, false);
})();