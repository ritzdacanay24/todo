//Custom built kroger api end point. 
//helps organizes the kroger functionality in one place. 

import API from "../utils/API";
import Cookies from 'js-cookie';
const config = require('../../config/default.json');

const jwt = require('jsonwebtoken');
let clientId = config.kroger.clientId;

class KrogerService {

    //If the user has a refresh token run this. 
    //If the access token has expired, provide the user with new refresh and access tokens.
    //Once we get the new tokens, set the cookie.
    async getNewAccessAndRefreshToken(_refToken) {
        let res = await API({
            method: 'get',
            url: `/kroger/refreshCookie`,
            headers: { refToken: _refToken }
        })
        await this.setAccessAndRefreshToken(res.data.access_token, res.data.refresh_token)
        return res.data;
    }

    //Get both access tokens and refresh tokens
    async getAccessAndRefreshToken() {
        let tokens = {};
        tokens._refToken = Cookies.get('_refToken');
        tokens._accToken = Cookies.get('_accToken');
        return tokens;
    }

    //Set the refresh token and access tokens.
    async setAccessAndRefreshToken(accessToken, refreshToken) {
        Cookies.set('_accToken', accessToken);
        Cookies.set('_refToken', refreshToken);
    }

    //Use only if the grant type = client credentials 
    async getAccessByCredentials() {
        let res = await API.get(`/kroger/clientCredentials`);
        this.setAccessByCredentials(res.data.access_token)
    }

    async setAccessByCredentials(accessToken) {
        Cookies.set('_accToken', accessToken)
    }

    async deleteTokens() {
        Cookies.remove('_accToken');
        Cookies.remove('_refToken');
    }

    async redirecToKrogerAuthPage() {
        // Must define all scopes needed for application
        const scope = encodeURIComponent('product.compact');
        // Build authorization URL
        const url =
            // Base URL (https://api.kroger.com/v1/connect/oauth2)
            `https://api.kroger.com/v1/connect/oauth2/authorize?` +
            // ClientId (specified in .env file)
            `client_id=${encodeURIComponent(clientId)}` +
            // Pre-configured redirect URL (http://localhost:3000/callback)
            `&redirect_uri=${encodeURIComponent('http://localhost:5000/api/kroger/callback')}` +
            // Grant type
            `&response_type=code` +
            // Scope specified above
            `&scope=${scope}`;
        // Browser redirects to the OAuth2 /authorize page
        window.location = url;

    }

    //main authentication point. 
    //This is used when the user first logs into the groccery application
    async redirectToGroceryAppAfterLoginByClientCredentials() {
        let res = await API.get(`/kroger/clientCredentials`);
        this.setAccessByCredentials(res.data.access_token);
    }

    //checks if the jwt token has expired and get new set of tokens
    async isAccessTokenExpired() {
        let tokens = await this.getAccessAndRefreshToken();
        if (tokens._accToken && tokens._refToken) {
            let isExpired = await this.decodeKrogerToken(tokens._accToken);
            if (isExpired) {
                let newSetTokens = await this.getNewAccessAndRefreshToken(tokens._refToken);
                await this.setAccessAndRefreshToken(newSetTokens.access_token, newSetTokens.refresh_token)
            }
        } else if (tokens._accToken) {

            let isExpired = await this.decodeKrogerToken(tokens._accToken);
            if (isExpired) {
                await this.getAccessTokenByClientCredentials()
            }

        }
    }

    //decode and check if token expired. 
    async decodeKrogerToken(accessToken) {
        let decodedToken = jwt.decode(accessToken, { complete: true });
        let isExpired = false;
        if (Date.now() >= decodedToken.payload.exp * 1000)
            isExpired = true;
        return isExpired;
    }

    //ig 
    async getAccessTokenByClientCredentials() {
        let res = await API.get(`/kroger/clientCredentials`);
        this.setAccessByCredentials(res.data.access_token)
    }

    //search api by item name, the users location, and starting index from database.
    async searchByItem(itemName, locationId, startFrom) {
        let tokens = await this.getAccessAndRefreshToken();

        return await API({
            method: 'get',
            url: `/kroger/${itemName}/${locationId}/${startFrom}`,
            data: {},
            headers: {
                Authorization: 'Bearer ' + tokens._accToken,
                refToken: tokens._refToken
            }
        });
    }

    //search api by item name, the users location, and starting index from database.
    async searchLocationByZipCode(zipCode) {
        let tokens = await this.getAccessAndRefreshToken();

        return await API({
            method: 'get',
            url: `/kroger/locations/${zipCode}/zipCode/location`,
            data: {},
            headers: {
                Authorization: 'Bearer ' + tokens._accToken,
                refToken: tokens._refToken
            }
        });
    }

}

export default KrogerService;