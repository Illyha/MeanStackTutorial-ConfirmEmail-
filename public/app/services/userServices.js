angular.module('userServices', [])

    .factory('User', function($http) {
        var userFactory = {}; // Create the userFactory object

        // Register users in database
        userFactory.create = function(regData) {
            return $http.post('/api/users', regData);
        }

        // Check if username is available at registration
        userFactory.checkUsername = function(regData) {
            return $http.post('/api/checkusername', regData);
        }

        // Check if e-mail is available at registration
        userFactory.checkEmail = function(regData) {
            return $http.post('/api/checkemail', regData);
        }

        // Activate user account with e-mail link
        userFactory.activateAccount = function(token) {
            return $http.put('/api/activate/' + token);
        }

        // Check credentials before re-sending activation link
        userFactory.checkCredentials = function(loginData) {
            return $http.post('/api/resend', loginData);
        };

        // Send new activation link to user
        userFactory.resendLink = function(username) {
            return $http.put('/api/resend', username)
        }

        return userFactory; // Return userFactory object
    });


