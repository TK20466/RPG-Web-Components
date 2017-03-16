var module = angular.module("starship", []);

module.directive("vehicle", function() {
    return {
        templateUrl: "/views/vehicle.html",
        replace: true,
        restrict: "E",
        transclude: true,
        scope: {
            model: "=?",
            name: "@",
            silhouette: "=?",
            speed: "=?",
            handling: "=?",
            fore: "=?",
            aft: "=?",
            port: "=?",
            starboard: "=?",
            armor: "=?",
            system: "=?",
            hull: "=?",
            hardpoints: "=?",
            sensorRange: "@",
            price: "@",
            rarity: "=?",
            hardpoints: "=?",
            passengers: "=?",
            crew: "@",
            encum: "=?",
            navicomputer: "=?",
            hyperdrive: "@",
            maker: "@",
            type: "@",
            ship: "@",
            consumables: "@"
        },
        controller: ["$scope", function($scope) {
            if ($scope.model == null) {
                $scope.model = {
                    name: $scope.name,
                    silhouette: $scope.silhouette || 3,
                    speed: $scope.speed || 1,
                    handling: $scope.handling || 0,
                    fore: $scope.fore || 0,
                    port: $scope.port || 0,
                    starboard: $scope.starboard || 0,
                    aft: $scope.aft || 0,
                    armor: $scope.armor || 0,
                    hull: $scope.hull || 10,
                    system: $scope.system || 6,
                    hardpoints: $scope.hardpoints || 0,
                    sensorRange: $scope.sensorRange || "Close",
                    price: $scope.price,
                    rarity: $scope.rarity,
                    passengers: $scope.passengers || 0,
                    crew: $scope.crew || "One pilot",
                    navicomputer: $scope.navicomputer == true ? "Yes" : "None" || "None",
                    hyperdrive: $scope.hyperdrive || "none",
                    maker: $scope.maker,
                    type: $scope.type,
                    ship: $scope.ship,
                    consumables: $scope.consumables,
                    encum: $scope.encum || 6,
                    weapons: []
                }
                if ($scope.model.handling > 0) $scope.model.handling = "+" + $scope.model.handling;
            }
        }]
    }
});


module.directive("vehicleStatbar", function() {
    return {
        templateUrl: "/views/vehicle-statbar.html",
        restrict: "E",
        scope: {
            model: "=model",
        },

        replace: true
    }
});

module.directive("defenseBlock", function() {
    return {
        templateUrl: "/views/defense-block.html",
        restrict: "E",
        scope: {
            model: "=model",
        },
        controller: ['$scope', function($scope){
            if ($scope.model && $scope.model.silhouette < 4) {
                $scope.model.port = "-";
                $scope.model.starboard = "-";
            }
        }],
        replace: true
    }
});


module.directive("starshipWeapon", ['$sce', function($sce) {
    return {
        transclude: true,
        reaplce: true,
        restrict: "E",
        scope: {
            name: "@",
            damage: "=",
            critical: "=?",
            range: "@",
            blast: "=?",
            ion: "=?",
            guided: "=?",
            breach: "=?",
            slowFiring: "=?slowFire",
            limitedAmmo: "=?ammo",
            fireArc: "=?arc"
        },
        link: function(scope, element, attrs, ctrl, transclude) {
           var weapon = {
               name: scope.name,
               damage: scope.damage,
               critical: scope.critical,
               range: scope.range || "Short",
               blast: scope.blast,
               ion: scope.ion,
               guided: scope.guided,
               ammo: scope.limitedAmmo,
               breach: scope.breach,
               slowFiring: scope.slowFiring,
               fireArc: scope.fireArc || "Forward"
           };
           transclude(scope, function(clone, scope) {
               var html = "";
               for (var i = 0; i < clone.length; i++)
                   html += clone[i].wholeText || clone[i].outerHTML;
               weapon.text = $sce.trustAsHtml(html);
           });
           var scoped = scope.$parent.$parent.model;

           if (scoped.weapons == null)
               scoped.weapons = [];
           scoped.weapons.push(weapon);
        }
    }
}]);


module.directive("starshipWeaponsBlock", ["getSkillStat", function(getStat) {
    return {
        templateUrl: "/views/starship-weapon.html",
        scope: {
            weapons: "=?weapons"
        },
        replace: true
    }
}]);
