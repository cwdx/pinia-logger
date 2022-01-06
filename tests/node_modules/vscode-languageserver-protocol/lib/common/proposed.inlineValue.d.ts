import { TextDocumentIdentifier, Range, InlineValue, InlineValuesContext } from 'vscode-languageserver-types';
import { RequestHandler, RequestHandler0 } from 'vscode-jsonrpc';
import { ProtocolRequestType, ProtocolRequestType0 } from './messages';
import { TextDocumentRegistrationOptions, WorkDoneProgressOptions, StaticRegistrationOptions, WorkDoneProgressParams } from './protocol';
/**
 * Client capabilities specific to inline values.
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesClientCapabilities {
    /**
     * Whether implementation supports dynamic registration for inline value providers.
     */
    dynamicRegistration?: boolean;
}
/**
 * Client workspace capabilities specific to inline values.
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesWorkspaceClientCapabilities {
    /**
     * Whether the client implementation supports a refresh request sent from the
     * server to the client.
     *
     * Note that this event is global and will force the client to refresh all
     * inline values currently shown. It should be used with absolute care and is
     * useful for situation where a server for example detect a project wide
     * change that requires such a calculation.
     */
    refreshSupport?: boolean;
}
/**
 * Inline values options used during static registration.
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesOptions extends WorkDoneProgressOptions {
}
/**
 * Inline value options used during static or dynamic registration.
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesRegistrationOptions extends InlineValuesOptions, TextDocumentRegistrationOptions, StaticRegistrationOptions {
}
/**
 * A parameter literal used in inline values requests.
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesParams extends WorkDoneProgressParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The visible document range for which inline values should be computed.
     */
    viewPort: Range;
    /**
     * Additional information about the context in which inline values were
     * requested.
     */
    context: InlineValuesContext;
}
/**
 * A request to provide inline values in a document. The request's parameter is of
 * type [InlineValuesParams](#InlineValuesParams), the response is of type
 * [InlineValue[]](#InlineValue[]) or a Thenable that resolves to such.
 *
 * @since 3.17.0 - proposed state
 */
export declare namespace InlineValuesRequest {
    const method: 'textDocument/inlineValues';
    const type: ProtocolRequestType<InlineValuesParams, InlineValue[] | null, InlineValue[], any, InlineValuesRegistrationOptions>;
    type HandlerSignature = RequestHandler<InlineValuesParams, InlineValue[] | null, void>;
}
/**
 * @since 3.17.0 - proposed state
 */
export declare namespace InlineValuesRefreshRequest {
    const method: `workspace/inlineValues/refresh`;
    const type: ProtocolRequestType0<void, void, void, void>;
    type HandlerSignature = RequestHandler0<void, void>;
}
