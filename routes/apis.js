var cards = require('./cards.js');
/*
 * push/pop
 */
// push
exports.pushPopButton = function(req, res) {

	var cardArray = null;
	var searchStr = '';
	var oracles = [];
	var doReverse = false;
    var isReverse= false;

	if (!req.param('slot') || !req.param('cardNos') ||
        !req.param('doReverse') || !req.param('isReverse')) {
		res.send(null);
		return;
	}
	if (req.param('slot') == 'A') {
		cardArray = cards.cardsA;
	} else if (req.param('slot') == 'B') {
		cardArray = cards.cardsB;
	} else {
		res.send(null);
		return;
	}

	searchStr = req.param('cardNos');

    if (req.param('doReverse') == 'true') {
        doReverse = true;
    }

    if (req.param('isReverse') == 'true') {
        isReverse = true;
    }

    cardArray.forEach(function(el) {
        var cardStr = doReverse ? el.cards.reverse().join(',') : el.cards.join(',');
		var pos = cardStr.indexOf(searchStr, pos);
		var substrFrom = 0;
		var substrTo = 0;
		var str = '';
		var index = 0;
		var isFirstDo = true;
		
        while (true) {
            if (!isFirstDo) {
                pos = cardStr.indexOf(searchStr, pos + 3);
            } else {
                isFirstDo = false;
            }
            if (pos == -1 || pos % 3 !== 0) {
                return;
            }
            // 検索文字列の最終項目を検索結果の中心とする
            pos = pos + searchStr.length - 2;
            // 先頭
            if (pos === 0) {
                substrFrom = 0;
                substrTo = 15 - 6 - 1;
                str = ',,';
                index = isReverse ? 100 : 1;
            // 2 番目
            } else if (pos == 3) {
                substrFrom = 0;
                substrTo = 15 - 3 - 1;
                str = ',';
                index = isReverse ? 100 : 1;
            // 3 ～ 98番目
            } else {
                substrFrom = pos - 3 * 2;
                substrTo = 14;
                str = '';
                index = pos / 3 - 1;
                if (isReverse) {
                    index = 100 - index + 1;
                }
            }
            str = str + cardStr.substr(substrFrom, substrTo);
            // 99 番目
            if (pos == 294) {
                str = str + ',';
            }
            // 100 番目
            if (pos == 297) {
                str = str + ',,';
            }
            var cardsWork = [];
            str.split(',').forEach(function(card) {
                var rarity = 'N';
                if (!card) {
                    cardsWork.push({index: '', no: '', rarity: ''});
                } else {
                    if (card.charAt(0) == 'C') {
                        card = '0' + parseInt(card.charAt(1), 16).toString(10);
                        card = 'CP' + card.slice(card.length - 2);
                        rarity = 'CP';
                    } else {
                        if (cards.rarities[card]) {
                            rarity = cards.rarities[card];
                        }
                    }
                    cardsWork.push({index: '(' + index + ')', no: card, rarity: rarity});
                    index = isReverse ? index - 1 : index + 1;
                }
            });
            oracles.push({
                lane: el.lane,
                cards: cardsWork
            });
        }
	});
    res.send({oracles: oracles});
    return;
};
