'use strict';

angular.module('orgApp')
  .controller('MemberInfoCtrl', function ($scope, $rootScope, $stateParams, $translate, Language, auth, user,
		  WSAlert, Restangular, API_IMAGES, FileUploader, $modal) {

	  // initialise variables
	  $scope.memberId = $stateParams.member_id;
	  $scope.savingMember = false;
	  $scope.editOrg = false;
	  $scope.savingOrg = false;
	  $scope.showOrgForm = false;
	  $scope.newOrg = {};
	  $scope.chooseOrgModal = false;

	  // set up flag uploader
	  $scope.uploader = new FileUploader({
          scope: $scope,
          queueLimit: 1,
          url: API_IMAGES,
          formData: [
              { key: 'value' }
          ],
          headers: {
        	  'Authorization': 'bearer ' + sessionStorage.getItem('access_token')
          },
          filters: []
      });
	  $scope.clearUploadQueue = function()
	  {
		  $scope.uploader.clearQueue();
	  };

	  $scope.saveMemberInfo = function()
	  {
		  // check if the link should be disabled
		  if ($scope.savingMember || (!user.hasPermission('Admin') && !user.hasPermissionForEntity('EditMember', $scope.member.ws_entity.id)))
			  return;

		  $scope.savingMember = true;
		  // do we have a new image to save?
		  if ($scope.uploader.queue.length > 0)
		  {
			  $scope.uploader.queue[0].url = API_IMAGES;
			  $scope.uploader.queue[0].method = 'POST';
			  //$scope.uploader.queue[0].formData.push({'requestData': angular.toJson(data)});
			  $scope.uploader.queue[0].upload();
		  }
		  else
		  {
			  $scope.sendMemberUpdate();
		  }
	  };
	  $scope.uploader.onErrorItem = function(item, response, status, headers)
	  {
		  $scope.savingMember = false;
		  $translate('couldNotUploadImage').then(function(msg)
       	  {
        	  WSAlert.danger(msg);
          });
	  }
	  $scope.uploader.onSuccessItem = function(item, response, status, headers)
	  {
		  // now that the upload is complete, send the update to the member with the new image
		  $scope.sendMemberUpdate(response.id, response.thumbnail_hash);
	  };
	  // send the update request
	  $scope.sendMemberUpdate = function(imageId, thumbnail)
	  {
		  var data = {
			  "code": $scope.member.code,
			  "name": {
				  "lang_code": "en",
				  "text": $scope.member.name.text
			  },
			  "name_1058": {
				  "lang_code": "en",
				  "text": $scope.member.name_1058.text
			  },
		  };
		  if (imageId !== undefined && imageId !== null && thumbnail !== undefined && thumbnail !== null)
		  {
			  data.flag = {
				  "image_id": imageId,
				  "thumbnail_hash": thumbnail
			  }
		  }
		  Restangular.one('/org/members/' + $scope.memberId).customPUT(data)
		  	  .then(function(response) {
		  		  $scope.clearUploadQueue();
		  		  $scope.savingMember = false;
		  		  $scope.member = response;
		  		  document.body.scrollTop = document.documentElement.scrollTop = 0;
		  		  $translate('saveMemberMsg').then(function(msg)
		  		  {
			  		  WSAlert.success(msg);
		  		  });
			  }, function(response) {
				  $scope.savingMember = false;
			  	  $rootScope.errorHandler(response);
			  });
	  };

    $scope.removeFlag = function() {
      $translate('RemoveFlagConfirm').then(function(msg)
		  {
			  if (confirm(msg))
			  {
          Restangular.one('/org/members/' + $scope.memberId + '/flag').customDELETE()
            .then(function(response) {
              $scope.getMember($scope.memberId);
              $translate('flagRemovedMsg').then(function(msg)
              {
                WSAlert.success(msg);
              });
            }, function(response) {
    				    $scope.savingMember = false;
    			  	  $rootScope.errorHandler(response);
    			  });
          }
  			  else
  			  {
  				  $scope.savingMember = false;
  			  }
  		  });
    }

  });
