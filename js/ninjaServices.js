ninjaApp.factory('ninjaData', function($websocket,$interval){
    // Open a WebSocket connection
    var ninjaSocket = $websocket('ws://burst.ninja/webAPI/updates', 'updates');

    ninjaSocket.onOpen(function(){
        console.log('Connected');
    });

    var ninjaData = {};
    ninjaData.loading = 0;
    
    function toColour(num) {
        /*console.log("Num: " + num);
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16;
            //a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
        return "rgb(" + [r, g, b].join(",") + ")";*/
        return "#" + num.toString(16).slice(0,6);
    }

    ninjaSocket.onMessage(function(message){
        //console.log(message)
        /*collection.push(JSON.parse(message.data));*/
        //console.log(JSON.parse(message.data));
        if (message.data){
            
            //Shares
            if(message.data.indexOf('SHARES:') == 0 ){
                var shares = JSON.parse(message.data.substr(7));

                console.log(shares);
                ninjaData.shares = shares;
                ninjaData.deadline = 0;
                if (shares.shares.length > 0){
                    ninjaData.deadline = shares.shares[0].deadline;
                    console.log(ninjaData.deadline);
                    $interval(function(){
                        ninjaData.timeToGo = ninjaData.deadline + ninjaData.block.newBlockWhen - (new Date() / 1000);
                    },1000);
                    ninjaData.totalTime = ninjaData.deadline;
                }
                ninjaData.loading++;
            }
            //Block
            else if( message.data.indexOf('BLOCK:') == 0){
                var block = JSON.parse(message.data.substr(6));
                console.log(block);
                ninjaData.block = block;
                ninjaData.loading++;
            }
            //Accounts
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
                
                //Colour
                ninjaData.accounts[i].colour = toColour(ninjaData.accounts[i].accountId);
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
            
            //Chart data
            
            
            /*ninjaData.accountChart = {
                data: [],
                labels: [],
                colours: [],
                options: {
                    segmentShowStroke: false,
                    tooltipTemplate: "<%= label %>: ~<%= value %>%"
                }
            };
            for(var i=0;i<ninjaData.accounts.length;i++){
                ninjaData.accountChart.data.push(Math.round(ninjaData.accounts[i].share * 10000)/100);
                ninjaData.accountChart.labels.push(ninjaData.accounts[i].accountName);
                ninjaData.accountChart.colours.push(ninjaData.accounts[i].colour);
            }*/
            
            ninjaData.currentShareChart = {
                type: "PieChart",
                data: [['Account', 'Share']],
                options: {
                    title: "Current shares",
                    displayExactValues: false,
                    width: 400,
                    height: 200,
                    is3D: false,
                    chartArea: {left:20,top:25,bottom:20,height:"100%"},
                    pieHole: 0.5,
                    colors: [],
                    pieSliceBorderColor:"transparent",
                    legend : {
                        position:"none"
                    },
                    tooltip: {
                        trigger:"selection"
                    }
                },
                formatters: {
                    number : [{
                        columnNum: 1,
                        pattern: "%"
                    }]
                }
            };
            
            for(var i=0;i<ninjaData.accounts.length;i++){
                var name = ninjaData.accounts[i].accountName;
                var share = Math.round(ninjaData.accounts[i].share * 10000)/100;
                ninjaData.currentShareChart.data.push([name,share]);
                ninjaData.currentShareChart.options.colors.push(ninjaData.accounts[i].colour);
            }
        }

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