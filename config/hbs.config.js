const hbs = require("hbs");

hbs.registerHelper("playerLikedRoom", function (options) {
  const { room, likes } = options.hash;
  console.log(likes.some((like) => like.room.toString() == room._id.toString()))
  if (room && likes && likes.some((like) => like.room.toString() == room._id.toString())) {
    console.log('me gusta')
    return options.fn(this);
  } else {
    console.log('no me gusta')
    return options.inverse(this);
  }
});