/* eslint-disable camelcase */
const centra = require('@aero/centra');

module.exports = {
	name: 'spotify',
	authUri: `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_ID}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`,
	callback: async (req, res) => {
		const tokens = await centra('https://accounts.spotify.com/api/token', 'POST')
			.body({
				grant_type: 'authorization_code',
				code: req.query.code,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI
			}, 'form')
			.header('Authorization', `Basic ${Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`).toString('base64')}`)
			.json();

		const user = await centra('https://api.spotify.com/v1/me')
			.header('Authorization', `Bearer ${tokens.access_token}`)
			.json();

		res.status(200).json({ ...user });
	}
};
