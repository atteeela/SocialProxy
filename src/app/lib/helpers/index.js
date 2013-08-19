exports.tweet = function (origin) {
		return {
			id: origin.id,
			text: origin.text,
			created_timer: origin.created_at
		}
	};

exports.post = function (origin) {
		return {
			id: origin.id,
			text: origin.message,
			created_time: origin.created_time
		}
	};

