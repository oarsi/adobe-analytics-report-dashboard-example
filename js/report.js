function Report(reportConfig) {

    var _this = this;
	
	var defaults = {
        dataElementType: 'BasicTable',
        dataElement: '#data-table'
    };

    reportConfig = $.extend({}, defaults, reportConfig);

    this.run = function (reportRequest, reportOptions, reportResponsiveOptions) {
	
        reportRequest = reportRequest || {};
		
		reportOptions = reportOptions || {};
		
		reportResponsiveOptions = reportResponsiveOptions || {};
		
        var eventName = _this.generateEventName();
		
		switch (reportConfig['dataElementType']) {
            case 'TrendGraph':
				var chart = new Chartist.Line(reportConfig['dataElement']).on('draw', function(data) {if(data.type === 'label' && data.axis === 'x') {data.element.attr({x: data.x - data.width / 2});}});
				$( document ).on(eventName, function(event, report) {
					var x = report.data.map(function(element) {
						return element.counts[0];
					});
					var y = report.data.map(function(element) {
						var ylabel = element.year+"/"+element.month+"/"+element.day;
						return ylabel.slice(2);
					});
					var data1 = {
						labels: y,
						series: [x]
					};
					var options = reportOptions;
					var responsiveOptions = reportResponsiveOptions;
					chart.update(data1,options,true);
					if (reportConfig['loadingDisable'] === true) {$( "html" ).removeClass( "loading" );}
				});
                break;
			case 'RankGraphVer':
				var chart = new Chartist.Bar(reportConfig['dataElement']).on('draw', function(data) {if(data.type === 'label' && data.axis === 'x') {data.element.attr({x: data.x - data.width / 2});}});
				$( document ).on(eventName, function(event, report) {
					console.log(report)
					var x = report.data.map(function(element) {
						return element.counts[0];
					});
					var y = report.data.map(function(element) {
						return  element.name;
					});
					var data1 = {
						labels: y,
						series: [x]
					};
					var options = reportOptions;
					var responsiveOptions = reportResponsiveOptions;
					chart.update(data1,options,true);
					if (reportConfig['loadingDisable'] === true) {$( "html" ).removeClass( "loading" );}
				});
                break;
            case 'BasicTable':
                var basicTable = new BasicTable(reportConfig['dataElement'], { columns: ["Page", "Page Views"] });
                $( document ).on(eventName, function(event, report) {
                    basicTable.update(report.pageTotals);
					console.log(report.pageTotals)
					if (reportConfig['loadingDisable'] === true) {$( "html" ).removeClass( "loading" );}
                });
                break;
			case 'None':
                break;
        }
		
		if (reportConfig.hasOwnProperty('totalElement')) {
            $( document ).on(eventName, function(event, report) {
                // grab the total for this time period
                var total = report.totals[0];
                // add a comma every thousand numbers (i.e. 1000 => 1,000)
                var commaStep = $.animateNumber.numberStepFactories.separator('.');

                if (reportConfig.animateTotal === true) {
                    //Animate the number
                    $(reportConfig['totalElement']).animateNumber({
                        number: total,
                        numberStep: commaStep
                    }, 500);
                } else{
                    $(reportConfig['totalElement']).html(total.toString().commaSeparate());
                }
            });
        } else if (reportConfig.hasOwnProperty('totalElementAverage')) {
            $( document ).on(eventName, function(event, report) {
                // grab the total for this time period
                var total = report.totals[0]/report.data.length;
				console.log(total);

                if (reportConfig.animateTotal === true) {
                    //Animate the number
					var decimal_places = 2;
					var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);

					$(reportConfig['totalElementAverage'])
					  .animateNumber(
						{
						  number: total*100,

						  numberStep: function(now, tween) {
							var floored_number = Math.floor(now) / decimal_factor,
								target = $(tween.elem);

							if (decimal_places > 0) {
							  // force decimal places even if they are 0
							  floored_number = floored_number.toFixed(decimal_places);

							  // replace '.' separator with ','
							  floored_number = floored_number.toString().replace('.', ',');
							}

							target.text(floored_number+reportConfig['totalElementExt']);
						  }
						},
						500
					  );
                } else{
                    $(reportConfig['totalElementAverage']).html(total.toString().commaSeparate()+reportConfig['totalElementExt']);
                }
            });
        }

        _this.makeRequest(reportRequest, eventName);
	};

    this.generateEventName = function () {
        var len = 24, chars  = "0123456789abcdef", eventName  = "";
        for (var i = 0; i < len; i++) {
            eventName += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return eventName;
    };

    this.setPageTotals = function(report) {
        // return the total count for each page
        // formatted data is [["PageName", 123], ["PageName 2", 456]]
        var totals = [];
		console.log(report.data);
        $(report.data).each(function(i, element) {
			total = parseInt(element.counts[0]) + (totals[i] ? totals[i][1] : 0);
			totals[i] = [element.name, total];
        });
        report.pageTotals = totals;
    };

    this.makeRequest = function(params, eventName) {
		var method ='Report.Queue';

		if(typeof(Storage) === "undefined" || sessionStorage.getItem(reportConfig['id'])===null) {
			MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
				if (response.status == 200) {
					var reportID = response.responseJSON.reportID;
					console.log("First run: "+reportID);
					if(typeof(Storage) !== "undefined") {
						sessionStorage.setItem(reportConfig['id'], reportID);
					}
					_this.makeGetReport(reportID, eventName);
				} else {
					_this.makeRequest();
				}
			});
		} else {
			var reportID = +sessionStorage.getItem(reportConfig['id']);
			console.log("Rerun: "+reportID);
			_this.makeGetReport(reportID, eventName);
		}
    };
	
	this.makeGetReport = function(reportID, eventName) {
		var method ='Report.Get';
		var params = {"reportID":reportID};
		
		console.log("Report Request: " + reportID);
		MarketingCloud.makeRequest(config.username, config.secret, method, params, config.endpoint, function(response) {
			if (response.status == 200) {
				var report = response.responseJSON.report;
				_this.setPageTotals(report);
				var event = jQuery.Event(eventName);
				console.log(response.status+": Report build");
				$( document ).trigger(event, report);
			}else {
				console.log(response.status+": "+response.responseText);
				_this.makeGetReport(reportID, eventName);
			}
		});
	 };
}
