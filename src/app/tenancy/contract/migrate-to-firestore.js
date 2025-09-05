"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin_config_1 = require("../../../../lib/firebase/admin-config");
var propertiesData = [
    {
        "id": "PROP-1756020845219",
        "propertyData": {
            "code": "LT-C38",
            "name": "Lewa Tower",
            "propertyType": "Building",
            "bondType": "",
            "landlordCode": "L-001",
            "status": "Active",
            "plotArea": "0",
            "builtUpArea": "0",
            "noOfFloors": "0",
            "noOfUnits": "80",
            "noOfParkings": "0",
            "address1": "Hazza Bin Zayed The First Street",
            "address2": "",
            "emirates": "",
            "country1": "",
            "propertyPosition": "",
            "accountant": "Accountant",
            "salesMan": "SalesMan",
            "location": "Location",
            "towerType": "Rent",
            "gps": "",
            "propertyNo": "",
            "assetManager": "Supervisor"
        },
        "particulars": [],
        "attachments": [],
        "propertyPhoto": null
    }
];
var tenantsData = [
    {
        "id": "T1756645873317",
        "tenantData": {
            "code": "T0001",
            "name": "Md Ripon Ahmed",
            "mobile": "0509231340",
            "email": "",
            "address": "Village : Rahut Hati , Post office : Hasnabad",
            "contractNo": "",
            "attachments": [],
            "eid": "",
            "occupation": "",
            "brokerName": "",
            "brokerMobile": "",
            "brokerEmail": "",
            "brokerCommission": 0,
            "property": "",
            "unitCode": "",
            "roomCode": "",
            "isSubscriptionActive": false,
            "subscriptionAmount": 0
        },
        "attachments": []
    },
    {
        "id": "T1756651681718",
        "tenantData": {
            "code": "T0002",
            "name": "Tanvir Ahmed",
            "mobile": "",
            "email": "",
            "address": "",
            "contractNo": "",
            "attachments": [],
            "eid": "",
            "occupation": "",
            "brokerName": "",
            "brokerMobile": "",
            "brokerEmail": "",
            "brokerCommission": 0,
            "isSubscriptionActive": true,
            "subscriptionAmount": 677,
            "occupancyStatus": "Occupied",
            "property": "LT-C38",
            "unitCode": "F101",
            "roomCode": "Room-1/A",
            "subscriptionStatus": "Monthly"
        }
    },
    {
        "id": "T1756657968941",
        "tenantData": {
            "code": "T0003",
            "name": "Sagar Hossain",
            "mobile": "0524544324",
            "email": "",
            "address": "Al Amin Corner Contracting",
            "contractNo": "",
            "eid": "",
            "occupation": "",
            "brokerName": "",
            "brokerMobile": "",
            "brokerEmail": "",
            "brokerCommission": 0,
            "isSubscriptionActive": true,
            "subscriptionAmount": 900,
            "attachments": [],
            "occupancyStatus": "Occupied",
            "property": "LT-C38",
            "unitCode": "F101",
            "roomCode": "Room-1/B",
            "subscriptionStatus": "Monthly"
        },
        "attachments": []
    }
];
function migrateContractsToFirestore() {
    return __awaiter(this, void 0, void 0, function () {
        var propertiesCollection, _i, propertiesData_1, property, tenantsCollection, _a, tenantsData_1, tenant;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    propertiesCollection = admin_config_1.firestoreAdmin.collection('properties');
                    _i = 0, propertiesData_1 = propertiesData;
                    _b.label = 1;
                case 1:
                    if (!(_i < propertiesData_1.length)) return [3 /*break*/, 4];
                    property = propertiesData_1[_i];
                    return [4 /*yield*/, propertiesCollection.doc(property.id).set(property)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    tenantsCollection = admin_config_1.firestoreAdmin.collection('tenants');
                    _a = 0, tenantsData_1 = tenantsData;
                    _b.label = 5;
                case 5:
                    if (!(_a < tenantsData_1.length)) return [3 /*break*/, 8];
                    tenant = tenantsData_1[_a];
                    return [4 /*yield*/, tenantsCollection.doc(tenant.id).set(tenant)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
migrateContractsToFirestore().then(function () { return console.log('Migration complete.'); }).catch(console.error);
