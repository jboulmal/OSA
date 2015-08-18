/*--------------------------------------------------------
 * Module Name : ApplianceManager
 * Version : 1.0.0
 *
 * Software Name : OpenServicesAccess
 * Version : 1.0
 *
 * Copyright (c) 2011 – 2014 Orange
 * This software is distributed under the Apache 2 license
 * <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 *--------------------------------------------------------
 * File Name   : ApplianceManager/ApplianceManager.php/js/scrolltable.js
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      generate scrollable table 
 * 		Code found at http://blog.bobcravens.com/2010/01/html-scrolling-table-with-fixed-headers-jquery-plugin/
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
 */
 (function($) {
	$.fn.createScrollableTable = function(options) {

		var defaults = {
			width: '400px',
			height: '300px',
			border: 'solid 1px #888'
		};
		var options = $.extend(defaults, options);

		return this.each(function() {
			var table = $(this);
			prepareTable(table);
		});

		function prepareTable(table) {
			var tableId = table.attr('id');

			// wrap the current table (will end up being just body table)
			var bodyWrap = table.wrap('<div></div>')
									.parent()
									.attr('id', tableId + '_body_wrap')
									.css({
										width: options.width,
										height: options.height,
										overflow: 'auto'
									});

			// wrap the body
			var tableWrap = bodyWrap.wrap('<div></div>')
									.parent()
									.attr('id', tableId + '_table_wrap')
									.css({
										overflow: 'hidden',
										display: 'inline-block',
										border: options.border
									});

			// clone the header
			var headWrap = $(document.createElement('div'))
									.attr('Id', tableId + '_head_wrap')
									.prependTo(tableWrap)
									.css({
										width: options.width,
										overflow: 'hidden'
									});

			var headTable = table.clone(true)
									.attr('Id', tableId + '_head')
									.appendTo(headWrap)
									.css({
										'table-layout': 'fixed'
									});

			var bufferCol = $(document.createElement('th'))
									.css({
										width: '100%'
									})
									.appendTo(headTable.find('thead tr'));

			// remove the extra html
			headTable.find('tbody').remove();
			table.find('thead').remove();

			// size the header columns to match the body
			var allBodyCols = table.find('tbody tr:first td');
			headTable.find('thead tr th').each(function(index) {
				var desiredWidth = getWidth($(allBodyCols[index]));
				$(this).css({ width: desiredWidth + 'px' });
			});
		}

		function getWidth(td) {
			if ($.browser.msie) { return $(td).outerWidth() - 1; }
			if ($.browser.mozilla) { return $(td).width(); }
			if ($.browser.safari) { return $(td).outerWidth(); }
			return $(td).outerWidth();
		};


	};

})(jQuery);
