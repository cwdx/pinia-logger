/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineValuesFeature = void 0;
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const InlineValuesFeature = (Base) => {
    return class extends Base {
        get inlineValues() {
            return {
                on: (handler) => {
                    this.connection.onRequest(vscode_languageserver_protocol_1.Proposed.InlineValuesRequest.type, (params, cancel) => {
                        return handler(params, cancel, this.attachWorkDoneProgress(params));
                    });
                }
            };
        }
    };
};
exports.InlineValuesFeature = InlineValuesFeature;
//# sourceMappingURL=proposed.inlineValues.js.map