'use strict';
const axios = require('axios');
const crypto = require('crypto');

module.exports = {
    generateOTP: async (number) => {
        try {
            let url = `https://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/+91${number}/AUTOGEN/`;
            let details = await fetch(url);
            let data = await details.json();
            return data;
        }
        catch (err) {
            return err;
        }
    },

    verifyOTP: async (number, otp) => {
        try {
            let url = `https://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/VERIFY3/${number}/${otp}`;
            let details = await fetch(url);
            let data = await details.json();
            if (data.Status == "Success") {
                return true;
            }
            return false;
        }
        catch (err) {
            return err;
        }
    },

    checkSignup: async (number) => {
        try {
            let entry = await strapi.query('plugin::users-permissions.user').findOne({
                select: ['email', 'mobilenumber', 'username'],
                where: { mobilenumber: number },
            });
            if (entry === null) {
                return false;
            }
            return true;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },

    signup: async (number) => {
        try {
            let hashPassword = crypto.createHmac('sha1', process.env.PASSWORD_SECRET).update(number).digest('hex');
            console.log(hashPassword);
            let entry = await strapi.plugins['users-permissions'].services.user.add({
                email: `${number}@gmail.com`,
                mobilenumber: number,
                password: hashPassword,
                username: number,
                provider: "local"
            });
            return entry;
        }
        catch (err) {
            return err;
        }
    },

    login: async (number) => {
        try {
            let hashPassword = crypto.createHmac('sha1', process.env.PASSWORD_SECRET).update(number).digest('hex');
            const data = {
                identifier: number,
                password: hashPassword,
            };
            console.log("login : ", data);
            const options = {
                credentials: "include",
                withCredentials: true,
            };
            const response = await axios.post(`${process.env.API}`+"api/auth/local",
                data,
                options
            );
            return response.data;
        }
        catch (error) {
            console.log(error.message);
        }
    }

};
