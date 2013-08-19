exports.scraper = function (origin) {
		return {
			id: origin.id,
			text: origin.text,
			created_at: origin.created_at
		}
	};
