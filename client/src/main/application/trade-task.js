(function() {
	"use strict";
	
	var Player = require('./player');
	
	var precondition = require('./contract').precondition;
	
	exports.start = function (currentPlayer, otherPlayer) {
		precondition(Player.isPlayer(currentPlayer), 'A TradeTask requires a current player');
		precondition(Player.isPlayer(otherPlayer), 'A TradeTask requires another player');
		
		return new TradeTask(currentPlayer, otherPlayer);
	};
	
	function TradeTask(currentPlayer, otherPlayer) {
		this._currentPlayer = currentPlayer;
		this._otherPlayer = otherPlayer;
		this._currentPlayerPropertiesOffer = [];
		this._otherPlayerPropertiesOffer = [];
		this._currentPlayerMoneyOffer = 0;
		this._otherPlayerMoneyOffer = 0;
		
		this._offer = new Rx.BehaviorSubject(currentOffer(this));
	}
	
	TradeTask.prototype.currentPlayer = function () {
		return this._currentPlayer;
	};
	
	TradeTask.prototype.otherPlayer = function () {
		return this._otherPlayer;
	};
	
	TradeTask.prototype.togglePropertyOfferForPlayer = function (propertyId, playerIndex) {
		precondition(_.isString(propertyId), 'Requires a property id');
		precondition(_.isNumber(playerIndex) && (playerIndex === 0 || playerIndex === 1),
			'Requires a player index of 0 or 1');
			
		var properties = (playerIndex === 0) ?
			this._currentPlayerPropertiesOffer :
			this._otherPlayerPropertiesOffer;
		
		if (_.contains(properties, propertyId)) {
			properties = _.without(properties, propertyId);
		} else {
			properties = properties.concat([propertyId]);
		}
		
		setPropertiesOfferFor(playerIndex, properties, this);
		
		this._offer.onNext(currentOffer(this));
	};
	
	function setPropertiesOfferFor(playerIndex, properties, self) {
		if (playerIndex === 0) {
			self._currentPlayerPropertiesOffer = properties;
		} else {
			self._otherPlayerPropertiesOffer = properties;
		}
	}
	
	TradeTask.prototype.setMoneyOfferedByCurrentPlayer = function (money) {
		precondition(_.isNumber(money) && money >= 0 && money <= this._currentPlayer.money(),
			'A player can only offer an amount of money between 0 and the total he has (inclusively)');
			
		this._currentPlayerMoneyOffer = money;
		this._offer.onNext(currentOffer(this));
	};
	
	TradeTask.prototype.setMoneyOfferedByOtherPlayer = function (money) {
		precondition(_.isNumber(money) && money >= 0 && money <= this._otherPlayer.money(),
			'A player can only offer an amount of money between 0 and the total he has (inclusively)');
			
		this._otherPlayerMoneyOffer = money;
		this._offer.onNext(currentOffer(this));
	};
	
	TradeTask.prototype.offer = function () {
		return this._offer.asObservable();
	};
	
	function currentOffer(self) {
		return [
			{
				properties: self._currentPlayerPropertiesOffer,
				money: self._currentPlayerMoneyOffer
			},
			{
				properties: self._otherPlayerPropertiesOffer,
				money: self._otherPlayerMoneyOffer
			}
		];
	}
}());