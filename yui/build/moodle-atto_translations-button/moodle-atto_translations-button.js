YUI.add('moodle-atto_translations-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package atto_translations
 * @author Andrew Hancox <andrewdchancox@googlemail.com>
 * @author Open Source Learning <enquiries@opensourcelearning.co.uk>
 * @link https://opensourcelearning.co.uk
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright 2021, Andrew Hancox
 */

var COMPONENTNAME = 'atto_translations',
    CSS = {
        CONFIRMTEXT: 'atto_translations_confirmtext'
    },
    SELECTORS = {
        CONFIRMTEXT: '.atto_translations_confirmtext',
        SUBMIT: '.submit',
        CANCEL: '.cancel'
    },
    TEMPLATE = '' +
        '<form class="atto_form">' +
        '<div class="mb-1">' +
        '<label for="{{elementid}}_atto_translations_confirmtext">{{get_string "confirmtext" component}}</label>' +
        '</div>' +
        '<div class="mdl-align">' +
        '<br/>' +
        '<button type="button" class="btn btn-primary submit">{{get_string "yes" "moodle"}}</button> ' +
        '<button type="button" class="btn btn-secondary cancel">{{get_string "cancel" "moodle"}}</button>' +
        '</div>' +
        '</form>';

var translationbuttonobject = {
    translationhashregex: /<span data-translationhash[ ]*=[ ]*[\'"]+([a-zA-Z0-9]+)[\'"]+[ ]*>[ ]*<\/span>/,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,

    initializer: function () {
        var button = null;
        // Should the user see the replace hash button?
        if (this.get('showreplacebutton')) {
            button = this.addButton({
                icon: 'icon',
                iconComponent: 'atto_translations',
                //callback: this._replaceHash,
                callback: this._displayDialogue,
                title: 'replacehash'
            });
        }

        var translationhash;
        var host = this.get('host');
        var initialvalue = host.textarea.get('value');
        var unusedhash = this.get('unusedhash');

        var foundtranslationspan = translationbuttonobject.translationhashregex.exec(initialvalue);
        if (!unusedhash || foundtranslationspan) {
            translationhash = foundtranslationspan;
            return;
        }

        translationhash = "<span data-translationhash=\"" + unusedhash + "\"></span>";
        host.textarea.set('value', translationhash + initialvalue);
        host.updateFromTextArea();

        // TODO: We are adding a new hash, so cannot replace the hash.
        // Disable the replace hash button.
        if (button != null) {
            button.setAttribute('disabled', 'disabled');
        }

        var form = host.textarea.ancestor('form');
        if (form) {
            form.on('submit', function() {
                if (host.textarea.get('value') === translationhash) {
                    host.textarea.set('value', '');
                    host.updateFromTextArea();
                }
            }, this);
        }
    },

    /**
     * Replace existing translation hash with a new hash value.
     *
     * @method _replaceHash
     * @private
     */
    _replaceHash: function(e) {
        const alltranslationhashregex = /<span data-translationhash[ ]*=[ ]*[\'"]+([a-zA-Z0-9]+)[\'"]+[ ]*>[ ]*<\/span>/g;
        var translationhash;
        var unusedhash = this.get('unusedhash');

        this._closeDialogue(e);

        // Get the initial content.
        var host = this.get('host');
        var initialvalue = host.textarea.get('value');

        // Remove the old translation span tags.
        initialvalue = initialvalue.replaceAll(alltranslationhashregex, "");

        // Add new translation span tag.
        translationhash = "<span data-translationhash=\"" + unusedhash + "\"></span>";
        host.textarea.set('value', translationhash + initialvalue);
        host.updateFromTextArea();

        // TODO: Disable the button, since only one hash can be generated??
    },

    /**
     * Close the dialogue.
     *
     * @method _closeDialogue
     * @private
     */
    _closeDialogue: function(e) {
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();
    },

    /**
     * Display the confirmation.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('confirm', 'moodle'),
            width: 'auto',
            focusAfterHide: true,
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent());

        dialogue.show();
    },

    /**
     * Generates the content of the dialogue.
     *
     * @method _getDialogueContent
     * @return {Node} Node containing the dialogue content
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);

        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            CSS: CSS
        }));

        this._content.one(SELECTORS.SUBMIT).on('click', this._replaceHash, this);
        this._content.one(SELECTORS.CANCEL).on('click', this._closeDialogue, this);

        return this._content;
    },
};
Y.namespace('M.atto_translations').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], translationbuttonobject, {
    ATTRS: {
        unusedhash: {
            value: false
        },
        showreplacebutton: {
			value: false
		}
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
