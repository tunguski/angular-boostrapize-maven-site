# Project

The goal of this project is to modernize maven generated sites without changing
default maven site plugin.

You may see effect at [maven.matsuo-it.com](http://maven.matsuo-it.com).

# What's done?

| Subject                  | What's done                                                 |
| --------------------:    | :---------------------------------------------------------- |
| **Look & Feel**          | Mobile first                                                |
|                          | Responsive by design                                        |
|                          | Skins from [bootswatch.com](http://bootswatch.com)! LocalStorage used for skin memory. |
|                          | [Bootstrap 3.3](http://getbootstrap.com) for layout         |
|                          | [Angular 1.4](https://angularjs.org) for dynamic parts      |
|                          | Imitate dynamic menu folding - remember state between pages |
| **Code highlight**       | Automatic code parts detection based on [highlightjs.org](https://highlightjs.org) |
| **Table of content**     | Built basing on headers (`h1`, `h2`, `h3`) from page source |
| **Page header**          | Created from breadcrumb                                     |
| **Java source (JXR)**    | Built without frames with same style as main page           |
|                          | Packages and classes list reworked. Added collapsing, grouping. |
| **Javadocs**             | Built without frames with same style as main page           |
|                          | Packages and classes list reworked. Added collapsing, grouping. |
| **Repository search**    | **[beta]** Simple search based on [search.maven.org](https://search.maven.org) |
| **Reports**              | Dynamic creating reports from page source:                  |
|                          | **Linkage report** - shows broken links (only within page, no external links examined), size of site etc. |

# What's to be done?

| Subject                  | What's to be done                                           |
| --------------------:    | :---------------------------------------------------------- |
| **Look & Feel**          | In-page anchors are broken                                  |
|                          | Keep menu if moved to subdir and there is no new menu       |
|                          | Images from page content should be displayed                |
|                          | Code highlighting matching chosen skin                      |
| **Page header**          | Whole breadcrumb is one link, should be more intelligent    |
| **Java source (JXR)**    | Search provider for packages, classes and sources.          |
| **Javadocs**             | Search provider for packages, classes and sources.          |
| **Page indexer**         | Create database in [firebase.com](https://firebase.com) containing indexing results for searches and reports |
| **Page search**          | Create dynamic search that will show occurences of text in whole site with links |
| **Repository search**    | Integrate repository search that will still be in site's style |
| **Reports**              |                                                             |
|                          | **D3 page map** - graphical display of site                 |
