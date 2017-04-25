const parseCookies = (req, res, next) => {
};

module.exports = parseCookies;


// var parseCookies = function(req, res, next) {
//   var cookieString = req.get('Cookie') || '';

//   req.cookies = cookieString.split(';')
//     .reduce(function(cookies, item) {
//       var parts = item.split('=');
//       if (parts.length > 1) {
//         var key = parts[0].trim();
//         var val = parts[1].trim();
//         cookies[key] = val;
//       }
//       return cookies;
//     }, {});

//   next();
// };

// module.exports = parseCookies;