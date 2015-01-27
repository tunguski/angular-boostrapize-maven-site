# Project

The goal of this project is to modernize maven generated sites without changing
default maven site plugin.

# What's done?

| Subject                  | What's done                                                 |
| --------------------:    | :---------------------------------------------------------- |
| **Look & Feel**          | Mobile first                                                |
|                          | Responsive by design                                        |
|                          | `Bootstrap 3.3` for layout                                  |
|                          | `Angular 1.3` for dynamic parts                             |
|                          | Imitate dynamic menu folding - remember state between pages |
| **Code highlight**       | Automatic code parts detection based on `highlightjs.org`   |
| **Table of content**     | Built basing on headers (`h1`, `h2`, `h3`) from page source |
| **Page header**          | Created from breadcrumb                                     |
| **Java source (JXR)**    | Built without frames with same style as main page           |
| **Javadocs**             | Built without frames with same style as main page           |
| **Reports**              | Dynamic creating reports from page source:                  |
|                          | **Linkage report** - shows broken links (only within page, no external links examined), size of site etc. |

# What's to be done?

| Subject                  | What's to be done                                           |
| --------------------:    | :---------------------------------------------------------- |
| **Look & Feel**          | In-page anchors are broken                                  |
|                          | Keep menu if moved to subdir and there is no new menu       |
| **Page header**          | Whole breadcrumb is one link, should be more intelligent    |
| **Java source (JXR)**    | Packages and classes list rework.                           |
| **Javadocs**             | Packages and classes list rework.                           |
| **Page indexer**         | Create database in `firebase.com` containing indexing results for searches and reports |
| **Page search**          | Create dynamic search that will show occurences of text in whole site with links |
| **Repository search**    | Integrate repository search that will still be in site's style |
| **Reports**              |                                                             |
|                          | **D3 page map** - graphical display of site                 |
