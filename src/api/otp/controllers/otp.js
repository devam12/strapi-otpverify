'use strict';

module.exports = {
  generateOTP: async (ctx, next) => {
    try {
      const generatedOTP = await strapi.service("api::otp.otp").generateOTP(ctx.request.body.number);
      let data = {
        otp: generatedOTP,
      };
      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },

  verifyOTP: async (ctx, next) => {
    try {
      let number = ctx.request.body.number;
      let otp = ctx.request.body.otp;
      let otpMatched = await strapi.service("api::otp.otp").verifyOTP(number, otp);
      if (otpMatched) {
        let userRegister = await strapi.service("api::otp.otp").checkSignup(number);
        if (userRegister) {
          const token = await strapi.service("api::otp.otp").generateToken(number);
          let data = {
            message: "Login with jwt token",
            token: token,
          };
          ctx.body = data;
        }
        else {
          await strapi.service("api::otp.otp").signup(number);
          const token = await strapi.service("api::otp.otp").generateToken(number);
          let data = {
            message: "Signup & Login with jwt token",
            token: token,
          };
          ctx.body = data;
        }
      }
      else {
        let data = {
          message: "Invalid OTP",
        };
        ctx.body = data;
      }
    } catch (err) {
      ctx.body = err;
    }
  },

  signup: async (ctx, next) => {
    try {
      let userRegister = await strapi.service("api::otp.otp").checkSignup(ctx.request.body.number);
      if (userRegister) {
        let data = {
          message: "Already Register User Please Login",
        };
        ctx.body = data;
      }
      else {
        const signup = await strapi.service("api::otp.otp").signup(ctx.request.body.number);
        ctx.body = signup;
      }
    } catch (err) {
      ctx.body = err;
    }
  },
};
