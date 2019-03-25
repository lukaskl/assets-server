/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../ioc/container';
import { UsersController } from './../modules/users/users.controller';
import { AuthController } from './../modules/auth/auth.controller';
import { AssetsController } from './../modules/assets/assets.controller';
import { AssetTypesController } from './../modules/assetTypes/assetTypes.controller';
import { AllocationsController } from './../modules/allocations/allocations.controller';
import { expressAuthentication } from './authentication';
import * as express from 'express';

const models: TsoaRoute.Models = {
    "UserResponse": {
        "properties": {
            "uuid": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
        },
    },
    "UserCreateRequest": {
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
        },
    },
    "UserUpdateRequest": {
        "properties": {
            "email": { "dataType": "string" },
            "password": { "dataType": "string" },
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
        },
    },
    "AuthPayload": {
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "AssetTypeResponse": {
        "properties": {
            "uuid": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "attributes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "AssetResponse": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "type": { "ref": "AssetTypeResponse", "required": true },
            "attributeValues": { "dataType": "any", "required": true },
        },
    },
    "AssetCreateRequest": {
        "properties": {
            "typeCode": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "attributeValues": { "dataType": "any", "required": true },
        },
    },
    "AssetUpdateRequest": {
        "properties": {
            "typeCode": { "dataType": "string" },
            "name": { "dataType": "string" },
            "attributeValues": { "dataType": "any" },
        },
    },
    "AssetTypeCreateRequest": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "attributes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "AssetTypeUpdateRequest": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "attributes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
    },
    "AllocationResponse": {
    },
    "AllocationCreateRequest": {
    },
    "AllocationUpdateRequest": {
    },
};
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
    app.get('/users',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                skip: { "default": 0, "in": "query", "name": "skip", "dataType": "integer", "validators": { "isInt": { "errorMsg": "skip" }, "minimum": { "value": 0 } } },
                take: { "default": 100, "in": "query", "name": "take", "dataType": "integer", "validators": { "isInt": { "errorMsg": "take" }, "minimum": { "value": 0 }, "maximum": { "value": 100 } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/users/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.get.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/users',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "UserCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.create.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/users/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
                request: { "in": "body", "name": "request", "required": true, "ref": "UserUpdateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.update.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/users/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UsersController>(UsersController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.delete.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/auth/login',
        function(request: any, response: any, next: any) {
            const args = {
                model: { "in": "body", "name": "model", "required": true, "ref": "AuthPayload" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AuthController>(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.login.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/auth/signup',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "UserCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AuthController>(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.signup.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/assets',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                skip: { "default": 0, "in": "query", "name": "skip", "dataType": "integer", "validators": { "isInt": { "errorMsg": "skip" }, "minimum": { "value": 0 } } },
                take: { "default": 100, "in": "query", "name": "take", "dataType": "integer", "validators": { "isInt": { "errorMsg": "take" }, "minimum": { "value": 0 }, "maximum": { "value": 100 } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetsController>(AssetsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/assets/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetsController>(AssetsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.get.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/assets',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "AssetCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetsController>(AssetsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.create.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/assets/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
                request: { "in": "body", "name": "request", "required": true, "ref": "AssetUpdateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetsController>(AssetsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.update.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/assets/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetsController>(AssetsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.delete.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/assetTypes',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                skip: { "default": 0, "in": "query", "name": "skip", "dataType": "integer", "validators": { "isInt": { "errorMsg": "skip" }, "minimum": { "value": 0 } } },
                take: { "default": 100, "in": "query", "name": "take", "dataType": "integer", "validators": { "isInt": { "errorMsg": "take" }, "minimum": { "value": 0 }, "maximum": { "value": 100 } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetTypesController>(AssetTypesController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/assetTypes/:uuidOrCode',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuidOrCode: { "in": "path", "name": "uuidOrCode", "required": true, "dataType": "string", "validators": { "minLength": { "value": 2 } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetTypesController>(AssetTypesController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.get.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/assetTypes',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "AssetTypeCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetTypesController>(AssetTypesController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.create.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/assetTypes/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
                request: { "in": "body", "name": "request", "required": true, "ref": "AssetTypeUpdateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetTypesController>(AssetTypesController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.update.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/assetTypes/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AssetTypesController>(AssetTypesController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.delete.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/allocations',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                skip: { "default": 0, "in": "query", "name": "skip", "dataType": "integer", "validators": { "isInt": { "errorMsg": "skip" }, "minimum": { "value": 0 } } },
                take: { "default": 100, "in": "query", "name": "take", "dataType": "integer", "validators": { "isInt": { "errorMsg": "take" }, "minimum": { "value": 0 }, "maximum": { "value": 100 } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AllocationsController>(AllocationsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/allocations/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AllocationsController>(AllocationsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.get.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/allocations',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "AllocationCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AllocationsController>(AllocationsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.create.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/allocations/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
                request: { "in": "body", "name": "request", "required": true, "ref": "AllocationUpdateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AllocationsController>(AllocationsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.update.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/allocations/:uuid',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                uuid: { "in": "path", "name": "uuid", "required": true, "dataType": "string", "validators": { "pattern": { "value": "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}" } } },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AllocationsController>(AllocationsController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.delete.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = 401;
                    next(error)
                }
            }

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
