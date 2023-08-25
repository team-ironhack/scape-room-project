const hbs = require("hbs");

hbs.registerHelper("playerLikedRoom", function (options) {
  const { room, likes } = options.hash;
  if (room && likes && likes.some((like) => like.room._id.toString() == room._id.toString())) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("playerMarkedRoom", function (options) {
  const { room, marks } = options.hash;

  if (room && marks && marks.some((mark) => mark.room._id.toString() == room._id.toString())) {

    return options.fn(this);
  } else {

    return options.inverse(this);
  }
});

hbs.registerHelper("playerDoneRoom", function (options) {
  const { room, dones } = options.hash;

  if (room && dones && dones.some((done) => done.room._id.toString() == room._id.toString())) {

    return options.fn(this);
  } else {

    return options.inverse(this);
  }
});






