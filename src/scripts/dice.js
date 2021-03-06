var app = angular.module("swaor", ["starship"]);

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

app.directive("skillsBlock", ["getSkillStat", function(getStat) {
    return {
        templateUrl: "/views/skills.html",
        replace: true,
        restrict: "E",
        scope: {
            skills: "=",
            char: "="
        },
        link: function ($scope, $element, $attributes) {
            $scope.skillKeys = function() {
                var keys = [];
                for (k in $scope.skills) {
                    keys.push(k);
                }
                return keys.sort();
            }
            $scope.getRanks = function(key) {
               return $scope.skills[key];
            }
            $scope.getAttr = function(key) {
               var attribute = getStat(key);
                return $scope.char[attribute];
            }
        }
    }
}]);


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
        if (Array.isArray(html)) {
            html = html.join(", ") + ".";
        }
        ele.html(html);
        $compile(ele.contents())(scope);
        console.log(html);
      });
    }
  };
}]);

app.directive("equipmentBlock", ["getSkillStat", function(getStat) {
    return {
        templateUrl: "/views/equipment.html",
        scope: {
            equipment: "=?equipment",
            skills: "="
        },
        controller: ["$scope", function($scope) {
            $scope.getRank = function(skill) {
                if ($scope.skills[skill] == undefined)
                    return 0;
                return $scope.skills[skill];
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


app.directive("talentBlock", ParseBlocks("talents"));
app.directive("talents", ['$sce', ParseTransclude("talents")]);
app.directive("abilitiesBlock", ParseBlocks("abilities"));
app.directive("abilities", ['$sce', ParseTransclude("abilities")]);

function ParseBlocks(blockName) {
    return function() {
        var model = {
            templateUrl: "/views/" + blockName +".html",
            scope: {},
            replace: true
        }
        model.scope[blockName] = "=?" + blockName;
        return model;
    }
};
function ParseTransclude(property) {
    return function($sce) {
        return {
           transclude: true,
           restrict: "E",
           link: function(scope, element, attrs, ctrl, transclude) {
               transclude(scope, function(clone, scope) {
                   var html = "";
                   for (var i = 0; i < clone.length; i++)
                       html += clone[i].wholeText || clone[i].outerHTML;
                   if (scope.$parent.model[property] == null) {
                       scope.$parent.model[property] = [];
                   }
                   scope.$parent.model[property].push($sce.trustAsHtml(html));
               });
           }
        }
    }
};

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
               vicious: scope.vicious,
               stun: scope.stun
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

app.directive("item", ['$sce', function($sce) {
    return {
        transclude: true,
        reaplce: true,
        restrict: "E",
        link: function(scope, element, attrs, ctrl, transclude) {
           var item = {};
           transclude(scope, function(clone, scope) {
               var html = "";
               for (var i = 0; i < clone.length; i++)
                   html += clone[i].wholeText || clone[i].outerHTML;
               item = $sce.trustAsHtml(html);
           });
           var scoped = scope.$parent.model;
           if (scoped.equipment == null)
               scoped.equipment = {};
           if (scoped.equipment.items == null)
               scoped.equipment.items = [];
           scoped.equipment.items.push(item);
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
app.directive("detailBlockSplit", function() {
    return {
        templateUrl: "/views/detailblocksplit.html",
        scope: {
            meleeD: "=",
            rangedD: "=",
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
            var dif = 0;
            if ($scope.dif != null) {
                dif = parseInt($scope.dif);
            }
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
            fromTemplate: "@",
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
            strain: "=?",
            meleeDefense: "=?",
            rangedDefense: "=?",
        },
        controller: ["$scope", "$http", function($scope, $http) {
            if ($scope.fromTemplate != null) {
               $scope.model = {};
               $http.get("characters/" + $scope.fromTemplate + ".json")
                   .then(function(res){
                      $scope.model = res.data;
                    });
            }
            else if ($scope.model == null) {
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
                    meleeDefense: $scope.meleeDefense || 0,
                    rangedDefense: $scope.rangedDefense || 0,
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
{name: "Knowledge (Core Worlds)",             attribute: "intellect",             alias:"coreWorlds"},
{name: "Knowledge (Education)",               attribute: "intellect",             alias:"education"},
{name: "Knowledge (Lore)",                    attribute: "intellect",             alias:"lore"},
{name: "Knowledge (Outer Rim)",               attribute: "intellect",             alias: "outerRim"},
{name: "Knowledge (Underworld)",              attribute: "intellect",             alias:"underworld"},
{name: "Knowledge (Xenology)",                attribute: "intellect",             alias:"xenology"}]; };

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
                 $scope.$parent.model.skills[name] = rank;
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


/*-Dice Stuff-*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.service("dieRoller", [function() {
    return {
        d4: function() {
            return getRandomInt(1, 4);
        },
        d6: function() {
            return getRandomInt(1, 6);
        },
        d20: function() {
            return getRandomInt(1, 20);
        },
       d100: function() {
           return getRandomInt(1, 100);
       }

       //todo add FFG dice results
    }
}])
