var app = angular.module('myApp', []);
app.controller('myController', function($scope, $timeout) {
  $scope.digitRows = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9]
  ];
  $scope.currentDigit = -1;
  $scope.score = 0;
  $scope.solveTade = function(number) {
    var arr = number.split("").sort();
    var sortedArray = [];
    var solvable = false;
    sortedArray.push(arr[0]);
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] != arr[i - 1]) {
        sortedArray.push(arr[i]);
      }
    }

    var bestGroupLength = 0;
    var bestGroupEndIdx;
    for (var groupEndIdx = sortedArray.length - 1; groupEndIdx >= 2; groupEndIdx--) {

      var groupLength = 0;
      for (i = groupEndIdx; i >= 0 && sortedArray[groupEndIdx] - sortedArray[i] <= 4; i--) {
        groupLength++;
      }

      if (groupLength >= 3) {
        if (groupLength > bestGroupLength) {
          bestGroupLength = groupLength;
          bestGroupEndIdx = groupEndIdx;
        }
        solvable = true;
      }
    }

    if (!solvable) {
      return "unsolvable";
    } else {
      if (bestGroupLength == 5) {
        return "no change";
      }

      var bestGroupStartIdx = bestGroupEndIdx - bestGroupLength + 1;
      var range = sortedArray[bestGroupEndIdx] - sortedArray[bestGroupStartIdx];
      var newDigits = "";
      var digitsToChange = number;

      for (idx = bestGroupEndIdx; idx >= bestGroupStartIdx; idx--) {
        if (idx < bestGroupEndIdx) {
          if (sortedArray[idx] != sortedArray[idx + 1] - 1) {
            var newDigit = sortedArray[idx + 1] - 1;
            newDigits += newDigit;
            bestGroupLength++;
            while (--newDigit != sortedArray[idx]) {
              newDigits += newDigit;
              bestGroupLength++;
            }
          }
        }
        digitsToChange = digitsToChange.replace(sortedArray[idx], "");
      }

      if (range == bestGroupLength + 1) {

        if (sortedArray[bestGroupEndIdx] < 5) {
          endNumber = sortedArray[bestGroupEndIdx];
          while (bestGroupLength < 5) {
            newDigits += (++endNumber);
            bestGroupLength++;
          }
        } else {
          beginNumber = sortedArray[bestGroupStartIdx];
          while (bestGroupLength < 5) {
            newDigits += (--beginNumber);
            bestGroupLength++;
          }
        }
      }
      return {
        "old": digitsToChange,
        "new": newDigits,
      };

    }

  };
  $scope.generateNumber = function() {};
  $scope.digitClicked = function(digit) {
    dig = $scope.plate[digit];

    if ($scope.numberOfChanges() < 2 || (dig.current != dig.oiginal)) {
      $scope.currentDigit = digit;
    }
    console.log($scope.currentDigit);
  };
  $scope.setValue = function(val) {
    $scope.plate[$scope.currentDigit].current = val;
    $scope.currentDigit = -1;
    if ($scope.isWon()) {
      if ($scope.numberOfChanges() == 1) {
        $scope.score += 150;
      } else {
        $scope.score += 100;
      }
      $scope.newGame();

    }
  };
  $scope.numberOfChanges = function() {
    var changeCount = 0;
    for (var i = 0; i < $scope.plate.length; i++) {
      var dig = $scope.plate[i];
      if (dig.current != dig.original) {
        changeCount++;
      }
    }
    return changeCount;
  };
  $scope.isWon = function() {
    var sorted = $scope.plate.slice(0).sort(function(a, b) {
      return a.current > b.current;
    });
    console.log("sorted", sorted);
    for (var i = 1; i < sorted.length; i++) {
      if (sorted[i].current != sorted[i - 1].current + 1) {
        return false;
      }
    }
    return true;
  };
  $scope.newGame = function(restart) {
   var five=[];
   var i;
    do {
      var end = Math.floor(Math.random() * 5) + 5;
      console.log(end);
      var range = [];
      for (i = 0; i < 5; i++) {
        range.push(end - i);
      }
      console.log(range);
      var three = "";

      for (i = 0; i < 3; i++) {
        var poolSize, randIdx;
        poolSize = range.length;
        randIdx = Math.floor(Math.random() * poolSize);
        three += range[randIdx];
        range.splice(randIdx, 1);
      }
      console.log(three);
      var two = Math.floor(Math.random() * 100);
      if (two < 10) two = "0" + two;

      console.log(two);
      five = (two + three).split("");
    } while ("0123456789".indexOf(five.sort().join("")) != -1);
    console.log(five);

    i = five.length;
    for (var j, x; i; j = Math.floor(Math.random() * i), x = five[--i], five[i] = five[j], five[j] = x);
    $scope.plate = [];
    for (i = 0; i < 5; i++) {
      var dig = parseInt(five[i], 10);
      $scope.plate.push({
        current: dig,
        original: dig
      });
    }
    $scope.currentDigit = -1;
    if (!$scope.gameStarted || restart) {
      $scope.time = 60;
      $scope.score = 0;
      $scope.gameStarted = true;
      if ($scope.p !== undefined) {
        if (typeof $scope.p.cancel != 'undefined') {
          //$scope.p.cancel();
        }
      }
      $scope.p = $timeout(function updateTime() {
        $scope.time -= 1;
        if ($scope.time === 0) {
          alert("game over");
        } else {
          $scope.p = $timeout(updateTime, 1000);
        }
      }, 1000);
    }
  };

});
