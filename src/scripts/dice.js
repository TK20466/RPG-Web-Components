var app = angular.module("swrpgwc", ["starship", "jdf.ngThemeSwitcher", 'ngStorage']);

app.controller("ThemeController", function($scope, $localStorage, $location) {
   $scope.currentLocation = function() { return $location.path(); }
   $scope.themes = [
        { name:'EoE', description: 'Edge of Empire Theme', url:'/styles/swrpgeoe.min.css' },
        { name:'AoR', description: 'Age of Rebellion Theme', url:'/styles/swrpgaor.min.css' },
	{ name:'FaD', description: 'Force and Destiny Theme', url:'/styles/swrpgfad.min.css' }
   ];
   
   $scope.$storage = $localStorage.$default({
	   theme: $scope.themes[0]
   });

   $scope.setTheme = function(theme) {
	   if (theme.name !== $scope.theme.name) {
		   $scope.theme = theme;
		   $scope.$storage.theme = theme;
	   }
   };

   $scope.theme = $scope.$storage.theme;
});

app.directive("skills", function() {
    return {
        replace: true,
        restrict: "E",
        link: function ($scope, $element, $attributes) {
            if($scope.$parent.model.skills == null)
                $scope.$parent.model.skills = {};
            $scope.skills = $scope.$parent.model.skills;
        }
    }
});

app.directive("skillsBlock", function() {
    return {
        templateUrl: "/views/skills.html",
        replace: true,
        restrict: "E",
        link: function ($scope, $element, $attributes) {
            $scope.skills = $scope.model.skills;
            $scope.skillKeys = function() {
                var keys = [];
                for (k in $scope.model.skills) {
                    keys.push(k);
                }
                return keys.sort();
            }
            $scope.char = $scope.model;
            $scope.getAttr = function(key) {
                return $scope.char[$scope.skills[key].attribute];
            }
        }
    }
});


app.directive("skill", function() {
    return {
        templateUrl: "/views/skill.html",
        replace: true,
        restrict: "E",
        scope: {
            name: "=",
            rank: "=",
            abty: "=",
            minion: "=?",
            hideRank: "=?"
        },
        controller: ["$scope", function($scope) {
            $scope.pdice = new Array($scope.rank);
            if ($scope.abty > $scope.rank) {
                $scope.adice = new Array($scope.abty - $scope.rank);
                $scope.pdice = new Array($scope.rank);
            }
            else {
                $scope.adice = new Array($scope.rank - $scope.abty);
                $scope.pdice = new Array(Math.min($scope.rank, $scope.abty));
                /*var promote = Math.floor($scope.adice.length/2);
                for (var i = 0; i < promote; i++) {
                    $scope.pdice.push("");
                    $scope.adice.pop();
                    $scope.adice.pop();
                }*/
            }
        }]
    }
});

app.directive("statblock", function() {
    return {
        templateUrl: "/views/statblock.html",
        scope: {
            value: "=value",
            display: "@display"
        },
        replace: true
    }
});

app.directive('dynamic', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
}]);

app.directive("talentBlock", function() {
    return {
        templateUrl: "/views/talents.html",
        scope: {
            talents: "=?talents"
        },
        replace: true
    }
});

app.directive("talents", ['$sce', function($sce) {
    return {
       transclude: true,
       restrict: "E",
       link: function(scope, element, attrs, ctrl, transclude) {
           transclude(scope, function(clone, scope) {
               var html = "";
               for (var i = 0; i < clone.length; i++)
                   html += clone[i].wholeText || clone[i].outerHTML;
               scope.$parent.model.talents = $sce.trustAsHtml(html);
           });
       }
    }
}]);


app.directive("abilitiesBlock", function() {
    return {
        templateUrl: "/views/abilities.html",
        scope: {
            abilities: "=?abilities"
        },
        replace: true
    }
});

app.directive("equipmentBlock", ["getSkillStat", function(getStat) {
    return {
        templateUrl: "/views/equipment.html",
        scope: {
            equipment: "=?equipment"
        },
        controller: ["$scope", function($scope) {
            $scope.getRank = function(skill) {
                if ($scope.$parent.skills[skill] == undefined)
                    return 0;
                return $scope.$parent.skills[skill].rank;
            }
            $scope.getAbility = function(skill) {
                var attr = getStat(skill);
                return $scope.$parent.model[attr];
            }
            $scope.isMinion = function() {
                return $scope.$parent.rank == "minion";
            }
        }],
        replace: true
    }
}]);

app.directive("abilities", ['$sce', function($sce) {
    return {
       transclude: true,
       restrict: "E",
       link: function(scope, element, attrs, ctrl, transclude) {
           transclude(scope, function(clone, scope) {
               var html = "";
               for (var i = 0; i < clone.length; i++)
                   html += clone[i].wholeText || clone[i].outerHTML;
               scope.$parent.model.abilities = $sce.trustAsHtml(html);
           });
       }
    }
}]);

app.directive("weapon", ['$sce', function($sce) {
    return {
        transclude: true,
        reaplce: true,
        restrict: "E",
        scope: {
            name: "@",
            skill: "@",
            damage: "=",
            critical: "=?",
            range: "@",
            blast: "=?",
            stun: "=?",
            quantity: "=?",
            pierce: "=?",
            vicious: "=?",
            autoFire: "=?autoFire",
            limitedAmmo: "=?ammo"
        },
        link: function(scope, element, attrs, ctrl, transclude) {
           var weapon = {
               name: scope.name,
               skill: scope.skill,
               damage: scope.damage,
               critical: scope.critical,
               range: scope.range,
               blast: scope.blast,
               quantity: scope.quantity,
               pierce: scope.pierce,
               ammo: scope.limitedAmmo,
               autoFire: scope.autoFire,
               vicious: scope.vicious
           };
           transclude(scope, function(clone, scope) {
               var html = "";
               for (var i = 0; i < clone.length; i++)
                   html += clone[i].wholeText || clone[i].outerHTML;
               weapon.text = $sce.trustAsHtml(html);
           });
           var scoped = scope.$parent.$parent.model;

           if (scoped.equipment == null)
               scoped.equipment = {};
           if (scoped.equipment.weapons == null)
               scoped.equipment.weapons = [];
           scoped.equipment.weapons.push(weapon);
        }
    }
}])

app.directive("detailBlock", function() {
    return {
        templateUrl: "/views/detailblock.html",
        scope: {
            value: "=value",
            display: "@display"
        },
        replace: true
    }
});

app.directive("detailbar", function() {
    return {
        templateUrl: "/views/detailbar.html",
        scope: {
            model: "=model"
        },
        replace: true
    }
});

app.directive("statbar", function() {
    return {
        templateUrl: "/views/statbar.html",
        scope: {
            model: "=model",
        },
        replace: true
    }
});

app.directive("die", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        scope: {
            symbol: "@type",
        },
        restrict: "E",
        replace: true
    }
});

app.directive("setback", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "setback";
        }]
    }
});
app.directive("boost", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "boost";
        }]
    }
});
app.directive("ability", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "ability";
        }]
    }
});
app.directive("difficulty", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "difficulty";
        }]
    }
});
app.directive("challenge", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "challenge";
        }]
    }
});
app.directive("proficiency", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "proficiency";
        }]
    }
});
app.directive("success", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "success";
        }]
    }
});
app.directive("failure", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "failure";
        }]
    }
});
app.directive("advantage", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "advantage";
        }]
    }
});
app.directive("threat", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "threat";
        }]
    }
});
app.directive("triumph", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "triumph";
        }]
    }
});
app.directive("despair", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "despair";
        }]
    }
});

app.directive("force", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "force";
        }]
    }
});

app.directive("lightSide", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "lightSide";
        }]
    }
});

app.directive("darkSide", function() {
    return {
        templateUrl: "/views/diesymbol.html",
        replace: true,
        scope: {

        },
        restrict: "E",
        controller: ['$scope', function($scope) {
            $scope.symbol = "darkSide";
        }]
    }
});

app.directive("check", function() {
    return {
        templateUrl: "/views/check.html",
        replace: true,
        scope: {
            skill: "@skill",
            dif: "@dif",
            chg: "@chg",
        },
        controller: ['$scope', function($scope) {
            var dif = parseInt($scope.dif);
            $scope.difficulty_text = "";
            $scope.pdice = new Array(parseInt(dif));
            if ($scope.chg) {
                $scope.cdice = new Array(parseInt($scope.chg));
                dif += parseInt($scope.chg);
            }

            $scope.dif = dif;

            switch(dif) {
                case 0: {
                    $scope.difficulty_text = "Simple";
                    break;
                }
                case 1: {
                    $scope.difficulty_text = "Easy";
                    break;
                }
                case 2: {
                    $scope.difficulty_text = "Average";
                    break;
                }
                case 3: {
                    $scope.difficulty_text = "Hard";
                    break;
                }
                case 4: {
                    $scope.difficulty_text = "Daunting";
                    break;
                }
                default: {
                    $scope.difficulty_text = "Formidable";
                    break;
                }
            }
        }]
    }
});

app.directive("npc", function() {
    return {
        templateUrl: "/views/npc.html",
        replace: true,
        transclude: true,
        scope: {
            model: "=?",
            name: "@",
            rank: "@",
            brawn: "=?",
            agility: "=?",
            intellect: "=?",
            cunning: "=?",
            willpower: "=?",
            presence: "=?",
            wounds: "=?",
            soak: "=?",
            strain: "=?"
        },
        controller: ["$scope", function($scope) {
            if ($scope.model == null) {
                $scope.model = {
                    name: $scope.name,
                    rank: $scope.rank || "rival",
                    brawn: $scope.brawn || 1,
                    agility: $scope.agility || 1,
                    intellect: $scope.intellect || 1,
                    cunning: $scope.cunning || 1,
                    willpower: $scope.willpower || 1,
                    presence: $scope.presence || 1,
                    wounds: $scope.wounds || 10,
                    soak: $scope.soak,
                    strain: $scope.strain,
                    skills: {}
                }
            }
        }]
    }
});

app.directive("blackbox", function() {
    return {
        templateUrl: "/views/blackbox.html",
        replace: true,
        transclude: true,
        scope: {
            header: "@title"
        }
    }
});
app.directive("narrative", function() {
    return {
        templateUrl: "/views/redbox.html",
        replace: true,
        transclude: true,
        restrict: "E",
        scope: {
            header: "@title"
        }
    }
});


var skillsTree = function() { return [{name: "Astrogation",           attribute: "intellect",              },
{name: "Athletics",               attribute: "brawn",              },
{name: "Charm",                   attribute: "presence",              },
{name: "Coercion",                attribute: "willpower",            },
{name: "Computers",               attribute: "intellect",             },
{name: "Cool",                    attribute: "presence",              },
{name: "Coordination",            attribute: "agility",              },
{name: "Deception",               attribute: "cunning",             },
{name: "Discipline",              attribute: "willpower",            },
{name: "Leadership",              attribute: "presence",              },
{name: "Mechanics",               attribute: "intellect",             },
{name: "Medicine",                attribute: "intellect",             },
{name: "Negotiation",             attribute: "presence",              },
{name: "Perception",              attribute: "cunning",             },
{name: "Piloting (Planetary)",    attribute: "agility",              alias: "pilotingPlanetary"},
{name: "Piloting (Space)",        attribute: "agility",              alias: "pilotingSpace"},
{name: "Resilience",              attribute: "brawn",              },
{name: "Skulduggery",             attribute: "cunning",             },
{name: "Stealth",                 attribute: "agility",              },
{name: "Streetwise",              attribute: "cunning",             },
{name: "Survival",                attribute: "cunning",             },
{name: "Vigilance",               attribute: "willpower",            },
{name: "Brawl",                   attribute: "brawn",              },
{name: "Gunnery",                 attribute: "agility",              },
{name: "Melee",                   attribute: "brawn",              },
{name: "Ranged (Light)",          attribute: "agility",              alias: "rangedLight"},
{name: "Ranged (Heavy)",          attribute: "agility",              alias: "rangedHeavy"},
{name: "Core Worlds",             attribute: "intellect",             alias:"coreWorlds"},
{name: "Education",               attribute: "intellect",             },
{name: "Lore",                    attribute: "intellect",             },
{name: "Outer Rim",               attribute: "intellect",             alias: "outerRim"},
{name: "Underworld",              attribute: "intellect",             },
{name: "Xenology",                attribute: "intellect",             }]; };

app.factory("skillInfo", [function() {
    return skillsTree();
}]);

app.service("getSkillStat", ["skillInfo", function(skillInfo) {
    return function(name) {
        for (var i = 0; i < skillInfo.length; i++)
            if (skillInfo[i].name.toLowerCase() == name.toLowerCase())
                return skillInfo[i].attribute;
    }
}])

function addSkillDirective(name, attribute, directiveTitle) {
    app.directive(directiveTitle, function() {
        return {
            restrict: "A",
            link: function ($scope, $element, $attributes) {
                 var rank = 1;
                 if ($attributes[directiveTitle]) {
                     rank = parseInt($attributes[directiveTitle]);
                 }
                 $scope.$parent.model.skills[name] = {
                     rank: rank,
                     attribute: attribute
                 }
            }
        }
    });
}
var skills = skillsTree();
for (var i = 0; i < skills.length; i++) {
    var name = skills[i].alias;
    if (name == null || name == "undefined") {
        name = skills[i].name.toLowerCase();
    }
    addSkillDirective(skills[i].name, skills[i].attribute, name);
}
