angular.module('mainController', ['authServices'])

	// Controller: mainCtrl is used to handle login and main index functions (stuff that should run on every page)	
	.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window) {
		var app = this;
		app.loadme = false; // Hide main HTML until data is obtained in AngularJS

		// Will run code every time a route changes
		$rootScope.$on('$routeChangeStart', function() {
			// Check if user is logged in
			if (Auth.isLoggedIn()) {
				app.isLoggedIn = true; // Variable to activate ng-show on index

				// Custom function to retrieve user data
				Auth.getUser().then(function(data) {
					app.username = data.data.username; // Get the user name for use in index
					app.useremail = data.data.email; // Get the user e-mail for us ein index
					app.loadme = true; // Show main HTML now that data is obtained in AngularJS
				});
			} else {
				app.isLoggedIn = false; // User is not logged in, set variable to falses
				app.username = ''; // Clear username
				app.loadme = true;  // Show main HTML now that data is obtained in AngularJS
			}
			if ($location.hash() == '_=_') $location.hash(null); // Check if facebook hash is added to URL
			app.disabled = false; // Re-enable any forms
			app.errorMsg = false; // Clear any error messages

		});

		// Function to redirect users to facebook authentication page
		this.facebook = function() {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
		};

		// Function to redirect users to twitter authentication page		
		this.twitter = function() {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
		};

		// Function to redirect users to google authentication page
		this.google = function() {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
		};

		// Function that performs login
		this.doLogin = function(loginData) {
			app.loading = true; // Start bootstrap loading icon
			app.errorMsg = false; // Clear errorMsg whenever user attempts a login
			app.expired = false; // Clear expired whenever user attempts a login 
			app.disabled = true; // Disable form on submission

			// Function that performs login
			Auth.login(app.loginData).then(function(data) {
				// Check if login was successful 
				if (data.data.success) {
					app.loading = false; // Stop bootstrap loading icon
					app.successMsg = data.data.message + '...Redirecting'; // Create Success Message then redirect
					// Redirect to home page after two milliseconds (2 seconds)
					$timeout(function() {
						$location.path('/'); // Redirect to home
						app.loginData = ''; // Clear login form
						app.successMsg = false; // CLear success message
						app.disabled = false; // Enable form on submission
					}, 2000);
				} else {
					// Check if the user's account is expired
					if (data.data.expired) {
						app.expired = true; // If expired, set variable to enable "Resend Link" on login page
						app.loading = false; // Stop bootstrap loading icon
						app.errorMsg = data.data.message; // Return error message to login page
					} else {
						app.loading = false; // Stop bootstrap loading icon
						app.disabled = false; // Enable form
						app.errorMsg = data.data.message; // Return error message to login page
					}
				}
			});
		};

		// Function to logout the user
		this.logout = function() {
			Auth.logout(); // Log out the user
			$location.path('/logout'); // Redirect them to the logout page

			// Redirect to home page after a delay
			$timeout(function() {
				$location.path('/'); // Route to home after 1000 milliseconds (1 second)
			}, 1000);
		};
	});





