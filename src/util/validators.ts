// import React from 'react';
// import { IUser } from 'src/type/interfaces';


export const validateRegisterInput = ({
    email,
    username,
    password,
    confirmPassword
}) => {
    const errors = {};
    console.log('username zz : ', username);

    if (username.trim() === '') {
        username = 'Username must not be empty';
    } if (email.trim() === '') {
        email = 'Email must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

        if (!email.match(regEx)) {
            email = 'Email must be a valid email address';
        }
    }
    if (password.trim() === '') {
        password = 'Password must not be empty'
    } else if (password !== confirmPassword) {
        confirmPassword = 'Password must match';
    }

    return {


        errors,
        valid: Object.keys(errors).length < 1
    };
}

export const validateLoginInput = (username, password) => {


    const errors = {};

    if (username.trim() === '') {
        username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        password = 'Password must not be empty';
    }




    return {
        errors,
        valid: Object.keys(errors).length < 1

    };

    console.log('valisdfsdfsd : ', Object.keys(errors).length < 1);

};