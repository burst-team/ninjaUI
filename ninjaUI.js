//'ws://burst.ninja/webAPI/updates', 'updates'

var ninjaApp = angular.module('ninjaUI', ['ngWebSocket','ngMaterial','md.data.table']);

ninjaApp.factory('ninjaData', function($websocket){
	// Open a WebSocket connection
	var ninjaSocket = $websocket('ws://burst.ninja/webAPI/updates', 'updates');
	
	ninjaSocket.onOpen(function(){
		console.log('Connected');
	});
	
	var ninjaData = {};
	ninjaData.loading = 0;

	ninjaSocket.onMessage(function(message){
		//console.log(message)
		/*collection.push(JSON.parse(message.data));*/
		//console.log(JSON.parse(message.data));
		if (message.data) {
			
			if(message.data.indexOf('SHARES:') == 0 ){
				var shares = JSON.parse(message.data.substr(7));
				
				console.log(shares);
				ninjaData.shares = shares;
				ninjaData.deadline = 0;
				if (shares.shares.length > 0){
					ninjaData.deadline = shares.shares[0].deadline;
					console.log(ninjaData.deadline);
					ninjaData.timeToGo = ninjaData.deadline + ninjaData.block.newBlockWhen - (new Date() / 1000);
					ninjaData.totalTime = ninjaData.deadline + ninjaData.block.newBlockWhen;
				}
				ninjaData.loading++;
			}
			
			else if( message.data.indexOf('BLOCK:') == 0){
				var block = JSON.parse(message.data.substr(6));
				console.log(block);
				ninjaData.block = block;
				ninjaData.loading++;
			}
			
			else if( message.data.indexOf('ACCOUNTS:') == 0 ) {
				var accounts = JSON.parse(message.data.substr(9));
				for(var i = 0; i < accounts.length; i++){
					if(accounts[i].accountName == ""){
						//accounts[i].accountName = "BURST-" + accounts[i].account;
                        accounts[i].accountName = accounts[i].account;
					}
                    if(!accounts[i].deadline){
                        accounts[i].deadline = 9999999;
                    }
				}
				ninjaData.accounts = accounts;
				ninjaData.loading++;
			}
		}
		
		
		if(ninjaData.loading > 2){
			// Current shares
			for(var i =0; i < ninjaData.accounts.length; i++){
				for(var ii = 0; ii < ninjaData.shares.shares.length; ii++){
					if(ninjaData.accounts[i].accountId == ninjaData.shares.shares[ii].accountId){
						ninjaData.accounts[i].deadline = ninjaData.shares.shares[ii].deadline;
						ninjaData.accounts[i].share = ninjaData.shares.shares[ii].share;
						//delete ninjaData.shares.shares[ii];
					}
				}
				//Set share % to 0 if it isn't set
				if(ninjaData.accounts[i].share == undefined){
					ninjaData.accounts[i].share = 0;
				}
			}

			//Historic shares
			for(var i =0; i < ninjaData.accounts.length; i++){
				for(var ii = 0; ii < ninjaData.shares.historicShares.length; ii++){
					if(ninjaData.accounts[i].accountId == ninjaData.shares.historicShares[ii].accountId){
						ninjaData.accounts[i].historicShare = ninjaData.shares.historicShares[ii].share;
					}
				}
				//Set historicShare % to 0 if it isn't set
				if(ninjaData.accounts[i].historicShare == undefined){
					ninjaData.accounts[i].historicShare = 0;
				}
			}
		}
			
		ninjaData.accStats = ninjaData.accounts;
		
		console.log(ninjaData);
	});

	/*var methods = {
		accounts: ninjaData.accounts,
		block: ninjaData.block,
		shares: ninjaData.shares,
		get: function() {
			ninjaSocket.send(JSON.stringify({ action: 'get' }));
		}
	};*/

	return ninjaData;
	
	ninjaSocket.onClose(function(){
		console.error("Conn closed");
	});
	ninjaSocket.onError(function(){
		console.error("Conn error");
	});
	
});

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


ninjaApp.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

	function link(scope, element, attrs) {
		var timeoutId;

		function updateTime() {
			element.text(dateFilter(new Date(), format));
		}

		scope.$watch(attrs.myCurrentTime, function(value) {
			format = value;
			updateTime();
		});

		element.on('$destroy', function() {
			$interval.cancel(timeoutId);
		});

		// start the UI update process; save the timeoutId for canceling
		timeoutId = $interval(function() {
			updateTime(); // update DOM
		}, 1000);
	}

	return {
		link: link
	};
}]);

ninjaApp.filter('secondsToDateTime',function(){
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
});