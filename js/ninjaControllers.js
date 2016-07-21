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

ninjaApp.controller('ninjaAll', ['$scope', '$mdSidenav', '$mdDialog', function($scope, $mdSidenav, $mdDialog){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
    
    $scope.showAlert = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'html/getting-started-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: true
        });
    };
}]);

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}