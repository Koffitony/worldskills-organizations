'use strict';

describe('Service: WSAlert', function () {

  // load the service's module
  beforeEach(module('orgApp'));

  // instantiate service
  var WSAlert;
  beforeEach(inject(function (_WSAlert_) {
    WSAlert = _WSAlert_;
  }));

  it('should do something', function () {
    expect(!!WSAlert).toBe(true);
  });

});
