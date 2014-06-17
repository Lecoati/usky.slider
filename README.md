usky.slider
===========

uSky.Slider is a simple slider editor for Umbraco, based on the famous jquery plugin Slider Revolution http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848.

It allows create and edit on just a few clicks and on real time the slides and the layers of the slider.

This property editor involves only the slider editor, the Revolution Slider isn’t included in this package. The Jquery plugin can be find in codecanyon.net  http://codecanyon.net/item/slider-revolution-responsive-jquery-plugin/2580848

How to install

1.	Install uSky.Slider in your Umbraco 7 instance
2.	Create a new uSky.Slider dataType
3.	Add a new property uSky.Slider into a documentType
4.	Use the partial view uSkySlider.cshtml into the template, by default it looks for a property call slider
5.	After download the Slider Revolution widget and copy the folders rs-plugin and Css, add the links:

<!-- get jQuery from the google apis -->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.js"></script>

<!-- CSS STYLE-->
<link rel="stylesheet" type="text/css" href="/css/style.css" media="screen" />

<!-- SLIDER REVOLUTION 4.x SCRIPTS  -->
<script type="text/javascript" src="/rs-plugin/js/jquery.themepunch.plugins.min.js"></script>
<script type="text/javascript" src="/rs-plugin/js/jquery.themepunch.revolution.min.js"></script>

<!-- SLIDER REVOLUTION 4.x CSS SETTINGS -->
<link rel="stylesheet" type="text/css" href="/rs-plugin/css/settings.css" media="screen" />

