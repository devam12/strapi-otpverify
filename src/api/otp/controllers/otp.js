'use strict';

module.exports = {
  generateOTP: async (ctx, next) => {
    try {
      const generatedOTP = await strapi.service("api::otp.otp").generateOTP(ctx.request.body.number);
      ctx.body = generatedOTP;
    } catch (err) {
      ctx.body = err;
    }
  },

  verifyOTP: async (ctx, next) => {
    try {
      let number = ctx.request.body.number;
      let otp = ctx.request.body.otp;
      let otpMatched = await strapi.service("api::otp.otp").verifyOTP(number,otp);
      if (otpMatched) {
        const userRegister = await strapi.service("api::otp.otp").checkSignup(number);
        if (userRegister) {
          const token = await strapi.service("api::otp.otp").generateToken(number);
          ctx.body = "Login with jwt token : "+token;
        }
        else {
          await strapi.service("api::otp.otp").signup(number);
          const token = await strapi.service("api::otp.otp").generateToken(number);
          ctx.body = "Signup & Login with jwt token : "+token;
        }
      }
      else {
        ctx.body = "Invalid OTP";
      }
    } catch (err) {
      ctx.body = err;
    }
  },

  signup: async (ctx, next) => {
    try {
      const signup = await strapi.service("api::otp.otp").signup(ctx.request.body.number);
      ctx.body = signup;
    } catch (err) {
      ctx.body = err;
    }
  },
};
