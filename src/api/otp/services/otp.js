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

    verifyOTP: async (number,otp) => {
        try {
            let url = `https://2factor.in/API/V1/${process.env.OTPAPIKEY}/SMS/VERIFY3/${number}/${otp}`;
            let details = await fetch(url);
            let data = await details.json();
            if(data.Status=="Success"){
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
            console.log(number);
            const hashPassword = await bcrypt.hash(number,10);
            console.log(hashPassword);
            let entry = await strapi.entityService.create('api::register.register', {
                data: {
                    number: number,
                    password : hashPassword,
                },
            });
            console.log(hashPassword);
            console.log(entry);
            return entry;
        }
        catch (err) {
            return err;
        }
    },

    checkSignup: async (number) => {
        try {
            let entry =  await strapi.db.query('api::register.register').findOne({
                select: ['number'],
                where: { number: number },
            });
            if(entry===null){
                return false;
            }
            return true;
        }
        catch (err) {
            return err;
        }
    },

    generateToken : async (number) => {
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
