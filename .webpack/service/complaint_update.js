(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./complaint_update.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./complaint_update.js":
/*!*****************************!*\
  !*** ./complaint_update.js ***!
  \*****************************/
/*! exports provided: main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ "aws-sdk");
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _inc_response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inc/response */ "./inc/response.js");


const documentClient = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.DynamoDB.DocumentClient();

const main = (event, context, callback) => {

    const data = JSON.parse(event.body);
    console.log(data);

    /*
         1- approved
    */
    if (data.type == 1) {
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            Key: {
                complaintid: parseInt(event.pathParameters.complaintid)
            },
            UpdateExpression: `SET #status = :2`,
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ":2": 2
            },
            ReturnValues: "ALL_NEW"
        };

        documentClient.update(params, (err, result) => {
            if (err) {
                console.log(err);
                callback(null, Object(_inc_response__WEBPACK_IMPORTED_MODULE_1__["failure"])({ status: false, message: 'failed to registered complaint' }));
            } else {
                console.log(params);
                callback(null, Object(_inc_response__WEBPACK_IMPORTED_MODULE_1__["success"])({ status: true, message: 'successfully updated' }));
            }
        });
    }
    // decline complaints
    else if (data.type === 2) {
            const params = {
                TableName: process.env.COMPLAINTS_TABLE,
                Key: {
                    complaintid: parseInt(event.pathParameters.complaintid)
                },
                UpdateExpression: `SET #status = :5`,
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ":5": 5
                },
                ReturnValues: "ALL_NEW"
            };

            documentClient.update(params, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(null, Object(_inc_response__WEBPACK_IMPORTED_MODULE_1__["failure"])({ status: false, message: 'failed to registered complaint' }));
                } else {
                    console.log(params);
                    callback(null, Object(_inc_response__WEBPACK_IMPORTED_MODULE_1__["success"])({ status: true, message: 'successfully deleted' }));
                }
            });
        }
        // tranfer complaints
        else if (data.type == 3) {
                const params = {
                    TransactItems: [{
                        Update: {
                            TableName: process.env.COMPLAINTS_TABLE,
                            Key: {
                                complaintid: parseInt(result.complaintid)
                            },
                            UpdateExpression: `SET #officierid = :officierid, #officier_assigned = :officier_assigned, #status = :status`,
                            ExpressionAttributeNames: {
                                '#officierid': 'officierid',
                                '#officier_assigned': 'officier_assigned',
                                '#status': 'status'
                            },
                            ExpressionAttributeValues: {
                                ':officierid': parseInt(data.officierid),
                                ':officier_assigned': 1,
                                ':1': 1
                            },
                            ReturnValues: 'ALL_NEW'
                        }
                    }, {
                        Update: {
                            TableName: process.env.OFFICIERS_TABLE,
                            Key: {
                                officierid: parseInt(data.officierid)
                            },
                            UpdateExpression: `ADD #complaints :complaints`,
                            ExpressionAttributeNames: {
                                '#complaints': 'complaints'
                            },
                            ExpressionAttributeValues: {
                                ':complaints': documentClient.createSet([data.toString()])
                            },
                            ReturnValues: 'ALL_NEW'
                        }
                    }]
                };
                console.log(params.TransactItems);

                documentClient.transactWrite(params, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(params);
                        callback(null, Object(_inc_response__WEBPACK_IMPORTED_MODULE_1__["success"])({ status: true, message: 'successfully transfered' }));
                    }
                });
            }
};

/***/ }),

/***/ "./inc/response.js":
/*!*************************!*\
  !*** ./inc/response.js ***!
  \*************************/
/*! exports provided: success, failure */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "success", function() { return success; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "failure", function() { return failure; });
function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ })

/******/ })));
//# sourceMappingURL=complaint_update.js.map