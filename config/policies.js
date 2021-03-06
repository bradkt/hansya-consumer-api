/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  AuthController: {
    '*': ['passport'],
    'local': true,
  },

  CampaignController: {
    '*': ['passport'],
    'create': ['passport', 'newCampaignPolicy'],
    'update': ['passport', 'campaignUpdatePolicy'],
    'all': ['passport', 'isAssociateOrAdminPolicy'],
    'destroy': ['passport','isAssociateOrAdminPolicy']
  },
  CampaignDataController: {
    '*': ['passport', 'isAllowedAccessToCampaignPolicy'],
    'upload': ['passport', 'isAssociateOrAdminPolicy']
  },
  IndustryController: {
    'create': ['passport', 'isAdminPolicy'],
    'destroy': ['passport', 'isAdminPolicy'],
    'update': ['passport', 'isAdminPolicy']
  },
  PaymentController:{
    'makePayment': ['passport','canMakePaymentPolicy']
  },
  ProductController: {
    'create': ['passport', 'isAdminPolicy'],
    'destroy': ['passport', 'isAdminPolicy'],
    'update': ['passport', 'isAdminPolicy']
  },
  UserController: {
    'create': ['passport', 'isNotRegisteredPolicy'],
    'all': ['passport', 'isAssociateOrAdminPolicy'],
    'update' : ['passport', 'isAdminPolicy'],
    'destroy' : ['passport', 'isAdminPolicy'],
    'changeRole' : ['passport', 'isAdminPolicy'],
    'find': ['passport'],
    '*' : true
  },



  //////////////////////////////////////////////////////////////////////////
  // Utility controllers
  SwaggerController: {
    '*': ['passport']
  }

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
  // RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
