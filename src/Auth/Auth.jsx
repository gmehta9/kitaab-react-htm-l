
class Auth {
    authenticated = false;
    localId = '__uid__kjstore';
    storageType = localStorage;
    uts = "buyerUser"
    utb = "sellerUser"
    login(user, useType, isRememberMe) {
        // const storage = isRememberMe ?  : sessionStorage;
        this.storageType.setItem(`${this.localId}`, JSON.stringify(user));

        if (user) {
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
    };

    loggedInUser() {
        const loggedUser = this.storageType.getItem(this.localId)
        return (JSON.parse(loggedUser || "null"));
    }

    token() {
        const user = JSON.parse((this.storageType.getItem(this.localId) || 'null'));
        return user?.token || null;
    }

    logout() {
        this.storageType.removeItem(this.localId);
        this.authenticated = false;
    }

    isUserAuthenticated() {
        if (this.storageType.getItem(this.localId)) {
            return true;
        } else {
            return false;
        }
    }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new Auth();