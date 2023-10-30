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

hbs.registerHelper('showAverageScore', function(averageScore) {
    if (!isNaN(averageScore) && averageScore !== null) {
        return new hbs.SafeString('<p><i class="bi bi-star"></i> Puntuación de los usuarios: ' + averageScore + '.</p>');
    } else {
        return new hbs.SafeString('<p><i class="bi bi-star"></i> Puntuación de los usuarios: No hay puntuaciones todavía.</p>');
    }
});

hbs.registerHelper('isCurrentUserCompany', function(currentUser, companyId) {
    if (currentUser && companyId && currentUser.toString() === companyId.toString()) {
        return `/company/profile/` + currentUser;
    } else {
        return '/company/' + companyId;
    }
});

hbs.registerHelper('isCurrentUserPlayer', function(currentUser, playerId) {
  if (currentUser && playerId && currentUser.toString() === playerId.toString()) {
      return `/player/profile/` + currentUser;
  } else {
      return '/player/' + playerId;
  }
});









