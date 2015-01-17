# Project

The goal of this project is to modernize maven generated sites without changing
default maven site plugin.

# What's done?

* Totally new look 'n feel
* Mobile first, responsive by design
* Works on sites generated with default and fluido skins
    * Some fluido configurations are still broken
* Based on Bootstrap 3.3
* Angular 1.3 for dynamic parts
* Code highlight
* Auto TOC generation (right bar)
* Auto page header discovery
* No frames in jxr, style consistent with rest of the site
* Report generation
    * Actually one is provided - broken links report

# What's to be done?

* Improve page header generation
    * Today it creates only one link from whole breadcrumb
* In-page anchors are broken
* Replace anchor based location to path based (HTML5)
* Javadocs are broken