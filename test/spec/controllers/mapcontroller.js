'use strict';

describe('Controller: MapcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('searchTestApp'));

  var MapcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapcontrollerCtrl = $controller('MapcontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MapcontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
