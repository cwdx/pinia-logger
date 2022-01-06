import { Proposed, InlineValue } from 'vscode-languageserver-protocol';
import type { Feature, _Languages, ServerRequestHandler } from './server';
/**
 * Shape of the inline values feature
 *
 * @since 3.17.0 - proposed state
 */
export interface InlineValuesFeatureShape {
    inlineValues: {
        /**
         * Installs a handler for the inline values request.
         *
         * @param handler The corresponding handler.
         */
        on(handler: ServerRequestHandler<Proposed.InlineValuesParams, InlineValue[] | undefined | null, InlineValue[], void>): void;
    };
}
export declare const InlineValuesFeature: Feature<_Languages, InlineValuesFeatureShape>;
