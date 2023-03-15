'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

    signup: async (number) => {
        try {
            const hashPassword = await bcrypt.hash(number, 10);
            let entry = await strapi.plugins['users-permissions'].services.user.add({
                email : `${number}@gmail.com`,
                mobilenumber: number,
                password: hashPassword,
                username : number
            });
            return entry;
        }
        catch (err) {
            return err;
        }
    },

    checkSignup: async (number) => {
        try {
            let entry = await strapi.query('plugin::users-permissions.user').findOne({ 
                select: ['email','mobilenumber','username'],
                where: { mobilenumber : number },
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

    generateToken: async (number) => {
        try {
            // let options = {
            //     expiresIn: "1h",
            // }
            const token = jwt.sign({ number }, process.env.TOKENCODE);
            return token;
        }
        catch (error) {
            console.log(error.message("Invalid token"));
        }
    }

};
