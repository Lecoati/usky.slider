uSky.Slider
=========== 

uSky.Slider is a simple slider editor for Umbraco, based on the famous jQuery plugin Slider Revolution http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848.

It allows you to create and edit a slider’s layers and its slides in real time with just a few clicks.

This property editor only includes the slider editor, the Revolution Slider isn’t included in this package. The jQuery plugin can be found at codecanyon.net  http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848

Dependency
========== 

The jQuery Slider Revolution plugin is needed to display the slider on the page. This plugin can be found at codecanyon.net: http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848

1. Copy the “rs-plugin” to the site’s root.
2. Copy the “style.css” file into your css folder.
3. Add the links in your base template:

<!-- get jQuery from the google apis -->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.js"></script>

<!-- CSS STYLE-->
<link rel="stylesheet" type="text/css" href="/css/style.css" media="screen" />

<!-- SLIDER REVOLUTION 4.x SCRIPTS  -->
<script type="text/javascript" src="/rs-plugin/js/jquery.themepunch.plugins.min.js"></script>
<script type="text/javascript" src="/rs-plugin/js/jquery.themepunch.revolution.min.js"></script>

<!-- SLIDER REVOLUTION 4.x CSS SETTINGS -->
<link rel="stylesheet" type="text/css" href="/rs-plugin/css/settings.css" media="screen" />

How to install
==============

1. Install uSky.Slider package on your Umbraco 7 instance
2. Create a new uSky.Slider dataType
3. Add a new property of type uSky.Slider to a Document Type. By default uSkySlider looks for a property called “slider”.
4. Render the uSkySlider.cshtml partial view in your template with Html.Partial(“uSkySlider”) to display the slide.


