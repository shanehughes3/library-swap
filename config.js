module.exports = {
    production: {
	port: process.env.PORT,
	secret: process.env.SESSION_SECRET,
	dbUser: process.env.DB_USER,
	dbPass: process.env.DB_PASS
    },
    development: {
	port: 8080,
	secret: "cats",
	dbUser: "test",
	dbPass: "somepass"
    }
};
