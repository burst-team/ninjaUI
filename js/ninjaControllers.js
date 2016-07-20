ninjaApp.controller('ninjaAccounts', function($scope, ninjaData){
    $scope.ninjaData = ninjaData;


    $scope.table = {
        "search" : "",
        "limit" : 10,
        "page" : 1,
        "order" : "-share"
    };
    //$scope.order = 'estimatedCapacityTB';
});

ninjaApp.controller('ninjaNav', function($scope, ninjaData){
    $scope.ninjaData = ninjaData;
    //$scope.order = 'estimatedCapacityTB';
});

ninjaApp.controller('ninjaAll', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

}]);
