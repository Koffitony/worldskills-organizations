'use strict';

angular.module('orgApp')
	.service('authenticator', function(API_AUTH_CODE)
	{
		this.hasPermission = function(user, webServiceCode, permission)
        {
			if (!!user && !!user.roles)
			{
				for (var i=0; i<user.roles.length; i++)
				{
					if (user.roles[i].name == permission 
							&& user.roles[i].role_application.application_code == webServiceCode)
					{
						return true;
					}
				}
			}
			return false;
       	};
       	
       	this.hasPermissionForEntity = function(user, webServiceCode, permission, entity)
        {
			if (!!user && !!user.roles)
			{
				for (var i=0; i<user.roles.length; i++)
				{
					if (user.roles[i].name == permission 
							&& user.roles[i].role_application.application_code == webServiceCode
							&& user.roles[i].ws_entity.id == entity)
					{
						return true;
					}
				}
			}
			return false;
       	};
		
		this.authenticate = function(user)
		{
			return this.hasPermission(user, API_AUTH_CODE, 'Admin') || this.hasPermission(user, API_AUTH_CODE, 'Edit');
		}
	});