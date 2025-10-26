import axios from 'axios';
import { StandardUser } from '../Models/UserModels/StandardUser.js';

//const apiURL = import.meta.env.VITE_API_URL;
const apiURL = import.meta.env.VITE_API_URL;

export const register = async (FullName, Email, PhoneNumber, Address)  =>
{
    console.log(FullName, Email, PhoneNumber, Address);

    try {
        const standardUser = new StandardUser({
            FullName: FullName,
            Email: Email,
            PhoneNumber: PhoneNumber,
            Address: Address,
        });
        console.log('StandarrdUser:', standardUser);

        const res =
            await axios.post(`${apiURL}/tenderuser/register`, standardUser)
                .then(response => {
                    const userID = response.data.value;
                    console.log('User created at :', Date.now());
                    console.log('USerID:', userID);
                    return userID
                })
                .catch(error => {
                    console.error('Error posting user: ', error);
                });

        return res;
    }
    catch (error) {
        console.error('Internal error creating user: ', error);
    }
}

export const deleteUser = async (userID) =>
{
    try {
        const res = await axios.post(`${apiURL}/tenderuser/deleteuser/${userID}`);
        console.log('DeleteUser:', res);
    }
    catch (error) {
        console.error('Internal error deleting user: ', error);
    }
}

export const editUser = async (userID, editUserDTO) =>
{
    try {
        const res = await axios.post(`${apiURL}/tenderuser/edit/${userID}`, editUserDTO)
        console.log('User editted at :', Date.now());
        return res.data;
    }
    catch (error) {
        console.error('Internal error editting user: ', error);
    }
}

export const fetchNotifications = async (userID) =>
{
    try {
        const res = await axios.get(`${apiURL}/notification/${userID}`)
        console.log('Fethced user notifications at :', Date.now());
        return res.data.notifications;
    }
    catch (error) {
        console.error('Internal error editting user: ', error);
    }
}