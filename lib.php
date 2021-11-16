<?php
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

use filter_translations\translation;

defined('MOODLE_INTERNAL') || die;

function atto_translations_strings_for_js() {
}

function atto_translations_params_for_js($elementid, $options, $fpoptions) {
    $unusedhash = md5(random_string(32));

    // Do our best to make sure it's unique.
    while (!empty(translation::get_record(['md5key' => $unusedhash])) || !empty(translation::get_record(['lastgeneratedhash' => $unusedhash]))) {
        $unusedhash = md5(random_string(32));
    }

    return ['unusedhash' => $unusedhash];
}
