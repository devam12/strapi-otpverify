'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('sms-otp-authentication')
      .service('myService')
      .getWelcomeMessage();
  },
});
