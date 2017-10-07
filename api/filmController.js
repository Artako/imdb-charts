const fs = require('fs');
const path = require('path');
const axios = require('axios');
const async = require('async');
const cheerio = require('cheerio');
const _ = require('lodash');

const apiKey = 'PlzBanMe';
const apiUrl = 'http://www.omdbapi.com/';


const suggestMovie = (request, response) => {
  const url = encodeURI('http://www.imdb.com/chart/top?ref_=nv_mv_250_6');

  axios(url).then(function (page) {
    async.waterfall([
      function (next) {
        const films = [];

        const $ = cheerio.load(page.data);
        const list = $('.lister-list tr');

        for (var i = 0; i < list.length; i++) {
          const film = {
            id: $(list[i]).find('.ratingColumn [data-titleid]').attr('data-titleid'),
            img: $(list[i]).find('.posterColumn a img').attr('src'),
            rating: Number($(list[i]).find('.ratingColumn  strong').text()),
          };

          films.push(film);
        }

        next(null, films);
      },
      function(films, next) {
        fs.readFile(path.join(__dirname, 'data/films.json'), 'utf8', function (err, data) {
          if (err) {
            response.json({
              message: 'something went wrong',
            });
          } else {

            const filmsData = JSON.parse(data).films;

            const result = _.map(films, function(item) {
              return _.merge(item, _.find(filmsData, { id : item.id }));
            });

            response.json({
              films: result,
            });
          }
        });
      },
    ], function (films) {
      response.json({
        films,
      });
    });
  });
};


const suggestMovie2 = (request, response) => {
  fs.readFile(path.join(__dirname, 'data/films.json'), 'utf8', function (err, data) {
    if (err) {
      response.json({
        message: 'something went wrong',
      });
    } else {
      response.json({
        films: JSON.parse(data).films,
      });
    }
  });
};


exports.suggestMovie = suggestMovie;
