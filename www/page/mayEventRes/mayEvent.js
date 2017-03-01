var activeRegBag = 0,
	wt = false,
	si;
$(function() {
	getCount();
	getRedBagStatus();
	$(document).on('click', '.disable', function() {
		return false;
	}).on('click', '.aLuckyDog', function() {
		orderRedBag();
		anime();
		$('.lottery').addClass('ready');
		return false;
	}).on('click', '.lottery.ready .open-bag', function() {
		$(this).attr('href', 'http://amos.alicdn.com/getcid.aw?v=2&uid=%E5%BF%AB%E4%BA%91%E7%A7%91%E6%8A%80&site=cntaobao&s=2&groupid=0&charset=utf-8');
		$(this).attr('target', '_blank');
	});
});

function getCount() {
	app.cache.addParams({
		userNick: $.cookie('ky_nick'),
		nick: $.cookie('ky_nick'),
		from: 'quicloud'
	});
	app.connect.ajax({
		'type': 'post',
		'api': '/sources/promotionActivity/oneToOneDiag',
		'data': ['userNick', 'from'],
		'success': function(json) {
			if (json.rlt == 1) {
				var limit = +json.value.limit,
					count = limit - +json.value.count;
				$('.order-layer .last').html(count);
				$('.order-layer .limit').html(limit);

				if (count <= 0) {
					$('.order-layer .order').addClass('disable');
				}

			}
		}
	});
}

function getRedBagStatus() {
	app.connect.ajax({
		'type': 'post',
		'api': '/sources/promotionActivity/hongbao',
		'data': ['nick'],
		'success': function(json) {
			if (json.rlt == 1) {
				if (json.value.applyId) {
					activeRegBag = json.value.orderId;
				} else {
					activeRegBag = 0;
				}
				setRedbag(activeRegBag);
			}
		}
	});
}

function orderRedBag() {
	app.connect.ajax({
		'type': 'post',
		'api': '/sources/promotionActivity/aLuckyDog',
		'data': ['nick'],
		'success': function(json) {
			if (json.rlt == 1) {
				activeRegBag = json.value.orderId;
				if (!wt) {
					setRedbag(activeRegBag);
				} else {
					si = setInterval(function() {
						if (!wt) {
							setRedbag(activeRegBag);
							clearInterval(si);
						}
					}, 100);
				}
			}
		}
	});
}

function setRedbag(activeRegBag) {
	if (activeRegBag > 0) {
		$('.lottery').addClass('ready');
		$('.f2').removeClass('f2');
		var $d = $('.redbag[data-num=' + activeRegBag + ']')
		$d.siblings('li').addClass('disable');
		$d.addClass('f2');
		$($d.siblings('li')[0]).addClass('f1');
		$($d.siblings('li')[1]).addClass('f3');
		$('.lottery').removeClass('move');
	}
}

function anime() {
	$('.f1').removeClass('f1').addClass('f2');
	$('.f3').removeClass('f3').addClass('f2');
	$('.lottery').addClass('move');
	wt = true;
	setTimeout(function() {
		wt = false;
	}, 500);
}