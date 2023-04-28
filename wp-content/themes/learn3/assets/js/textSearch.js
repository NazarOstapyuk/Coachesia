function Search(settings) {
	var that = this;
	that.init(settings);
}

Search.prototype = {
	
	
	/** Default settings */
	settings : {
		defaultClass: 'search-result',
		activeClass: 'active-result',
		containersSelectors: '.question,.toggle-content',
		startOnChange: false,
		startOnKeypress: 13,
		nextOnKeypress: 13,
		scrollToActive: true,
		queryInput: '#search',
		resultCurrentSelector: '.currentResult',
		resultsTotalSelector: '.totalResults',
		searchBtnEnabled: true,
		searchIcon: '.letter-list .input-group-addon',
	},
	
	onSearchDone: function(){
		return true;
	},
	onNextStep: function(currentResultNumber, activeContainer){
		return true;
	},
	
	quryString: '',
	numberOfResults: 0,
	currentResultNumber: 0,
	
	/** Init general render function that invokes others rendering functions */
	init : function(newSettings) {
		var that = this;
		that.settings = jQuery.extend(that.settings, newSettings || {});
		that._initTriggering();
		that.onSearchDone = that.settings.onSearchDone;
		that.onNextStep = that.settings.onNextStep;
	},
	
	setActive: function (number) {
		var that = this;
		
	},
	
	setString: function (newQueryString, restart) {
		var that = this;
		newQueryString = newQueryString.trim();
		/* no need to restart with same string */
		restart = (restart && newQueryString != that.quryString);
		
		that.quryString = newQueryString;
		jQuery(that.settings.queryInput).val(newQueryString);
		if (restart) {
			that._execute();
		}
	},
	
	
	getNextResult: function () {
		var that = this;

		var newQueryString = jQuery(that.settings.queryInput).val();
		that.setString(newQueryString, true);
		
		if (!that.numberOfResults) {
			that._setCurretnNumber(0);			
			return false;
		}
    //    if (that.currentResultNumber == that.numberOfResults) {
	//	 	that._setCurretnNumber(0);
	//	}

		var newNumber = that.currentResultNumber + 1;
		if (newNumber > that.numberOfResults) {
			newNumber = 1;
		}
		jQuery('.' + that.settings.defaultClass + '.' + that.settings.activeClass).removeClass(that.settings.activeClass);
		
		if (jQuery('.' + that.settings.defaultClass).length > 0) {
			var currentObj = jQuery('.' + that.settings.defaultClass)[newNumber - 1];
			jQuery(currentObj).addClass(that.settings.activeClass);
		}

		that._setCurretnNumber(newNumber);
		return true;
	},

	_initTriggering: function () {
		
		var that = this;
		if (
			that.settings.startOnKeypress
			|| that.settings.nextOnKeypress
		) {
			jQuery(window).keypress(function(event) {
				if (event.keyCode == that.settings.startOnKeypress) {		
					that.getNextResult();
				}				
			});
		}

		if (
			that.settings.searchBtnEnabled
			&& that.settings.searchIcon
		) {
			jQuery(that.settings.searchIcon).on('click', function () {			
				that.getNextResult();
			})
		}
	},
	
		
	_execute: function () {
		var that = this;
		that._clearOld();
		if (!that.quryString) {
			that._setTotalResultsNumber(0);
			that._setCurretnNumber(0);
			that.onSearchDone();
			return false;
		}
		that._containersProcessing(that.quryString);
		that.onSearchDone();
		return true;
	},
	
	_clearOld: function () {
		var that = this;
		jQuery('.' + that.settings.defaultClass).each(function () {
			var text = jQuery(this).html();
			jQuery(this).replaceWith(text);
		});
	},
	
	_containersProcessing: function (string) {
		var that = this;
		that._setTotalResultsNumber(0);
		that._setCurretnNumber(0);
		jQuery(that.settings.containersSelectors).each(function () {
			var text = jQuery(this).html();
			jQuery(this).html(
				that._stringProcessing(string, text)
			);
		});
		
	},
	
	_stringProcessing: function (string, containerText) {
		var that = this;
		
		string = string.toLowerCase();
		
		var numberOfMatches = 0;
		
		var nextPos = containerText.toLowerCase().indexOf(string);
		
		var replaceParent = jQuery('<span>');
		while (nextPos > -1) {
			
			var replaceHolder = jQuery('<span>');
			replaceHolder.addClass(that.settings.defaultClass);
			replaceHolder.html(
				containerText.substr(nextPos, string.length)
			);
			
			var before = containerText.substr(0, nextPos);
			var after = containerText.substr(nextPos + string.length);
			var replace = replaceParent.append(replaceHolder).html();
			
			
			containerText = before + replace + after;
			
			var stepLen = replace.length;
			nextPos = containerText.toLowerCase().indexOf(string, nextPos + stepLen);
			replaceParent.html('');
			numberOfMatches++;
		}
		
		that._setTotalResultsNumber(that.numberOfResults + numberOfMatches);
		return containerText;
	},
	
	_setCurretnNumber: function (number) {
		var that = this;
		if (!that.numberOfResults) {
			number = 0;
		}
		that.currentResultNumber = number;
		jQuery(that.settings.resultCurrentSelector).text(number);
		
		that.onNextStep(that.currentResultNumber, jQuery('.' + that.settings.activeClass));
	},
	
	_setTotalResultsNumber: function (number) {
		var that = this;
		var space = "\u200E";
		that.numberOfResults = number;
		jQuery(that.settings.resultsTotalSelector).text(that.numberOfResults + ' ' + 'item(s)' + space);
		if (that.numberOfResults < 1) {	
			jQuery(that.settings.queryInput).parent().addClass('empty');
		}
		else {			
			jQuery(that.settings.queryInput).parent().removeClass('empty');
		}
	}
};




