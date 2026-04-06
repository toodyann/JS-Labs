(function (window) {
  var sortLib = {};

  function prepareArray(input) {
    var undefinedCount = 0;
    var result = [];

    for (var i = 0; i < input.length; i++) {
      if (input[i] === undefined) {
        undefinedCount++;
      } else {
        result.push(input[i]);
      }
    }

    return {
      array: result,
      undefinedCount: undefinedCount
    };
  }

  function restoreUndefined(sorted, undefinedCount) {
    var result = sorted.slice();

    for (var i = 0; i < undefinedCount; i++) {
      result.push(undefined);
    }

    return result;
  }

  function shouldSwap(a, b, asc) {
    return asc ? a > b : a < b;
  }

  function printResult(methodName, originalLength, prepared, sorted, comparisons, moves, asc) {
    console.log("====================================");
    console.log("Method:", methodName);
    console.log("Order:", asc ? "Ascending" : "Descending");
    console.log("Original length:", originalLength);
    console.log("Sorted array:", sorted);
    console.log("Comparisons:", comparisons);
    console.log("Moves/Swaps:", moves);

    if (prepared.undefinedCount > 0) {
      console.log("Warning: undefined elements were found and restored at the end.");
      console.log("Undefined count:", prepared.undefinedCount);
      console.log("Length without undefined:", prepared.array.length);
    }
  }

  sortLib.bubble = function (input, asc) {
    if (asc === undefined) asc = true;

    var prepared = prepareArray(input);
    var arr = prepared.array.slice();
    var comparisons = 0;
    var moves = 0;

    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = 0; j < arr.length - 1 - i; j++) {
        comparisons++;
        if (shouldSwap(arr[j], arr[j + 1], asc)) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          moves++;
        }
      }
    }

    arr = restoreUndefined(arr, prepared.undefinedCount);

    printResult("Bubble sort", input.length, prepared, arr, comparisons, moves, asc);
    return arr;
  };

  sortLib.selection = function (input, asc) {
    if (asc === undefined) asc = true;

    var prepared = prepareArray(input);
    var arr = prepared.array.slice();
    var comparisons = 0;
    var moves = 0;

    for (var i = 0; i < arr.length - 1; i++) {
      var selectedIndex = i;

      for (var j = i + 1; j < arr.length; j++) {
        comparisons++;
        if (shouldSwap(arr[selectedIndex], arr[j], asc)) {
          selectedIndex = j;
        }
      }

      if (selectedIndex !== i) {
        var temp = arr[i];
        arr[i] = arr[selectedIndex];
        arr[selectedIndex] = temp;
        moves++;
      }
    }

    arr = restoreUndefined(arr, prepared.undefinedCount);

    printResult("Selection sort", input.length, prepared, arr, comparisons, moves, asc);
    return arr;
  };

  sortLib.insertion = function (input, asc) {
    if (asc === undefined) asc = true;

    var prepared = prepareArray(input);
    var arr = prepared.array.slice();
    var comparisons = 0;
    var moves = 0;

    for (var i = 1; i < arr.length; i++) {
      var key = arr[i];
      var j = i - 1;

      while (j >= 0) {
        comparisons++;
        if (shouldSwap(arr[j], key, asc)) {
          arr[j + 1] = arr[j];
          moves++;
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      moves++;
    }

    arr = restoreUndefined(arr, prepared.undefinedCount);

    printResult("Insertion sort", input.length, prepared, arr, comparisons, moves, asc);
    return arr;
  };

  sortLib.shell = function (input, asc) {
    if (asc === undefined) asc = true;

    var prepared = prepareArray(input);
    var arr = prepared.array.slice();
    var comparisons = 0;
    var moves = 0;

    for (var gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (var i = gap; i < arr.length; i++) {
        var temp = arr[i];
        var j = i;

        while (j >= gap) {
          comparisons++;
          if (shouldSwap(arr[j - gap], temp, asc)) {
            arr[j] = arr[j - gap];
            moves++;
            j -= gap;
          } else {
            break;
          }
        }

        arr[j] = temp;
        moves++;
      }
    }

    arr = restoreUndefined(arr, prepared.undefinedCount);

    printResult("Shell sort", input.length, prepared, arr, comparisons, moves, asc);
    return arr;
  };

  function quickSortRecursive(arr, left, right, asc, stats) {
    if (left >= right) {
      return;
    }

    var i = left;
    var j = right;
    var pivot = arr[Math.floor((left + right) / 2)];

    while (i <= j) {
      if (asc) {
        while (arr[i] < pivot) {
          stats.comparisons++;
          i++;
        }
        stats.comparisons++;

        while (arr[j] > pivot) {
          stats.comparisons++;
          j--;
        }
        stats.comparisons++;
      } else {
        while (arr[i] > pivot) {
          stats.comparisons++;
          i++;
        }
        stats.comparisons++;

        while (arr[j] < pivot) {
          stats.comparisons++;
          j--;
        }
        stats.comparisons++;
      }

      if (i <= j) {
        if (i !== j) {
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          stats.moves++;
        }
        i++;
        j--;
      }
    }

    if (left < j) {
      quickSortRecursive(arr, left, j, asc, stats);
    }

    if (i < right) {
      quickSortRecursive(arr, i, right, asc, stats);
    }
  }

  sortLib.quick = function (input, asc) {
    if (asc === undefined) asc = true;

    var prepared = prepareArray(input);
    var arr = prepared.array.slice();
    var stats = {
      comparisons: 0,
      moves: 0
    };

    if (arr.length > 1) {
      quickSortRecursive(arr, 0, arr.length - 1, asc, stats);
    }

    arr = restoreUndefined(arr, prepared.undefinedCount);

    printResult("Quick sort (Hoare)", input.length, prepared, arr, stats.comparisons, stats.moves, asc);
    return arr;
  };

  window.sortLib = sortLib;
})(window);
