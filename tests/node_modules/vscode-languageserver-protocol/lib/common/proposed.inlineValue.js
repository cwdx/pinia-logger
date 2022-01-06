"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineValuesRefreshRequest = exports.InlineValuesRequest = void 0;
const messages_1 = require("./messages");
/**
 * A request to provide inline values in a document. The request's parameter is of
 * type [InlineValuesParams](#InlineValuesParams), the response is of type
 * [InlineValue[]](#InlineValue[]) or a Thenable that resolves to such.
 *
 * @since 3.17.0 - proposed state
 */
var InlineValuesRequest;
(function (InlineValuesRequest) {
    InlineValuesRequest.method = 'textDocument/inlineValues';
    InlineValuesRequest.type = new messages_1.ProtocolRequestType(InlineValuesRequest.method);
})(InlineValuesRequest = exports.InlineValuesRequest || (exports.InlineValuesRequest = {}));
/**
 * @since 3.17.0 - proposed state
 */
var InlineValuesRefreshRequest;
(function (InlineValuesRefreshRequest) {
    InlineValuesRefreshRequest.method = `workspace/inlineValues/refresh`;
    InlineValuesRefreshRequest.type = new messages_1.ProtocolRequestType0(InlineValuesRefreshRequest.method);
})(InlineValuesRefreshRequest = exports.InlineValuesRefreshRequest || (exports.InlineValuesRefreshRequest = {}));
//# sourceMappingURL=proposed.inlineValue.js.map