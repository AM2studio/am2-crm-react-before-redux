import axios from 'axios';

class WP_AUTH {
    constructor() {
        this.url = 'https://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token';
        this.validateUrl = 'https://oldcrm.am2studio.com/wp-json/jwt-auth/v1/token/validate';
        this.permissionsUrl = 'https://oldcrm.am2studio.com/wp-json/crm/v2/permissions';
        this.tokenKey = 'crmTokenKey';
        this.userName = 'crmUserName';
        this.permissions = 'permissions';
    }

    getSessionToken = () => localStorage.getItem(this.tokenKey);

    getPermissions = () => (localStorage.getItem(this.permissions) ? localStorage.getItem(this.permissions) : '');

    removeSessionToken = () => {
        localStorage.clear();
    };

    /* Used for private routes */
    isAuthenticated = () => {
        if (this.getSessionToken() === null) {
            return false;
        }
        return axios({
            method: 'post',
            url: this.validateUrl,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getSessionToken()}`
            }
        })
            .then(() => true)
            .catch(error => {
                console.log(error);
                this.removeSessionToken(); // if session has expired, remove it
                return false;
            });
    };

    /* Login */
    authenticate(username, password) {
        return axios
            .post(this.url, {
                username,
                password
            })
            .then(response => {
                localStorage.setItem(this.tokenKey, response.data.token);
                localStorage.setItem(this.userName, response.data.user_display_name);
                // Get role
                return axios({
                    method: 'post',
                    url: this.permissionsUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.getSessionToken()}`
                    }
                });
            })
            .then(response => {
                localStorage.setItem(this.permissions, response.data);
                return response.status;
            })
            .catch(error => {
                // handle error
                console.log(error);
                return error;
            });
    }
}

export default WP_AUTH;
