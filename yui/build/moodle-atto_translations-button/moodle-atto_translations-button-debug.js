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

var translationbuttonobject = {
    translationhashregex: /<span data-translationhash[ ]*=[ ]*[\'"]+([a-zA-Z0-9]+)[\'"]+[ ]*>[ ]*<\/span>/,
    initializer: function () {
        var button = this.addButton({
            icon: 't/reload',
            callback: this._replaceHash,
            title: 'replacehash'
        });

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
        button.setAttribute('disabled', 'disabled');

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
     _replaceHash: function() {
        const alltranslationhashregex = /<span data-translationhash[ ]*=[ ]*[\'"]+([a-zA-Z0-9]+)[\'"]+[ ]*>[ ]*<\/span>/g;
        var translationhash;
        var unusedhash = this.get('unusedhash');

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
};
Y.namespace('M.atto_translations').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], translationbuttonobject, {
    ATTRS: {
        unusedhash: {
            value: false
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
