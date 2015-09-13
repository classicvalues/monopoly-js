(function() {
	"use strict";
	
	var PlayersWidget = require('./players-widget');
	var PlayGameTask = require('./play-game-task');
	var Choices = require('./choices');
	
	var testData = require('./test-data');
	var describeInDom = require('./dom-fixture').describeInDom;
	
	describeInDom('A Players widget', function (domContext) {
		var task;
		
		beforeEach(function () {
			task = PlayGameTask.start(testData.gameConfiguration());
			PlayersWidget.render(domContext.rootElement, task.gameState());
		});
		
		it('is rendered in the given container', function () {
			domContext.assertOneOf('.monopoly-players');
		});
		
		it('renders a panel for each player', function () {
			domContext.assertElementCount('.player-panel', testData.playersConfiguration().length);
		});
		
		it('renders the player tokens', function () {
			domContext.assertElementCount('.player-panel-token', testData.playersConfiguration().length);
		});
		
		it('renders the player names', function () {
			domContext.assertElementCount('.player-name', testData.playersConfiguration().length);
		});
		
		it('renders the player amounts', function () {
			domContext.assertElementCount('.player-money', testData.playersConfiguration().length);
		});
		
		it('renders the player properties', function () {
			domContext.assertElementCount('.player-properties', testData.playersConfiguration().length);
		});
		
		it('updates the player money when it changes', function () {
			var playerId = firstPlayerId(task.gameState());
			
			domContext.assertSelectionContainsAttributeValues(
				'.player-panel[data-ui=' + playerId + '] .player-money', 'data-ui', [(1500).toString()]);
				
			var propertyId = 'rr-reading';
			var price = 100;
			task.handleChoicesTask().makeChoice(Choices.buyProperty(propertyId, '', price));
			
			domContext.assertSelectionContainsAttributeValues(
				'.player-panel[data-ui=' + playerId + '] .player-money', 'data-ui', [(1500 - price).toString()]);
		});
		
		it('renders a property for each one the player owns', function () {
			domContext.assertNothingOf('.player-property');
			
			var propertyId = 'rr-reading';
			var playerId = firstPlayerId(task.gameState());
			task.handleChoicesTask().makeChoice(Choices.buyProperty(propertyId, '', 100));
			
			domContext.assertOneOf('.player-property');
			domContext.assertOneOf(
				'.player-panel[data-ui=' + playerId + '] .player-property[data-ui=' + propertyId + ']');
		});
		
		it('when a player is removed from the game, its panel is removed too', function () {
			var playerId = firstPlayerId(task.gameState());
			
			domContext.assertOneOf('.player-panel[data-ui=' + playerId + ']');
			
			task.handleChoicesTask().makeChoice(Choices.goBankrupt());
			
			domContext.assertNothingOf('.player-panel[data-ui=' + playerId + ']');
		});
		
		function firstPlayerId(gameState) {
			var playerId;
			gameState.take(1).subscribe(function (state) {
				playerId = state.players()[state.currentPlayerIndex()].id();
			});
			return playerId;
		}
	});
}());