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
    translationhash: null,
    initializer: function () {
        var host = this.get('host');
        var initialvalue = host.textarea.get('value');
        var unusedhash = this.get('unusedhash');

        var foundtranslationspan = translationbuttonobject.translationhashregex.exec(initialvalue);
        if (!unusedhash || foundtranslationspan) {
            translationbuttonobject.translationhash = foundtranslationspan;
            return;
        }

        translationbuttonobject.translationhash = "<span data-translationhash='" + unusedhash + "'></span>";
        host.textarea.set('value', translationbuttonobject.translationhash + initialvalue);
        host.updateFromTextArea();

        var form = host.textarea.ancestor('form');
        if (form) {
            form.on('submit', function() {
                if (host.textarea.get('value') === translationbuttonobject.translationhash) {
                    host.textarea.set('value', '');
                    host.updateFromTextArea();
                }
            }, this);
        }
    }
};
Y.namespace('M.atto_translations').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], translationbuttonobject, {
    ATTRS: {
        unusedhash: {
            value: false
        }
    }
});
