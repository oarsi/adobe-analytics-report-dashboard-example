Adobe Analytics Report Dashboard Example
=====

A working Adobe Analytics Report demo, written in pure Javascript. Credits goes to [Adobe Analytics Real-time Dashboard Example](https://github.com/Adobe-Marketing-Cloud/analytics-realtime-dashboard-example)

Credentials are provided by [Adobe](https://github.com/Adobe-Marketing-Cloud/analytics-realtime-dashboard-example/blob/master/lessons/lesson_1/README.md) as a set of test credentials. To obtain credentials for your own account, follow the tutorial [here](https://marketing.adobe.com/developer/get-started/enterprise-api/c-get-web-service-access-to-the-enterprise-api).

Understanding the JavaScript libraries used in this example
-----

A quick look at the JavaScript libraries used to help create this dashboard:

1. `js/jquery-2.1.0.min.js` is a common JavaScript library used by the other libraries.  `js/jquery-animateNumber/jquery.animateNumber.min.js` and `js/jquery.basic_table.js` are JQuery plugins used for data display.

	```html
    <script src="js/jquery-2.1.0.min.js" type="text/javascript"></script>
    <script src="js/jquery-animateNumber/jquery.animateNumber.min.js" type="text/javascript"></script>
    <script src="js/jquery.basic_table.js" type="text/javascript"></script>    
    ```

2.	`js/chartist.min.js` is a charting library that is used to make graphs and `js/chartist-plugin-tooltip.min.js` is a tooltip plugin for the charting library.

	```html
	<script src="js/chartist.min.js"></script>
	<script src="js/chartist-plugin-tooltip.min.js"></script>
    ```

3.	`js/marketing-cloud-javascript-sdk/marketing_cloud.js` is another Adobe library that simplfies interaction with the Analytics API. `js/wsse.js` is also an Adobe library that handles the auththenication with the Analytics API. The source for these libraries can be found [here](https://github.com/Adobe-Marketing-Cloud/marketing-cloud-javascript-sdk). The credentials used in this example are stored in the `config.js` file.

	```html
    <script src="js/marketing-cloud-javascript-sdk/marketing_cloud.js" type="text/javascript"></script>
    <script src="js/marketing-cloud-javascript-sdk/wsse.js" type="text/javascript"></script>
    <script src="js/config.js" type="text/javascript"></script>    
    ```

4.	`js/custom.js` is a library that has some convenience methods for working with strings and arrays.

	```html
	<script src="js/custom.js" type="text/javascript"></script>
	```

5.	`js/report.js` is the library that encapsulates formatting and display logic for the report response data.
    
	```html    
    <script src="js/report.js" type="text/javascript"></script>
    ```

Making a basic request to the APIs from JavaScript
-----

JavaScript is used on the page to request a report and display the raw result.

1. tbd

2. tbd

3. tbd

4. tbd