var module = angular.module("character-sheet", []);

module.directive("characterSheet", function() {
    return {
        templateUrl: "/views/sheet.html",
        replace: true,
        scope: {
            fromTemplate: "@",
            model: "=?"
        },
        controller: ["$scope", "$http", function($scope, $http) {
            if ($scope.fromTemplate != null) {
               $scope.model = {a:1};
               $http.get("characters/" + $scope.fromTemplate + ".json")
                   .then(function(res){
                      $scope.model = res.data;
                   });
            }
            else if ($scope.model == null) {
                $scope.model = {
                }
            }
        }]
    }
});

module.directive("characterBlock", function() {
    return {
        templateUrl: "/views/sheet-charblock.html",
        replace: true,
        scope: {
            model: "="
        },
        link: ["$scope", function($scope) {
           debugger;
        }]
    }
});
