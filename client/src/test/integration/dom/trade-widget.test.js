(function() {
	"use strict";
	
	var TradeTask = require('./trade-task');
	var TradeWidget = require('./trade-widget');
	var Board = require('./board');
	
	var testData = require('./test-data');
	var describeInDom = require('./dom-fixture').describeInDom;
	
	describeInDom('A Trade widget', function (domContext) {
		var currentPlayer;
		var otherPlayer;
		
		beforeEach(function () {
			currentPlayer = testData.players()[0].buyProperty(Board.properties().readingRailroad);
			otherPlayer = testData.players()[1];
			var task = TradeTask.start(currentPlayer, otherPlayer);
			TradeWidget.render(domContext.rootElement, task);
		});
		
		it('is rendered in the given div', function () {
			domContext.assertOneOf('.monopoly-trade-panel');
		});
		
		it('renders the title', function () {
			domContext.assertOneOf('.monopoly-trade-title');
		});
		
		it('renders a panel for both trade players', function () {
			domContext.assertElementCount('.monopoly-trade-player-panel', 2);
		});
		
		it('renders the name of both trade players', function () {
			domContext.assertElementCount('.monopoly-trade-player-name', 2);
		});
		
		it('renders a property list for both players', function () {
			domContext.assertElementCount('.monopoly-trade-player-properties', 2);
		});
		
		it('renders each property in the list', function () {
			domContext.assertElementCount(
				'.monopoly-trade-player-panel[data-ui=' + currentPlayer.id() + '] .monopoly-trade-player-property',
				currentPlayer.properties().length);
				
			domContext.assertElementCount(
				'.monopoly-trade-player-panel[data-ui=' + otherPlayer.id() + '] .monopoly-trade-player-property',
				otherPlayer.properties().length);
		});
		
		it('clicking on a property selects it', function () {
			var selector = '.monopoly-trade-player-panel[data-ui=' + currentPlayer.id() +
				'] .monopoly-trade-player-property:first-child';
			
			domContext.assertAbsentCssClass(selector, 'monopoly-trade-player-property-selected');
			
			domContext.clickOn(selector);
			
			domContext.assertCssClass(selector, 'monopoly-trade-player-property-selected');
			
			domContext.clickOn(selector);
			
			domContext.assertAbsentCssClass(selector, 'monopoly-trade-player-property-selected');
		});
	});
}());