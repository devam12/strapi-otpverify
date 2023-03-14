module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/otp',
     handler: 'otp.generateOTP',
     config: {
       policies: [],
       middlewares: [],
     },
    },

    {
      method: 'POST',
      path: '/verifyotp',
      handler: 'otp.verifyOTP',
      config: {
        policies: [],
        middlewares: [],
      },
     },

     {
      method: 'POST',
      path: '/signup',
      handler: 'otp.signup',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
